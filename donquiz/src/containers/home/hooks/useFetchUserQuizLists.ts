"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";

interface Quiz {
  userId: string;
  quizId: string;
  title: string;
  imageUrl: string;
  participant: number;
  quizList: string[];
}

interface UserQuizList {
  quizList: Quiz[];
}

// 데이터 fetching 함수
export const fetchUserQuizLists = async (): Promise<UserQuizList[]> => {
  const usersSnapshot = await getDocs(collection(db, "users"));

  // 모든 유저의 quizList 데이터를 병렬로 가져옴
  const updatedQuizLists: UserQuizList[] = await Promise.all(
    usersSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const quizListSnapshot = await getDocs(
        collection(db, `users/${userId}/quizList`)
      );

      const quizList: Quiz[] = await Promise.all(
        quizListSnapshot.docs.map(async (quizDoc) => {
          const quizData = quizDoc.data();

          return {
            userId: userId,
            quizId: quizDoc.id,
            title: quizData.title,
            imageUrl: quizData.thumbnail,
            participant: quizData.participant,
            quizList: quizData.quizList,
          };
        })
      );

      return { quizList };
    })
  );

  return updatedQuizLists;
};

// Custom Hook 정의
export const useFetchUserQuizLists = () => {
  // const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userQuizLists"],
    queryFn: fetchUserQuizLists,
    staleTime: 1000 * 60 * 10,
  });

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "users"), async () => {
  //     const updatedData = await fetchUserQuizLists();
  //     queryClient.setQueryData(["userQuizLists"], updatedData);
  //   });

  //   return () => unsubscribe();
  // }, [queryClient]);

  return { data, isLoading, error };
};
