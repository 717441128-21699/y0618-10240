import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Activity, Item, Bid, Order, DonationReceipt, FundRecord, ActivityReport, SettlementItem } from '../types';
import { mockActivities, mockItems, mockBids, mockReceipts, mockFundRecords } from '../mock';
import { generateId } from '../utils';
import { useOrderStore } from './useOrderStore';
import { useUserStore } from './useUserStore';

interface ActivityState {
  activities: Activity[];
  items: Item[];
  bids: Bid[];
  receipts: DonationReceipt[];
  fundRecords: FundRecord[];
  getActivityById: (id: string) => Activity | undefined;
  getItemsByActivityId: (activityId: string) => Item[];
  getItemById: (id: string) => Item | undefined;
  getBidsByItemId: (itemId: string) => Bid[];
  getActivitiesByOrgId: (orgId: string) => Activity[];
  getReceiptsByActivityId: (activityId: string) => DonationReceipt[];
  getFundRecordsByActivityId: (activityId: string) => FundRecord[];
  getReport: (activityId: string) => ActivityReport;
  createActivity: (data: Omit<Activity, 'id' | 'currentAmount' | 'participantCount' | 'itemCount' | 'status' | 'createdAt'>) => string;
  addItem: (data: Partial<Pick<Item, 'donorId' | 'deliveryDesc'>> & Omit<Item, 'id' | 'currentPrice' | 'bidCount' | 'viewerCount' | 'status' | 'createdAt' | 'images' | 'donorId' | 'deliveryDesc'> & { images?: string[] }) => string;
  placeBid: (itemId: string, userId: string, userName: string, userAvatar: string, amount: number) => boolean;
  buyNow: (itemId: string, userId: string, userName: string) => { success: boolean; orderId?: string };
  finalizeAuction: (itemId: string) => boolean;
  endActivity: (activityId: string) => void;
  settleActivity: (activityId: string, operationCostRate?: number) => boolean;
  addReceipt: (receipt: Omit<DonationReceipt, 'id' | 'donateTime'> & { donateTime?: string }) => string;
  updateReceipt: (id: string, data: Partial<DonationReceipt>) => void;
  deleteReceipt: (id: string) => void;
  addFundRecord: (record: Omit<FundRecord, 'id' | 'createdAt'> & { createdAt?: string }) => string;
  payOrder: (orderId: string) => void;
  shipOrder: (orderId: string, trackingNo?: string) => void;
  confirmReceive: (orderId: string) => void;
  incrementItemViewer: (itemId: string) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: mockActivities,
      items: mockItems,
      bids: mockBids,
      receipts: mockReceipts,
      fundRecords: mockFundRecords,

      getActivityById: (id: string) => get().activities.find(a => a.id === id),

      getItemsByActivityId: (activityId: string) => get().items.filter(item => item.activityId === activityId),

      getItemById: (id: string) => get().items.find(item => item.id === id),

      getBidsByItemId: (itemId: string) => get().bids
        .filter(bid => bid.itemId === itemId)
        .sort((a, b) => b.amount - a.amount),

      getActivitiesByOrgId: (orgId: string) => get().activities.filter(a => a.orgId === orgId),

      getReceiptsByActivityId: (activityId: string) => get().receipts.filter(r => r.activityId === activityId),

      getFundRecordsByActivityId: (activityId: string) => get().fundRecords.filter(r => r.activityId === activityId),

