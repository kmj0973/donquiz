"use client";


import Image from "next/image";
import { FaUser } from "react-icons/fa";
import Loading from "@/app/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import basicImage from "../../../public/image/basic-image.png";
import logo from "../../../public/image/donquiz logo2.png";
import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebasedb";

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
  const [allUsersQuizLists, setAllUsersQuizLists] = useState<Quiz[]>(initialQuizzes);
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Firebase 변경 감지하여 실시간 업데이트
  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, async (usersSnapshot) => {
      const updatedQuizzes: Quiz[] = [];

      await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          const quizListSnapshot = await getDocs(
            query(collection(db, `users/${userId}/quizList`), orderBy("createdAt", "desc"))
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

      // 🔥 기존 데이터와 비교 후 변경이 있을 때만 업데이트
      setAllUsersQuizLists((prevQuizzes) => {
        const prevData = JSON.stringify(prevQuizzes);
        const newData = JSON.stringify(updatedQuizzes);

        if (prevData !== newData) {
          return updatedQuizzes;
        }
        return prevQuizzes;
      });

      setIsLoading(false);
    });

    return () => unsubscribe(); // ✅ 중복 구독 방지
  }, []);

  const handleStartQuiz = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string,
    quizId: string,
    title: string
  ) => {
    if (!isLogin) {
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
            type="search"
            placeholder="검색어 입력"
            value={searchInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <input
            className="rounded-xl p-[10px] bg-black hover:bg-[#999999] text-white border-black text-sm sm:text-base font-normal cursor-pointer"
            type="button"
            value="Search"
            onClick={handleSearch}
          />
        </div>
      </div>
      <div className="w-full max-w-[1400px] h-[100%] min-h-[calc(100vh-112px)] flex items-start justify-center xl:justify-start flex-wrap gap-4 overflow-auto pb-4 pt-12 px-2">
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
          (quiz) =>
            quiz.quizList &&
            quiz.title.includes(searchWords) &&
            quiz.userId != uid
        ).length === 0 ? (
          <div className="flex justify-center items-center text-center w-full text-lg font-semibold pb-20">
            검색 결과가 없습니다...
          </div>
        ) : (
          allUsersQuizLists
            .filter(
              (quiz) =>
                quiz.quizList &&
                quiz.title.includes(searchWords) &&
                quiz.userId != uid
            )
            .map((quiz) => {
              return (
                <div
                  key={quiz.quizId}
                  className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-[3px] border-[#000000] w-[300px] sm:w-[48%] md:w-[31%] lg:w-[24%] sm:min-w-[220px] min-h-[240px] rounded-2xl shadow-xl"
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
