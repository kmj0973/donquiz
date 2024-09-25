import { deleteCookie, getCookie } from "@/global/cookie";
import { create } from "zustand";

interface userInfoProps {
  uid: string | null;
  saveUser: (uid: string) => void;
  isLogin: boolean; // 로그인 여부
  checkLogin: () => void; // 로그인 여부 확인 함수
  logout: () => void; // 로그아웃
}

export const useAuthStore = create<userInfoProps>((set) => {
  return {
    uid: null,
    isLogin: false,
    saveUser: (uid) => {
      set({ uid, isLogin: true });
    },
    checkLogin: async () => {
      const accessToken = await getCookie("token");

      if (accessToken) {
        set({ isLogin: true });
      } else {
        set({ uid: null, isLogin: false });
      }
    },
    logout: () => {
      deleteCookie("token");
      set({ uid: null, isLogin: false });
    },
  };
});
