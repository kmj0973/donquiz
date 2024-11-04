"use client";

import CreateDialog from "@/containers/create/CreateDialog";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDialog } from "@/hooks/useDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isOpen, OpenDialog } = useDialog();
  const isLogin = useAuthStore((state) => state.isLogin);
  const router = useRouter();

  const onDialog = () => {
    if (!isLogin) {
      toast.error("로그인이 필요합니다.", { duration: 800 });
      router.push("/login");
    } else {
      OpenDialog();
    }
  };

  return (
    <>
      <div className="hidden sm:flex items-center space-x-6 gap-4">
        <Link className="mx-2" href="/">
          about
        </Link>
        <button className="mx-2" onClick={onDialog}>
          퀴즈 만들기
        </button>
        <Link className="mx-2" href="/ranking">
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
      </div>
      {isOpen ? <CreateDialog /> : null}
    </>
  );
};

export default Navbar;
