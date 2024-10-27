import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../../firebase/firebasedb";

interface Quiz {
  participant: number;
  imageUrl: string;
  quizList: QuizObject;
}

interface QuizObject {
  answer: string;
  image: string;
  source: string;
}

const fetchQuizData = async (
  userId: string | null,
  quizId: string | null
): Promise<Quiz[]> => {
  const fetchedQuizData: Quiz[] = [];
  const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
  const docData = await getDoc(docRef);

  if (docData.exists()) {
    const quizData = docData.data();
    for (const quiz of quizData.quizList) {
      let imageUrl = "";
      if (quiz.image) {
        const imageRef = ref(storage, `images/${quiz.image}`);
        imageUrl = await getDownloadURL(imageRef);
      }
      fetchedQuizData.push({
        participant: quizData.participant,
        imageUrl,
        quizList: quiz,
      });
    }
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
