"use client";

import {
  collection,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { db, storage } from "../../../firebase/firebasedb";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import Loading from "@/app/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Quiz {
  quizId: string;
  imageUrl: string;
  [key: string]: string; // 퀴즈 데이터는 동적이므로 any로 설정
}

interface UserQuizList {
  userId: string;
  quizList: Quiz[];
}

const QuizList = () => {
  const [allUsersQuizLists, setAllUsersQuizLists] = useState<UserQuizList[]>(
    []
  );
  const isLogin = useAuthStore((state) => state.isLogin);
  const uid = useAuthStore((state) => state.uid);

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      async (usersSnapshot) => {
        try {
          // 이전 퀴즈 리스트 초기화
          const updatedQuizLists: UserQuizList[] = [];

          // 각 사용자의 quizList 하위 컬렉션을 가져옴
          for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id; // 현재 사용자의 uid

            // 각 사용자의 quizList 하위 컬렉션을 가져옴
            const quizListSnapshot = await getDocs(
              collection(db, `users/${userId}/quizList`)
            );

            const quizList: Quiz[] = await Promise.all(
              quizListSnapshot.docs.map(
                async (quizDoc: QueryDocumentSnapshot) => {
                  const quizData = quizDoc.data();
                  let imageUrl = "";

                  // 이미지가 있다면 Firebase Storage에서 다운로드 URL을 가져옴
                  if (quizData.thumbnail) {
                    try {
                      const imageRef = ref(
                        storage,
                        `images/${quizData.thumbnail}`
                      );
                      imageUrl = await getDownloadURL(imageRef);
                    } catch (error) {
                      console.error("Error fetching image URL:", error);
                    }
                  }

                  return {
                    quizId: quizDoc.id, // 퀴즈 문서 id
                    imageUrl, // 이미지 URL
                    participant: quizData.participant,
                    ...quizData, // 퀴즈 데이터
                  };
                }
              )
            );

            // 사용자 uid와 해당 퀴즈 리스트 저장
            updatedQuizLists.push({
              userId, // 사용자 uid
              quizList, // 해당 사용자의 퀴즈 리스트
            });
          }

          // 상태 업데이트
          setAllUsersQuizLists(updatedQuizLists);
        } catch (error) {
          console.error("Error fetching quiz lists:", error);
        } finally {
          setLoading(false); // 데이터를 모두 불러오면 로딩 상태 해제
        }
      }
    );

    // 컴포넌트가 언마운트 될 때 리스너 해제
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
    <>
      {allUsersQuizLists.map((user) =>
        user.quizList.map((quiz) => {
          if (quiz.quizList) {
            return (
              <div
                key={quiz.quizId}
                className="duration-300 hover:scale-105 flex flex-col items-center justify-center border-4 border-black  sm:w-[48%] md:w-[31%] lg:w-[24%] min-w-[180px] sm:min-w-[220px] min-h-[240px] rounded-2xl"
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
                  <div className="text-[12px] sm:text-[14px]">
                    {quiz.quizList && quiz.quizList.length}문제
                  </div>
                </div>
                <div className="relative w-full pb-[80%]">
                  {quiz.imageUrl && (
                    <Image src={quiz.imageUrl} alt="썸네일" fill />
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
          }
        })
      )}
    </>
  );
};

export default QuizList;
