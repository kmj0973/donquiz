import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../../firebase/firebasedb";

interface QuizList {
  image: string;
  answer: string;
  source: string;
}

// 퀴즈 업로드 및 업데이트를 위한 mutation hook
export const useUploadQuizList = (uid: string | null, docId: string) => {
  const queryClient = useQueryClient();

  const uploadImage = async (file: File) => {
    const uploadFileName = uuidv4();
    const imageRef = ref(storage, `images/${uploadFileName}`);
    await uploadBytes(imageRef, file);
    return uploadFileName;
  };

  const updateQuizList = async (newQuizList: QuizList[]) => {
    if (uid && docId) {
      const docRef = doc(db, "users", uid, "quizList", docId);
      await updateDoc(docRef, { quizList: newQuizList });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
  });
  const updateMutation = useMutation({
    mutationFn: updateQuizList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuizLists"] });
    },
  });

  return { uploadMutation, updateMutation };
};
