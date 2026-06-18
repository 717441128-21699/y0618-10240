import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Bid, Order, Item, Address } from '../types';
import { mockUsers, mockBids, mockOrders, mockItems, mockAddresses } from '../mock';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  myBids: Bid[];
  myOrders: Order[];
  myItems: Item[];
  addresses: Address[];
  login: (userId: string) => void;
  logout: () => void;
  addBid: (bid: Bid) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      myBids: [],
      myOrders: [],
      myItems: [],
      addresses: [],

      login: (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          const userBids = mockBids.filter(b => b.userId === userId);
          const userOrders = mockOrders.filter(o => o.userId === userId);
          const userAddresses = mockAddresses.filter(a => a.userId === userId);
          set({
            currentUser: user,
            isLoggedIn: true,
            myBids: userBids,
            myOrders: userOrders,
            myItems: mockItems.filter(i => i.donorId === userId),
            addresses: userAddresses,
          });
        }
      },

      logout: () => {
        set({
          currentUser: null,
          isLoggedIn: false,
          myBids: [],
          myOrders: [],
          myItems: [],
          addresses: [],
        });
      },

      addBid: (bid: Bid) => {
        set(state => ({
          myBids: [bid, ...state.myBids],
        }));
      },

      addOrder: (order: Order) => {
        set(state => ({
          myOrders: [order, ...state.myOrders],
        }));
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        const now = new Date().toISOString();
        set(state => ({
          myOrders: state.myOrders.map(order => {
            if (order.id === orderId) {
              const updated = { ...order, status };
              if (status === 'paid') updated.payTime = now;
              if (status === 'shipped') updated.shipTime = now;
              if (status === 'completed') updated.confirmTime = now;
              return updated;
            }
            return order;
          }),
        }));
      },

      addAddress: (address: Address) => {
        set(state => ({
          addresses: [...state.addresses, address],
        }));
      },

      updateAddress: (address: Address) => {
        set(state => ({
          addresses: state.addresses.map(a => a.id === address.id ? address : a),
        }));
      },

      deleteAddress: (addressId: string) => {
        set(state => ({
          addresses: state.addresses.filter(a => a.id !== addressId),
        }));
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
