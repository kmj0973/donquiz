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
    <>
      {isLogin ? (
        <Link className="text-base" href={`/myInfo/${uid}`} replace={true}>
          MYPAGE
        </Link>
      ) : (
        <Link className="text-base" href="/login" replace={true}>
          로그인
        </Link>
      )}
    </>
  );
};

export default MyPage;
