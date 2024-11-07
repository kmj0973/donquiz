"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useDialog } from "@/hooks/useDialog";
import Link from "next/link";
import CreateDialog from "@/containers/create/CreateDialog";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen, OpenDialog } = useDialog();
  const isLogin = useAuthStore((state) => state.isLogin);
  const router = useRouter();

  const checkLogin = useAuthStore((state) => state.checkLogin);
  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const onDialog = () => {
    if (!isLogin) {
      toast.error("로그인이 필요합니다.", { duration: 800 });
      router.push("/login");
    } else {
      OpenDialog();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-2xl">
          ☰
        </button>
      </div>
      <div
        className={`absolute top-16 left-0 w-full bg-black text-white sm:hidden transition-transform duration-300 z-10 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <Link onClick={toggleMenu} href="/about">
            About
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              onDialog();
            }}
            className="mx-2"
          >
            퀴즈 만들기
          </button>
          <Link onClick={toggleMenu} href="/ranking">
            랭킹
          </Link>
          <button
            onClick={() => {
              toast.error("곧 출시할 예정입니다", { duration: 800 });
              return;
            }}
            className="mx-2"
          >
            교환소
          </button>
          {isLogin ? (
            <Link href={`/myInfo/${uid}`} onClick={toggleMenu}>
              MYPAGE
            </Link>
          ) : (
            <Link href="/login" onClick={toggleMenu}>
              로그인
            </Link>
          )}
        </div>
      </div>
      {isOpen ? <CreateDialog /> : null}
    </>
  );
};

export default MobileNav;
