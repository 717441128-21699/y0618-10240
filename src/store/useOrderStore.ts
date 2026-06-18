import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, Bid } from '../types';
import { generateId } from '../utils';

interface OrderStore {
  orders: Order[];
  getOrdersByUserId: (userId: string) => Order[];
  getOrdersByActivityId: (activityId: string) => Order[];
  getOrdersByOrgActivities: (activityIds: string[]) => Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'> & Partial<Pick<Order, 'status'>>) => string;
  updateOrderStatus: (orderId: string, status: Order['status'], extra?: Partial<Order>) => void;
  processAuctionEnd: (itemId: string, activityId: string) => boolean;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      getOrdersByUserId: (userId: string) => {
        return get().orders.filter(o => o.userId === userId);
      },

      getOrdersByActivityId: (activityId: string) => {
        return get().orders.filter(o => o.activityId === activityId);
      },

      getOrdersByOrgActivities: (activityIds: string[]) => {
        return get().orders.filter(o => activityIds.includes(o.activityId));
      },

      addOrder: (orderData) => {
        const orderId = 'order-' + generateId();
        const newOrder: Order = {
          id: orderId,
          status: 'pending_pay',
          createdAt: new Date().toISOString(),
          ...orderData,
        };
        set(state => ({
          orders: [newOrder, ...state.orders],
        }));
        return orderId;
      },

      updateOrderStatus: (orderId: string, status: Order['status'], extra?) => {
        const now = new Date().toISOString();
        set(state => ({
          orders: state.orders.map(order => {
            if (order.id === orderId) {
              const updated: Order = { ...order, status, ...(extra || {}) as Partial<Order> }
              if (status === 'paid') updated.payTime = now;
              if (status === 'shipped') updated.shipTime = now;
              if (status === 'completed') updated.confirmTime = now;
              return updated;
            }
            return order;
          }),
        }));
      },

      processAuctionEnd: (itemId: string, activityId: string) => {
        const { orders } = get();
        if (orders.some(o => o.itemId === itemId && o.type === 'auction' && o.status !== 'cancelled')) {
          return false;
        }
        return true;
      },
    }),
    { name: 'order-storage' }
  )
);
