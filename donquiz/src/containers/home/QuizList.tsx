"use client";

import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { db, storage } from "../../../firebase/firebasedb";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";

interface Quiz {
  quizId: string;
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

  useEffect(() => {
    const fetchedQuizLists: UserQuizList[] = [];
    const fetchQuizLists = async () => {
      try {
        // 모든 사용자의 uid를 가져옴
        const usersSnapshot = await getDocs(collection(db, "users"));

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
                  ...quizData, // 퀴즈 데이터
                };
              }
            )
          );

          // 사용자 uid와 해당 퀴즈 리스트 저장
          fetchedQuizLists.push({
            userId, // 사용자 uid
            quizList, // 해당 사용자의 퀴즈 리스트
          });
        }

        setAllUsersQuizLists(fetchedQuizLists);
      } catch (error) {
        console.error("Error fetching quiz lists:", error);
      }
    };

    fetchQuizLists();
  }, []);

  return (
    <>
      {allUsersQuizLists.map((user) =>
        user.quizList.map((quiz) => {
          if (quiz.quizList) {
            return (
              <div
                key={quiz.quizId}
                className="flex flex-col items-center justify-center border-4 border-black w-[24%] min-w-[280px] min-h-[280px] rounded-2xl"
              >
                <div className="w-[95%] flex items-center justify-between my-1">
                  <div className="text-[14px] flex items-center">
                    <FaUser size="20" /> 2.4k
                  </div>
                  <div className="text-[1.4rem]">{quiz.title}</div>
                  <div className="text-[14px]">
                    {quiz.quizList && quiz.quizList.length}문제
                  </div>
                </div>
                <div className="relative w-full pb-[80%]">
                  {quiz.imageUrl && (
                    <Image src={quiz.imageUrl} alt="썸네일" fill />
                  )}
                </div>
                <button
                  key={user.userId}
                  className="bg-[#FF4848] text-white rounded-3xl py-2 px-6 my-2"
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
