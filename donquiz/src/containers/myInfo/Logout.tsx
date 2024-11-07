"use client";

import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useFetchUserData } from "./hooks/useFetchUserData";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserRank } from "./hooks/useUserRank";
import { getCookie } from "@/global/cookie";

const MyInfo = () => {
  const uid = useAuthStore((state) => state.uid);
  const displayName = useAuthStore((state) => state.displayName);
  const logout = useAuthStore((state) => state.logout);

  const { data: userData, isLoading, error } = useFetchUserData(uid);
  const { data: userRanking } = useUserRank(uid);
  const router = useRouter();

  const clearUserStorage = () => {
    useAuthStore.persist.clearStorage();
  };

  const kakaoLogout = async () => {
    try {
      const kakaoToken = await getCookie("kakaoToken");
      const response = await fetch("https://kapi.kakao.com/v1/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kakaoToken}`,
        },
      });
      const data = await response.json();
      if (data.id) {
        console.log("카카오 로그아웃 성공", data);
      } else {
        console.error("카카오 로그아웃 실패", data);
      }
    } catch (error) {
      console.error("카카오 로그아웃 에러:", error);
    }
  };

  const handleLogout = () => {
    kakaoLogout();
    logout();
    clearUserStorage();
    router.replace("/login");
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center justify-center py-4 px-2">
      <div className="mb-4 h-[350px] border-4 border-black rounded-2xl flex flex-col justify-center items-center">
        <div className="m-4 w-[240px] h-[240px] mb-2 border-4 rounded-full flex justify-center items-center">
          <FaUser size={160} />
        </div>
        <div className="text-[24px] sm:text-[30px]">{displayName} 님</div>

        <div className="text-[14px] sm:text-[15px] text-[#000000] ">
          현재 포인트 : {userData?.userPoint}점
        </div>
        <div className="text-[15px] text-[#8F8F8F] mb-2">
          포인트 랭킹 {userRanking?.rank}위
        </div>
      </div>
      <div className="w-full max-w-[1200px] border-4 border-[#FF6868] rounded-2xl flex flex-col justify-center items-center">
        <div className="w-full sm:w-[40%] flex justify-center items-center my-4 sm:my-8">
          <div className="text-[24px] sm:text-[30px] text-[#ff6868] border-b-4 border-[#FF6868] px-4 py-1">
            마이 퀴즈
          </div>
        </div>
        <div className="w-full max-w-[95%] h-auto min-h-[200px] sm:min-h-[350px] flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 px-2">
          {userData?.fetchedQuizList.length ? (
            userData?.fetchedQuizList.map((quizData, index) => {
              return (
                <div
                  key={index}
                  className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-4 border-black w-[30%] sm:w-[48%] md:w-[30%] lg:w-[30%] min-w-[200px] sm:min-w-[250px] min-h-[180px] sm:min-h-[250px] rounded-2xl"
                >
                  <div className="w-[95%] flex items-center justify-between my-1">
                    <div className="text-[12px] sm:text-[14px] flex items-center">
                      <FaUser size="18" />
                      <div className="ml-1">{quizData.participant}</div>
                    </div>
                    <div className="relative group text-[0.9rem] sm:text-[1rem] xl:text-[1.1rem] 2xl:text-[1.3rem]">
                      {quizData.title.length > 8
                        ? `${quizData.title.slice(0, 8) + "..."}`
                        : quizData.title}
                      <div className="absolute mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                        <div className="relative">
                          {quizData.title}
                          <div className="absolute w-0 h-0 border-b-8 border-b-black border-x-8 border-x-transparent left-1/2 -translate-x-1/2 -top-2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] sm:text-[14px]">
                      {quizData.quizList.length} 문제
                    </div>
                  </div>
                  <div className="relative w-full pb-[60%] sm:pb-[80%]">
                    {quizData.imageUrl && (
                      <Image
                        src={quizData.imageUrl}
                        alt="썸네일"
                        fill
                        priority
                      />
                    )}
                  </div>
                  <button
                    onClick={() => {
                      toast.error("생성자는 참여할 수 없습니다", {
                        duration: 800,
                      });
                    }}
                    className="bg-[#FF4848] hover:bg-red-600 text-white rounded-3xl py-1 px-4 sm:py-2 sm:px-6 my-2 text-sm sm:text-base"
                  >
                    시작하기
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-[18px] sm:text-[20px]">
              퀴즈를 만들어주세요!
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#FF4848] hover:bg-red-600 text-white rounded-xl py-2 px-6 my-4"
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
