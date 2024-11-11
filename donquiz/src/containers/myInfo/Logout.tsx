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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const MyInfo = () => {
  const uid = useAuthStore((state) => state.uid);
  const email = useAuthStore((state) => state.email);
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

  const handleLogout = async () => {
    logout();
    await kakaoLogout();
    clearUserStorage();
    router.replace("/login");
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-[1200px] h-auto sm:h-[350px] rounded-2xl flex flex-col sm:flex-row justify-around items-center mb-8">
        <div className="w-full max-w-[300px] flex flex-col justify-center items-center rounded-3xl shadow-xl py-10 px-4 mx-4 duration-300 hover:scale-105">
          <div className="w-full flex flex-col justify-start pl-4">
            <div className="text-[20px]">{displayName}</div>
            <div className="text-[14px] text-[#666666]">{email}</div>
          </div>
          <div className="m-4 w-[190px] h-[190px] mb-2 border-4 rounded-full flex justify-center items-center">
            <FaUser size={120} />
          </div>
        </div>
        <div className="w-full max-w-[600px] h-full flex flex-col justify-between items-center sm:items-start mx-2">
          <div className="w-full flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-[#bbbbbb80] hover:bg-[#868686] font-normal rounded-xl shadow-xl py-2 px-8 my-4 duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>
          <div className="w-full max-w-[400px]">
            <div className="w-full py-4 px-8 text-[24px] mb-4 rounded-3xl shadow-xl duration-300 hover:scale-105">
              Ranking : {userRanking?.rank}
            </div>
            <div className="w-full py-4 px-8 text-[24px] mb-4 rounded-3xl shadow-xl duration-300 hover:scale-105">
              Points : {userData?.userPoint}
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[1200px] rounded-2xl flex flex-col justify-center items-center">
        {/* <div className="w-full sm:w-[40%] flex justify-center items-center my-4 sm:my-8">
          <div className="text-[24px] sm:text-[30px] border-b-4 px-4 py-1 text-[#bbbbbb]">
            마이 퀴즈
          </div>
        </div> */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2} // 기본으로 3개의 슬라이드를 보이게 설정
          navigation={{
            prevEl: ".custom-prev", // 커스텀 클래스명 지정
            nextEl: ".custom-next",
          }}
          pagination={{
            clickable: true,
          }}
          loop={true} // 무한 스크롤 활성화
          breakpoints={{
            320: { slidesPerView: 1 }, // 모바일 화면에서 1개씩 표시
            640: { slidesPerView: 2 }, // 태블릿 화면에서 2개씩 표시
            768: { slidesPerView: 2 }, // 태블릿 화면에서 2개씩 표시
            1024: { slidesPerView: 3 }, // 데스크톱 화면에서 3개씩 표시
          }}
          className="w-full max-w-[95%] min-h-[400px] px-6 pb-8"
        >
          {userData?.fetchedQuizList.length ? (
            userData?.fetchedQuizList.map((quizData, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="flex flex-col items-center justify-center p-4"
                >
                  <div className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-[3px] border-black w-full min-h-[250px] rounded-2xl overflow-hidden">
                    <div className="w-[90%] flex items-center justify-between my-2">
                      <div className="text-[12px] sm:text-[14px] flex items-center">
                        <FaUser size="18" />
                        <div className="ml-1">{quizData.participant}</div>
                      </div>
                      <div className="relative group text-[0.9rem] sm:text-[1rem]">
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
                    <div className="relative w-full pb-[70%]">
                      {quizData.imageUrl && (
                        <Image
                          src={quizData.imageUrl}
                          alt="썸네일"
                          layout="fill"
                          objectFit="cover"
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
                </SwiperSlide>
              );
            })
          ) : (
            <div className="text-lg text-gray-700 w-full h-[400px] flex justify-center items-center">
              퀴즈를 만들어주세요!
            </div>
          )}
        </Swiper>
        <div className="custom-prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#bbbbbb] text-white p-2 rounded-full cursor-pointer z-10">
          &lt;
        </div>
        <div className="custom-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#bbbbbb] text-white p-2 rounded-full cursor-pointer z-10">
          &gt;
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
