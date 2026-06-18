import { create } from 'zustand';
import type { Activity, Item, Bid } from '../types';
import { mockActivities, mockItems, mockBids } from '../mock';
import { generateId as genId } from '../utils';

interface ActivityState {
  activities: Activity[];
  items: Item[];
  bids: Bid[];
  getActivityById: (id: string) => Activity | undefined;
  getItemsByActivityId: (activityId: string) => Item[];
  getItemById: (id: string) => Item | undefined;
  getBidsByItemId: (itemId: string) => Bid[];
  placeBid: (itemId: string, userId: string, userName: string, userAvatar: string, amount: number) => boolean;
  buyNow: (itemId: string, userId: string, userName: string) => { success: boolean; orderId?: string };
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: mockActivities,
  items: mockItems,
  bids: mockBids,

  getActivityById: (id: string) => {
    return get().activities.find(a => a.id === id);
  },

  getItemsByActivityId: (activityId: string) => {
    return get().items.filter(item => item.activityId === activityId);
  },

  getItemById: (id: string) => {
    return get().items.find(item => item.id === id);
  },

  getBidsByItemId: (itemId: string) => {
    return get().bids
      .filter(bid => bid.itemId === itemId)
      .sort((a, b) => b.amount - a.amount);
  },

  placeBid: (itemId: string, userId: string, userName: string, userAvatar: string, amount: number) => {
    const item = get().items.find(i => i.id === itemId);
    if (!item || item.status !== 'active') return false;
    
    const minBid = item.currentPrice + item.minIncrement;
    if (amount < minBid) return false;

    const activity = get().activities.find(a => a.id === item.activityId);
    if (!activity || activity.status !== 'ongoing') return false;

    const newBid: Bid = {
      id: 'bid-' + genId(),
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
      activities: state.activities.map(a => 
        a.id === item.activityId
          ? { 
              ...a, 
              currentAmount: a.currentAmount + (amount - item.currentPrice),
              participantCount: a.participantCount + 1
            }
          : a
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

    const orderId = 'order-' + genId();

    set(state => ({
      items: state.items.map(i => 
        i.id === itemId ? { ...i, status: 'sold' as const } : i
      ),
      activities: state.activities.map(a => 
        a.id === item.activityId
          ? { 
              ...a, 
              currentAmount: a.currentAmount + item.buyNowPrice!,
              participantCount: a.participantCount + 1
            }
          : a
      ),
    }));

    return { success: true, orderId };
  },
}));
