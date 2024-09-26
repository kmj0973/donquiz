"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";

const MyInfo = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div></div>
      <button onClick={onLogout}>mypage</button>
    </>
  );
};

export default MyInfo;
