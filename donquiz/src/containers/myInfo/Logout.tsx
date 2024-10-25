"use client";

import { FaUser } from "react-icons/fa";
import { useAuthStore } from "@/hooks/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebasedb";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import MyRank from "./MyRank";

interface QuizList {
  imageUrl: string;
  quizList: Quiz;
}

interface Quiz {
  participant: number;
  quizId: string;
  quizList: [];
  thumbnail: string;
  title: string;
}

const Logout = () => {
  const logout = useAuthStore((state) => state.logout);
  const displayName = useAuthStore((state) => state.displayName);
  const isLogin = useAuthStore((state) => state.isLogin);

  const uid = usePathname().slice(8);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [myQuizList, setMyQuizList] = useState<QuizList[]>([]);
  const [myPoint, setMyPoint] = useState(0);

  useEffect(() => {
    const docRef = collection(db, `users/${uid}/quizList`);

    const fetchUser = async () => {
      const userRef = doc(db, `users/${uid}`);

      const userDataDoc = await getDoc(userRef);

      if (userDataDoc.exists()) {
        const userData = userDataDoc.data();

        setMyPoint(userData.point);
      }
    };

    const fetchQuizList = async () => {
      try {
        const fetchedQuizList: QuizList[] = [];
        const quizListData = await getDocs(docRef);

        for (const quiz of quizListData.docs) {
          if (quiz.exists()) {
            const quizData = quiz.data();
            let imageUrl = "";

            if (quizData.thumbnail) {
              const imageRef = ref(storage, `images/${quizData.thumbnail}`);
              imageUrl = await getDownloadURL(imageRef);
            }

            fetchedQuizList.push({
              imageUrl, // 이미지 URL
              quizList: {
                participant: quizData.participant,
                quizId: quizData.quizId,
                quizList: quizData.quizList,
                thumbnail: quizData.thumbnail,
                title: quizData.title,
              }, // 퀴즈 데이터
            });
          }
        }
        setMyQuizList(fetchedQuizList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchQuizList();
  }, [uid]);

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

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center justify-center py-4 px-2">
      <div className="mb-4 h-[350px] border-4 border-black rounded-2xl flex flex-col justify-center items-center">
        <div className="m-4 w-[240px] h-[240px] mb-2 border-4 rounded-full flex justify-center items-center">
          <FaUser size={160} />
        </div>
        <div className="text-[24px] sm:text-[30px]">
          {displayName ? displayName : "undefined"} 님
        </div>

        <div className="text-[14px] sm:text-[15px] text-[#000000] ">
          현재 포인트 : {myPoint}점
        </div>
        <MyRank />
      </div>
      <div className="w-full max-w-[1200px] border-4 border-[#FF6868] rounded-2xl flex flex-col justify-center items-center">
        <div className="w-full sm:w-[40%] flex justify-center items-center my-4 sm:my-8">
          <div className="text-[24px] sm:text-[30px] text-[#ff6868] border-b-4 border-[#FF6868] px-4 py-1">
            마이 퀴즈
          </div>
        </div>
        <div className="w-full max-w-[95%] h-auto min-h-[200px] sm:min-h-[350px] flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 px-2">
          {myQuizList.length != 0 ? (
            !loading ? (
              myQuizList.map((quiz) => {
                return (
                  <div
                    key={quiz.quizList.quizId}
                    className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-4 border-black w-[30%] sm:w-[48%] md:w-[30%] lg:w-[30%] min-w-[180px] sm:min-w-[250px] min-h-[180px] sm:min-h-[250px] rounded-2xl"
                  >
                    <div className="w-[95%] flex items-center justify-between my-1">
                      <div className="text-[12px] sm:text-[14px] flex items-center">
                        <FaUser size="18" />
                        <div className="ml-1">{quiz.quizList.participant}</div>
                      </div>
                      <div className="relative group text-[0.9rem] sm:text-[1rem] xl:text-[1.1rem] 2xl:text-[1.3rem]">
                        {quiz.quizList.title.length > 8
                          ? `${quiz.quizList.title.slice(0, 6) + "..."}`
                          : quiz.quizList.title}
                        <div className="absolute mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                          <div className="relative">
                            {quiz.quizList.title}
                            <div className="absolute w-0 h-0 border-b-8 border-b-black border-x-8 border-x-transparent left-1/2 -translate-x-1/2 -top-2"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[12px] sm:text-[14px]">
                        {quiz.quizList.quizList &&
                          quiz.quizList.quizList.length}
                        문제
                      </div>
                    </div>
                    <div className="relative w-full pb-[60%] sm:pb-[80%]">
                      {quiz.imageUrl && (
                        <Image src={quiz.imageUrl} alt="썸네일" fill />
                      )}
                    </div>
                    <button
                      onClick={(event) =>
                        handleStartQuiz(
                          event,
                          uid,
                          quiz.quizList.quizId,
                          quiz.quizList.title
                        )
                      }
                      className="bg-[#FF4848] hover:bg-red-600 text-white rounded-3xl py-1 px-4 sm:py-2 sm:px-6 my-2 text-sm sm:text-base"
                    >
                      시작하기
                    </button>
                  </div>
                );
              })
            ) : (
              <Loading />
            )
          ) : (
            <div className="text-[18px] sm:text-[20px]">
              퀴즈를 만들어주세요!
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className="bg-[#FF4848] hover:bg-red-600 text-white rounded-xl py-2 px-6 my-4"
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
