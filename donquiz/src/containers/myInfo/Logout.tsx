"use client";

import { FaUser } from "react-icons/fa";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const displayName = useAuthStore((state) => state.displayName);

  // const displayName = useStore(useAuthStore, (state) => {
  //   return state.displayName;
  // }); //zustand persist 적용

  const clearUserStorage = () => {
    useAuthStore.persist.clearStorage();
  }; //localstorage 초기화 함수

  const onLogout = () => {
    logout();
    clearUserStorage();
    router.replace("/login");
  };

  return (
    <div className="w-[90%] h-[100%] flex flex-col items-center justify-center py-4 px-2">
      <div className="mb-4 h-[350px] border-4 border-black rounded-2xl flex flex-col justify-center items-center">
        <div className="m-4 w-[240px] h-[240px] mb-2 border-4 rounded-full flex justify-center items-center">
          <FaUser size={160} />
        </div>
        <div className="text-[30px]">
          {displayName ? displayName : "undefined"} 님
        </div>
        <div className="text-[15px] text-[#8F8F8F] mb-2">포인트 랭킹 1위</div>
      </div>
      <div className="w-[80%] max-w-[1200px] border-4 border-[#FF6868] rounded-2xl flex flex-col justify-center items-center">
        <div className="w-[40%] flex justify-center items-center my-8">
          <div className="text-[30px] text-[#ff6868] border-b-4 border-[#FF6868] px-6 py-1">
            마이 퀴즈
          </div>
        </div>
        <div className="w-[90%] h-[1000px] border-2 overflow-y-auto">gd</div>
        <button onClick={onLogout}>logout</button>
      </div>
    </div>
  );
};

export default Logout;
