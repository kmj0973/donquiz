"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const displayName = useStore(useAuthStore, (state) => {
    return state.displayName;
  }); //zustand persist 적용
  const clearUserStorage = () => {
    useAuthStore.persist.clearStorage();
  }; //localstorage 초기화 함수

  const onLogout = () => {
    logout();
    clearUserStorage();
    router.replace("/login");
  };

  return (
    <>
      <div>{displayName}</div>
      <button onClick={onLogout}>logout</button>
    </>
  );
};

export default Logout;
