"use client";

import CreateDialog from "@/containers/create/CreateDialog";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDialog } from "@/hooks/useDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isOpen, OpenDialog } = useDialog();
  const { isLogin } = useAuthStore();
  const router = useRouter();

  const onDialog = () => {
    if (!isLogin) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
    } else {
      OpenDialog();
    }
  };

  return (
    <>
      <div className="flex">
        <Link className="mx-9" href="/about">
          about
        </Link>
        <button className="mx-9" onClick={onDialog}>
          퀴즈 만들기
        </button>
        <Link className="mx-9" href="/lanking">
          랭킹
        </Link>
        <Link className="mx-9" href="/change">
          교환소
        </Link>
      </div>
      {isOpen ? <CreateDialog /> : null}
    </>
  );
};

export default Navbar;
