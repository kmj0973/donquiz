"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { useEffect } from "react";

const MyPage = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      {isLogin ? (
        <Link className="text-base" href="/myInfo">
          MYPAGE
        </Link>
      ) : (
        <Link className="text-base" href="/login">
          로그인
        </Link>
      )}
    </>
  );
};

export default MyPage;
