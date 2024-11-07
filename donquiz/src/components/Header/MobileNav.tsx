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
        className={`absolute top-16 left-0 w-full bg-white text-base text-[#666666] transition-all duration-300 ease-in-out overflow-hidden sm:hidden z-10 ${
          isMenuOpen ? "max-h-52" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <Link onClick={toggleMenu} className="hover:text-black" href="/about">
            About
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              onDialog();
            }}
            className="mx-2"
          >
            Making Quiz
          </button>
          <Link
            onClick={toggleMenu}
            className="hover:text-black"
            href="/ranking"
          >
            Ranking
          </Link>
          <button
            onClick={() => {
              toast.error("곧 출시할 예정입니다", { duration: 800 });
              return;
            }}
            className="mx-2 hover:text-black"
          >
            Exchange
          </button>
          {isLogin ? (
            <Link
              className="hover:text-black"
              onClick={toggleMenu}
              href={`/myInfo/${uid}`}
            >
              MYPAGE
            </Link>
          ) : (
            <Link
              className="hover:text-black"
              onClick={toggleMenu}
              href="/login"
            >
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
