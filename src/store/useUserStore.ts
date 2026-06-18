import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Bid, Order, Item, Address } from '../types';
import { mockUsers, mockBids, mockItems, mockAddresses } from '../mock';
import { useOrderStore } from './useOrderStore';
import { generateId } from '../utils';

interface UserState {
  allUsers: User[];
  currentUser: User | null;
  isLoggedIn: boolean;
  myBids: Bid[];
  addresses: Address[];
  register: (data: {
    nickname: string;
    email: string;
    phone: string;
    role?: User['role'];
    orgId?: string;
    orgName?: string;
  }) => { success: boolean; message?: string };
  login: (userId: string) => boolean;
  logout: () => void;
  addBid: (bid: Bid) => void;
  addAddress: (address: Omit<Address, 'id' | 'userId'> & { userId?: string }) => string;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      allUsers: mockUsers,
      currentUser: null,
      isLoggedIn: false,
      myBids: [],
      addresses: [],

      register: (data) => {
        const { allUsers } = get();
        
        if (allUsers.some(u => u.email === data.email)) {
          return { success: false, message: '该邮箱已被注册' };
        }
        if (allUsers.some(u => u.phone === data.phone)) {
          return { success: false, message: '该手机号已被注册' };
        }

        const newUserId = 'user-' + generateId();
        const avatarSeed = encodeURIComponent(data.nickname);
        const newUser: User = {
          id: newUserId,
          name: data.nickname,
          email: data.email,
          phone: data.phone,
          role: data.role || 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
          orgId: data.orgId,
          orgName: data.orgName,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          allUsers: [...state.allUsers, newUser],
          currentUser: newUser,
          isLoggedIn: true,
          myBids: mockBids.filter(b => b.userId === newUserId),
          addresses: mockAddresses.filter(a => a.userId === newUserId),
        }));

        return { success: true };
      },

      login: (userId: string) => {
        const { allUsers } = get();
        const user = allUsers.find(u => u.id === userId);
        if (!user) return false;

        const userBids = mockBids.filter(b => b.userId === userId);
        const userAddresses = mockAddresses.filter(a => a.userId === userId);
        set({
          currentUser: user,
          isLoggedIn: true,
          myBids: userBids,
          addresses: userAddresses,
        });
        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          isLoggedIn: false,
          myBids: [],
          addresses: [],
        });
      },

      addBid: (bid: Bid) => {
        set(state => ({
          myBids: [bid, ...state.myBids],
        }));
      },

      addAddress: (addressData) => {
        const { currentUser } = get();
        const addrId = 'addr-' + generateId();
        const newAddress: Address = {
          id: addrId,
          userId: addressData.userId || currentUser?.id || '',
          ...addressData,
        } as Address;

        set(state => ({
          addresses: [...state.addresses, newAddress],
        }));
        return addrId;
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

      updateProfile: (data) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
          allUsers: state.allUsers.map(u =>
            u.id === state.currentUser?.id ? { ...u, ...data } : u
          ),
        }));
      },
    }),
    {
      name: 'user-storage-v2',
    }
  )
);
