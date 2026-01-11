import { create } from 'zustand';

type UserStore = {
  user: {
    id: string;
  },
  setUser: (user: { id: string }) => void;
  getUserId: () => string;
};

const useUserStore = create<UserStore>(() => ({
  user: {
    id: '',
  },
  setUser: (user) => {
    useUserStore.setState({ user });
  },
  getUserId: (): string => {
    return useUserStore.getState().user.id;
  },
}));


export default useUserStore;