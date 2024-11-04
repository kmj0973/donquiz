import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";

interface Quiz {
  participant: number;
  imageUrl: string;
  quizList: QuizData;
}

interface QuizData {
  answer: string;
  image: string;
  source: string;
}

export const fetchQuizData = async (
  userId: string | null,
  quizId: string | null
): Promise<Quiz[]> => {
  const fetchedQuizData: Quiz[] = [];
  const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
  const docData = await getDoc(docRef);

  if (docData.exists()) {
    const quizData = docData.data();

    // 모든 이미지 URL을 동시에 가져오는 부분
    const quizPromises = quizData.quizList.map(async (quiz: QuizData) => {
      return {
        participant: quizData.participant,
        imageUrl: quiz.image,
        quizList: quiz,
      };
    });

    // 병렬 처리된 결과를 fetchedQuizData에 저장
    const quizResults = await Promise.all(quizPromises);
    fetchedQuizData.push(...quizResults);
  }
  return fetchedQuizData;
};

const updateParticipantCount = async (userId: string, quizId: string) => {
  const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
  await updateDoc(docRef, { participant: increment(1) });
};

export const useFetchQuizData = (
  userId: string | null,
  quizId: string | null
) => {
  return useQuery({
    queryKey: ["quizData", userId, quizId],
    queryFn: () => fetchQuizData(userId, quizId),
  });
};

// Function to increment the participant count in Firestore

export const useUpdateParticipantCount = (userId: string, quizId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateParticipantCount(userId, quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizData", userId, quizId] });
    },
  });
};
