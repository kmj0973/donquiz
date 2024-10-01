"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Create = () => {
  const { isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
    }
  });

  return (
    <>
      <div className="absolute">create</div>
    </>
  );
};

export default Create;
