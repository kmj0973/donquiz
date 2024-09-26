"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { useEffect } from "react";

const Header = () => {
  const { isLogin, checkLogin } = useAuthStore();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <header className="bg-black">
      <nav className="w-full h-16 px-10 py-7 text-white text-xl font-bold flex justify-between items-center">
        <Link className="text-5xl" href="/">
          <span className="text-[#FF0000]">D</span>ON
          <span className="text-[#FFF700]">Q</span>UIZ
        </Link>
        <div className="flex">
          <Link className="mx-9" href="/about">
            about
          </Link>
          <Link className="mx-9" href="/create">
            퀴즈 만들기
          </Link>
          <Link className="mx-9" href="/lanking">
            랭킹
          </Link>
          <Link className="mx-9" href="/change">
            교환소
          </Link>
        </div>
        {isLogin ? (
          <Link className="text-base" href="/myInfo">
            MYPAGE
          </Link>
        ) : (
          <Link className="text-base" href="/login">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
