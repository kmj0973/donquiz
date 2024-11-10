"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";
import Loading from "@/app/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import basicImage from "../../../public/image/basic-image.png";
// import { useQuery } from "@tanstack/react-query";
import logo from "../../../public/image/donquiz logo2.png";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase/firebasedb";
import { useQuery } from "@tanstack/react-query";

interface Quiz {
  userId: string;
  quizId: string;
  createdAt: Date;
  title: string;
  imageUrl: string;
  participant: number;
  quizList: string[];
}

interface QuizListProps {
  initialQuizzes: Quiz[];
}

const QuizList = ({ initialQuizzes }: QuizListProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const uid = useAuthStore((state) => state.uid);
  const router = useRouter();

  const [searchWords, setSearchWords] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [allUsersQuizLists, setAllUsersQuizLists] =
    useState<Quiz[]>(initialQuizzes);
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { data: quizzes = initialQuizzes } = useQuery({
    queryKey: ["userQuizLists"],
    queryFn: async () => {
      const updatedQuizzes: Quiz[] = [];
      const usersSnapshot = await getDocs(query(collection(db, "users")));

      await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          const quizListSnapshot = await getDocs(
            collection(db, `users/${userId}/quizList`)
          );

          quizListSnapshot.docs.forEach((quizDoc) => {
            const quizData = quizDoc.data();
            updatedQuizzes.push({
              userId: userId,
              quizId: quizDoc.id,
              createdAt: quizData.createdAt.toDate(),
              title: quizData.title,
              imageUrl: quizData.thumbnail || "",
              participant: quizData.participant,
              quizList: quizData.quizList,
            });
          });
        })
      );
      return updatedQuizzes;
    },
    initialData: initialQuizzes,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    const sortedData = [...quizzes].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    setAllUsersQuizLists(sortedData);
    setIsLoading(false);
  }, [quizzes]);

  const handleStartQuiz = async (
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

  const handlePopular = () => {
    setAllUsersQuizLists((prevAllUsersQuizLists) => {
      const sortedList = [...prevAllUsersQuizLists].sort(
        (a, b) => b.participant - a.participant
      );
      return sortedList;
    });

    setToggle(false);
  };

  const handleRecent = () => {
    setAllUsersQuizLists((prevAllUsersQuizLists) => {
      const sortedList = [...prevAllUsersQuizLists].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      return sortedList;
    });

    setToggle(true);
  };

  const handleSearch = () => {
    setSearchWords(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const tabClass = (active: boolean) =>
    `relative text-[16px] sm:text-[20px] mb-2 sm:mb-0 cursor-pointer p-1 px-2 rounded-xl ${
      active ? "text-black" : "text-[#666666]"
    }`;

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="w-full max-w-[1400px] flex items-center justify-between px-4 font-normal">
        <div className="w-full flex items-center justify-center">
          <Image
            className="mr-4 pt-2"
            alt="로고"
            src={logo}
            width={47}
            height={47}
          />

          <input
            className="w-[60%] rounded-xl mr-2 p-[10px] bg-[#F2F2F2] text-[#333333] text-sm sm:text-base "
            type="text"
            placeholder="검색어 입력"
            value={searchInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <input
            className="rounded-xl p-[10px] bg-black text-white border-black text-sm sm:text-base font-normal cursor-pointer"
            type="button"
            value="Search"
            onClick={handleSearch}
          />
        </div>
      </div>
      <div className="w-full max-w-[1400px] h-[100%] min-h-[calc(100vh-280px)] flex items-start justify-center xl:justify-start flex-wrap gap-4 overflow-auto pb-4 pt-12 px-2">
        <div className="flex items-center justify-end w-full max-w-[1400px] px-2">
          <div
            onClick={handleRecent}
            className={`${tabClass(
              toggle
            )} rounded-xl p-[10px]  text-sm sm:text-base`}
          >
            • 최신순
          </div>
          <div
            onClick={handlePopular}
            className={`${tabClass(
              !toggle
            )} rounded-xl p-[10px]  text-sm sm:text-base`}
          >
            • 인기순
          </div>
        </div>
        {allUsersQuizLists.filter(
          (quiz) => quiz.quizList && quiz.title.includes(searchWords)
        ).length === 0 ? (
          <div className="text-center w-full text-lg font-semibold my-auto pb-20">
            검색 결과가 없습니다...
          </div>
        ) : (
          allUsersQuizLists
            .filter((quiz) => quiz.quizList && quiz.title.includes(searchWords))
            .map((quiz) => {
              return (
                <div
                  key={quiz.quizId}
                  className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-[3px] border-[#000000] w-[300px] sm:w-[48%] md:w-[31%] lg:w-[24%] sm:min-w-[220px] min-h-[240px] rounded-2xl"
                >
                  <div className="w-[95%] flex items-center justify-between my-1">
                    <div className="text-[12px] sm:text-[14px] flex items-center">
                      <FaUser size="18" />
                      <div className="ml-1">{quiz.participant}</div>
                    </div>
                    <div className="relative group text-[0.9rem] sm:text-[1rem] xl:text-[1.1rem] 2xl:text-[1.3rem]">
                      {quiz.title.length > 8
                        ? `${quiz.title.slice(0, 8) + "..."}`
                        : quiz.title}
                      <div className="absolute mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                        <div className="relative">
                          {quiz.title}
                          <div className="absolute w-0 h-0 border-b-8 border-b-black border-x-8 border-x-transparent left-1/2 -translate-x-1/2 -top-2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] sm:text-[14px]">
                      {quiz.quizList && quiz.quizList.length}문제
                    </div>
                  </div>
                  <div className="relative w-full pb-[80%]">
                    {quiz.imageUrl ? (
                      <Image
                        src={quiz.imageUrl}
                        alt="썸네일"
                        fill
                        sizes="50vw"
                        priority
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Image
                        src={basicImage}
                        alt="기본 썸네일"
                        fill
                        sizes="50vw"
                        priority
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <button
                    aria-label="Submit quiz"
                    onClick={(event) =>
                      handleStartQuiz(
                        event,
                        quiz.userId,
                        quiz.quizId,
                        quiz.title
                      )
                    }
                    className="hover:bg-[#999999] bg-black text-white rounded-3xl py-2 px-4 sm:px-6 my-2 text-sm sm:text-base"
                  >
                    시작하기
                  </button>
                </div>
              );
            })
        )}
      </div>
    </>
  );
};

export default QuizList;
