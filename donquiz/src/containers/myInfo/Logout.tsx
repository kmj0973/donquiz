"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "next/navigation";

const Logout = () => {
  const { logout } = useAuthStore();
  const displayName = useStore(useAuthStore, (state) => {
    return state.displayName;
  });
  const clearUserStorage = useAuthStore.persist.clearStorage;
  const router = useRouter();

  const onLogout = () => {
    logout();
    clearUserStorage();
    router.push("/login");
  };

  return (
    <>
      <div>{displayName}</div>
      <button onClick={onLogout}>logout</button>
    </>
  );
};

export default Logout;
