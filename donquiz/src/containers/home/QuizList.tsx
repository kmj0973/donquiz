"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";
import Loading from "@/app/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFetchUserQuizLists } from "@/containers/home/hooks/useFetchUserQuizLists";

const QuizList = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const uid = useAuthStore((state) => state.uid);
  const router = useRouter();

  // Custom hook 사용하여 데이터 가져오기
  const { data: allUsersQuizLists, isLoading, error } = useFetchUserQuizLists();

  const handleStartQuiz = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string,
    quizId: string,
    title: string
  ) => {
    if (uid == userId) {
      toast.error("생성자는 참여할 수 없습니다", { duration: 800 });
      return;
    }

    if (!isLogin) {
      toast.error("로그인이 필요합니다", { duration: 800 });
      router.push("/login");
    } else {
      router.push(`/quiz?userId=${userId}&quizId=${quizId}&title=${title}`);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <>
      {allUsersQuizLists?.map((user) =>
        user.quizList.map((quiz) => {
          return (
            <div
              key={quiz.quizId}
              className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-4 border-black w-[300px] sm:w-[48%] md:w-[31%] lg:w-[24%]  sm:min-w-[220px] min-h-[240px] rounded-2xl"
            >
              <div className="w-[95%] flex items-center justify-between my-1">
                <div className="text-[12px] sm:text-[14px] flex items-center">
                  <FaUser size="18" />
                  <div className="ml-1">{quiz.participant}</div>
                </div>
                <div className="relative group text-[0.9rem] sm:text-[1rem] xl:text-[1.1rem] 2xl:text-[1.3rem]">
                  {quiz.title.length > 8
                    ? `${quiz.title.slice(0, 6) + "..."}`
                    : quiz.title}
                  <div className="absolute mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                    <div className="relative">
                      {quiz.title}
                      <div className="absolute w-0 h-0 border-b-8 border-b-black border-x-8 border-x-transparent left-1/2 -translate-x-1/2 -top-2"></div>
                    </div>
                  </div>
                </div>
                <div className="relative w-full pb-[80%]">
                  {quiz.imageUrl && (
                    <Image src={quiz.imageUrl} alt="썸네일" fill />
                  )}
                </div>
              </div>
              <div className="relative w-full pb-[80%]">
                {quiz.imageUrl && (
                  <Image src={quiz.imageUrl} alt="썸네일" fill priority />
                )}
              </div>
              <button
                onClick={(event) =>
                  handleStartQuiz(event, user.userId, quiz.quizId, quiz.title)
                }
                className="bg-[#FF4848] hover:bg-red-600 text-white rounded-3xl py-2 px-4 sm:px-6 my-2 text-sm sm:text-base"
              >
                시작하기
              </button>
            </div>
          );
        })
      )}
    </>
  );
};

export default QuizList;