      getReport: (activityId: string): ActivityReport => {
        const activity = get().getActivityById(activityId);
        if (!activity) {
          throw new Error('Activity not found');
        }

        const items = get().getItemsByActivityId(activityId);
        const soldItems = items.filter(i => i.status === 'sold');
        const bids = get().bids.filter(b => b.activityId === activityId);
        const { orders } = useOrderStore.getState();
        const allUsers = useUserStore.getState().allUsers;

        const activityOrders = orders.filter(o => o.activityId === activityId);
        const opRate = activity.operationCostRate || 5;

        const settlementItems: SettlementItem[] = soldItems.map(item => {
          const order = activityOrders.find(o => o.itemId === item.id);
          const buyer = order ? allUsers.find(u => u.id === order.userId) : undefined;
          const finalPrice = order?.amount || item.currentPrice;
          const operationCost = Math.round(finalPrice * opRate / 100 * 100) / 100;
          const donationAmount = finalPrice - operationCost;

          return {
            itemId: item.id,
            itemName: item.name,
            itemImage: item.image,
            itemType: item.type,
            buyerId: order?.userId || '',
            buyerName: buyer?.name || '爱心人士',
            buyerAvatar: buyer?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
            finalPrice,
            orderStatus: order?.status || 'pending_pay',
            orderId: order?.id || '',
            orderType: order?.type || 'auction',
            donorName: item.donorName,
            operationCost,
            donationAmount,
          };
        });

        const totalIncome = settlementItems.reduce((sum, s) => sum + s.finalPrice, 0);
        const totalPaidIncome = settlementItems
          .filter(s => s.orderStatus === 'paid' || s.orderStatus === 'shipped' || s.orderStatus === 'completed')
          .reduce((sum, s) => sum + s.finalPrice, 0);
        const totalUnpaid = settlementItems
          .filter(s => s.orderStatus === 'pending_pay')
          .reduce((sum, s) => sum + s.finalPrice, 0);
        const totalOperationCost = Math.round(totalIncome * opRate / 100 * 100) / 100;
        const totalDonationAmount = totalIncome - totalOperationCost;

        return {
          activityId,
          activityTitle: activity.title,
          orgName: activity.orgName,
          projectName: activity.projectName,
          totalIncome,
          totalPaidIncome,
          totalUnpaid,
          operationCostRate: opRate,
          totalOperationCost,
          totalDonationAmount,
          participantCount: activity.participantCount,
          itemCount: activity.itemCount,
          soldCount: soldItems.length,
          bidCount: bids.length,
          items: settlementItems,
          fundRecords: get().getFundRecordsByActivityId(activityId),
          receipts: get().getReceiptsByActivityId(activityId),
          generatedAt: new Date().toISOString(),
          settled: activity.settled || false,
          settledAt: activity.settlementAt,
        };
      },

      createActivity: (data) => {
        const activityId = 'act-' + generateId();
        const newActivity: Activity = {
          id: activityId,
          currentAmount: 0,
          participantCount: 0,
          itemCount: 0,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
          operationCostRate: 5,
          ...data,
        };
        set(state => ({
          activities: [newActivity, ...state.activities],
        }));
        return activityId;
      },

      addItem: (data) => {
        const itemId = 'item-' + generateId();
        const avatarSeed = encodeURIComponent(data.donorName || 'donor');
        const newItem: Item = {
          id: itemId,
          currentPrice: data.startPrice,
          bidCount: 0,
          viewerCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          images: data.images || [data.image],
          donorId: data.donorId || '',
          donorAvatar: data.donorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
          deliveryDesc: data.deliveryDesc || '由捐赠方包邮寄出，一般48小时内安排发货',
          ...data,
        } as Item;

        set(state => ({
          items: [newItem, ...state.items],
          activities: state.activities.map(a =>
            a.id === data.activityId
              ? { ...a, itemCount: a.itemCount + 1 }
              : a
          ),
        }));
        return itemId;
      },

