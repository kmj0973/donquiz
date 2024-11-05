import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";

interface Quiz {
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
  const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
  const docData = await getDoc(docRef);

  if (!docData.exists()) return []; // 데이터가 없으면 빈 배열 반환

  const quizData = docData.data();
  // quizList를 직접 가져와 반환
  const fetchedQuizData: Quiz[] = quizData.quizList.map((quiz: QuizData) => ({
    quizList: quiz,
  }));

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
