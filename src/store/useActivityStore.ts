import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Activity, Item, Bid, Order } from '../types';
import { mockActivities, mockItems, mockBids } from '../mock';
import { generateId } from '../utils';
import { useOrderStore } from './useOrderStore';
import { useUserStore } from './useUserStore';

interface ActivityState {
  activities: Activity[];
  items: Item[];
  bids: Bid[];
  getActivityById: (id: string) => Activity | undefined;
  getItemsByActivityId: (activityId: string) => Item[];
  getItemById: (id: string) => Item | undefined;
  getBidsByItemId: (itemId: string) => Bid[];
  getActivitiesByOrgId: (orgId: string) => Activity[];
  createActivity: (data: Omit<Activity, 'id' | 'currentAmount' | 'participantCount' | 'itemCount' | 'status' | 'createdAt'>) => string;
  addItem: (data: Partial<Pick<Item, 'donorId' | 'deliveryDesc'>> & Omit<Item, 'id' | 'currentPrice' | 'bidCount' | 'viewerCount' | 'status' | 'createdAt' | 'images' | 'donorId' | 'deliveryDesc'> & { images?: string[] }) => string;
  placeBid: (itemId: string, userId: string, userName: string, userAvatar: string, amount: number) => boolean;
  buyNow: (itemId: string, userId: string, userName: string) => { success: boolean; orderId?: string };
  finalizeAuction: (itemId: string) => boolean;
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

      getActivityById: (id: string) => get().activities.find(a => a.id === id),

      getItemsByActivityId: (activityId: string) => get().items.filter(item => item.activityId === activityId),

      getItemById: (id: string) => get().items.find(item => item.id === id),

      getBidsByItemId: (itemId: string) => get().bids
        .filter(bid => bid.itemId === itemId)
        .sort((a, b) => b.amount - a.amount),

      getActivitiesByOrgId: (orgId: string) => get().activities.filter(a => a.orgId === orgId),

      createActivity: (data) => {
        const activityId = 'act-' + generateId();
        const newActivity: Activity = {
          id: activityId,
          currentAmount: 0,
          participantCount: 0,
          itemCount: 0,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
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
    { name: 'activity-storage' }
  )
);
