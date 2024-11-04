"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { useEffect } from "react";

const MyPage = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <div className="hidden sm:flex pl-4">
      {isLogin ? (
        <Link className="text-base" href={`/myInfo/${uid}`}>
          MYPAGE
        </Link>
      ) : (
        <Link className="text-base" href="/login">
          로그인
        </Link>
      )}
    </div>
  );
};

export default MyPage;
