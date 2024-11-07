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
    <div className="hidden sm:flex pl-4 text-base text-[#666666]">
      {isLogin ? (
        <Link className="text-base hover:text-black" href={`/myInfo/${uid}`}>
          MYPAGE
        </Link>
      ) : (
        <Link className="text-base hover:text-black" href="/login">
          LOGIN
        </Link>
      )}
    </div>
  );
};

export default MyPage;
