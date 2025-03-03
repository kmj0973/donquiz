import { deleteCookie, getCookie } from "@/global/cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userInfoProps {
  displayName: string | null;
  email: string | null;
  uid: string | null;
  isLogin: boolean; // 로그인 여부
  saveUser: (displayName: string, email: string, uid: string) => void;
  checkLogin: () => void; // 로그인 여부 확인 함수
  logout: () => void; // 로그아웃
}

export const useAuthStore = create(
  persist<userInfoProps>(
    (set) => {
      return {
        displayName: null,
        email: null,
        uid: null,
        isLogin: false,
        saveUser: (displayName, email, uid) => {
          set({ displayName, email, uid, isLogin: true });
        },
        checkLogin: async () => {
          const accessToken = await getCookie("token");

          if (accessToken) {
            set({ isLogin: true });
          } else {
            set({ displayName: null, email: null, uid: null, isLogin: false });
          }
        },
        logout: () => {
          deleteCookie("token");
          deleteCookie("kakaoToken");
          set({ displayName: null, email: null, uid: null, isLogin: false });
        },
      };
    },
    {
      name: "authStore",
    }
  )
);
