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
      <div className="hidden sm:flex items-center space-x-6 gap-4 text-lg text-[#666666]">
        <Link className="mx-2 hover:text-black" href="/about">
          about
        </Link>
        <button className="mx-2 hover:text-black" onClick={onDialog}>
          Making Quiz
        </button>
        <Link className="mx-2 hover:text-black" href="/ranking">
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
      </div>
      {isOpen ? <CreateDialog /> : null}
    </>
  );
};

export default Navbar;
