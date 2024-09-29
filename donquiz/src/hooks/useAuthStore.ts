import { deleteCookie, getCookie } from "@/global/cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface userInfoProps {
  displayName: string | null;
  uid: string | null;
  saveUser: (displayName: string, uid: string) => void;
  isLogin: boolean; // 로그인 여부
  checkLogin: () => void; // 로그인 여부 확인 함수
  logout: () => void; // 로그아웃
}

export const useAuthStore = create(
  persist<userInfoProps>(
    (set) => {
      return {
        displayName: null,
        uid: null,
        isLogin: false,
        saveUser: (displayName, uid) => {
          set({ displayName, uid, isLogin: true });
        },
        checkLogin: async () => {
          const accessToken = await getCookie("token");

          if (accessToken) {
            set({ isLogin: true });
          } else {
            set({ displayName: null, uid: null, isLogin: false });
          }
        },
        logout: () => {
          deleteCookie("token");
          set({ displayName: null, uid: null, isLogin: false });
        },
      };
    },
    {
      name: "authStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
