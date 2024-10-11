"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyPage = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const [auth, setAuth] = useState<string | null>("");

  useEffect(() => {
    if (localStorage.getItem("authStore")) {
      setAuth(localStorage.getItem("authStore"));
    }
    checkLogin();
    if (auth) console.log(JSON.parse(auth));
  }, [checkLogin, auth]);

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