      placeBid: (itemId: string, userId: string, userName: string, userAvatar: string, amount: number) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item || item.status !== 'active') return false;

        const minBid = item.currentPrice + item.minIncrement;
        if (amount < minBid) return false;

        const activity = get().activities.find(a => a.id === item.activityId);
        if (!activity || activity.status !== 'ongoing') return false;

        const newBid: Bid = {
          id: 'bid-' + generateId(),
          userId,
          userName,
          userAvatar,
          itemId,
          activityId: item.activityId,
          amount,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          bids: [newBid, ...state.bids],
          items: state.items.map(i =>
            i.id === itemId
              ? { ...i, currentPrice: amount, bidCount: i.bidCount + 1 }
              : i
          ),
        }));

        return true;
      },

      buyNow: (itemId: string, userId: string, userName: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item || !item.buyNowPrice || item.status !== 'active') {
          return { success: false };
        }

        const activity = get().activities.find(a => a.id === item.activityId);
        if (!activity || activity.status !== 'ongoing') {
          return { success: false };
        }

        set(state => ({
          items: state.items.map(i =>
            i.id === itemId ? { ...i, status: 'sold' as const } : i
          ),
        }));

        const orderId = useOrderStore.getState().addOrder({
          userId,
          itemId,
          activityId: item.activityId,
          itemName: item.name,
          itemImage: item.image,
          itemType: item.type,
          amount: item.buyNowPrice,
          type: 'buynow',
          donorName: item.donorName,
        });

        return { success: true, orderId };
      },

      finalizeAuction: (itemId: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item || item.status !== 'active') return false;

        const bids = get().getBidsByItemId(itemId);
        if (bids.length === 0) {
          set(state => ({
            items: state.items.map(i =>
              i.id === itemId ? { ...i, status: 'ended' as const } : i
            ),
          }));
          return false;
        }

        const highestBid = bids[0];

        set(state => ({
          items: state.items.map(i =>
            i.id === itemId ? { ...i, status: 'sold' as const } : i
          ),
        }));

        const orderId = useOrderStore.getState().addOrder({
          userId: highestBid.userId,
          itemId,
          activityId: item.activityId,
          itemName: item.name,
          itemImage: item.image,
          itemType: item.type,
          amount: highestBid.amount,
          type: 'auction',
          donorName: item.donorName,
        });

        const { addBid } = useUserStore.getState();
        addBid(highestBid);

        return true;
      },

      endActivity: (activityId: string) => {
        const activity = get().getActivityById(activityId);
        if (!activity || activity.status === 'ended') return;

        set(state => ({
          activities: state.activities.map(a =>
            a.id === activityId ? { ...a, status: 'ended' as const } : a
          ),
        }));
      },

      settleActivity: (activityId: string, operationCostRate = 5) => {
        const activity = get().getActivityById(activityId);
        if (!activity || activity.status !== 'ended' || activity.settled) return false;

        const report = get().getReport(activityId);
        const now = new Date().toISOString();

        set(state => ({
          activities: state.activities.map(a =>
            a.id === activityId ? {
              ...a,
              settled: true,
              settlementAt: now,
              operationCostRate,
              operationCostAmount: report.totalOperationCost,
              finalDonationAmount: report.totalDonationAmount,
            } : a
          ),
        }));

        if (report.totalOperationCost > 0) {
          get().addFundRecord({
            activityId,
            type: 'expense',
            title: '平台运营成本',
            amount: report.totalOperationCost,
            description: `平台技术维护、服务器、客服等运营成本，按${operationCostRate}%扣除`,
          });
        }

        if (report.totalDonationAmount > 0) {
          get().addFundRecord({
            activityId,
            type: 'expense',
            title: `捐赠至${activity.projectName}`,
            amount: report.totalDonationAmount,
            description: `活动全部成交款扣除运营成本后，捐赠至${activity.projectName}`,
          });
        }

        return true;
      },

      addReceipt: (receipt) => {
        const receiptId = 'receipt-' + generateId();
        const newReceipt: DonationReceipt = {
          id: receiptId,
          donateTime: new Date().toISOString(),
          ...receipt,
        };
        set(state => ({
          receipts: [newReceipt, ...state.receipts],
        }));
        return receiptId;
      },

      updateReceipt: (id, data) => {
        set(state => ({
          receipts: state.receipts.map(r => r.id === id ? { ...r, ...data } : r),
        }));
      },

      deleteReceipt: (id) => {
        set(state => ({
          receipts: state.receipts.filter(r => r.id !== id),
        }));
      },

      addFundRecord: (record) => {
        const recordId = 'fund-' + generateId();
        const newRecord: FundRecord = {
          id: recordId,
          createdAt: new Date().toISOString(),
          ...record,
        };
        set(state => ({
          fundRecords: [newRecord, ...state.fundRecords],
        }));
        return recordId;
      },

      payOrder: (orderId: string) => {
        const order = useOrderStore.getState().orders.find(o => o.id === orderId);
        if (!order || order.status !== 'pending_pay') return;

        useOrderStore.getState().updateOrderStatus(orderId, 'paid');

        set(state => ({
          activities: state.activities.map(a => {
            if (a.id === order.activityId) {
              return {
                ...a,
                currentAmount: a.currentAmount + order.amount,
                participantCount: a.participantCount + 1,
              };
            }
            return a;
          }),
        }));

        get().addFundRecord({
          activityId: order.activityId,
          type: 'income',
          title: order.type === 'auction' ? '竞拍成交款' : '即时购成交款',
          amount: order.amount,
          description: `${order.itemName} - ${order.type === 'auction' ? '竞拍' : '即时购'}成交`,
        });
      },

      shipOrder: (orderId: string, trackingNo?: string) => {
        const order = useOrderStore.getState().orders.find(o => o.id === orderId);
        if (!order || order.status !== 'paid') return;

        useOrderStore.getState().updateOrderStatus(orderId, 'shipped', { trackingNo });
      },

      confirmReceive: (orderId: string) => {
        const order = useOrderStore.getState().orders.find(o => o.id === orderId);
        if (!order || order.status !== 'shipped') return;

        useOrderStore.getState().updateOrderStatus(orderId, 'completed');
      },

      incrementItemViewer: (itemId: string) => {
        set(state => ({
          items: state.items.map(i =>
            i.id === itemId ? { ...i, viewerCount: i.viewerCount + 1 } : i
          ),
        }));
      },
    }),
    { name: 'activity-storage-v2' }
  )
);
