import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../../firebase/firebasedb";

interface QuizData {
  image: string;
  answer: string;
  source: string;
}

// 퀴즈 업로드 및 업데이트를 위한 mutation hook
export const useUploadQuizList = (uid: string | null, docId: string) => {
  const queryClient = useQueryClient();

  const uploadImage = async (file: File) => {
    //스토리지에 이미지 저장 후 이미지 파일 이름 반환
    const uploadFileName = uuidv4();
    const imageRef = ref(storage, `images/${uploadFileName}`);
    await uploadBytes(imageRef, file);
    return uploadFileName;
  };

  const updateQuizList = async (newQuizList: QuizData[]) => {
    //퀴즈 리스트를 받아서 documnet에 퀴즈 리스트 필드 추가
    if (uid && docId) {
      const docRef = doc(db, "users", uid, "quizList", docId);
      await updateDoc(docRef, { quizList: newQuizList });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
  });
  const updateMutation = useMutation({
    //퀴즈 리스트 업데이트 함수, 업데이트 후 userQuizLists키를 갖고있는 쿼리 한번 더 호출
    mutationFn: updateQuizList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuizLists"] });
    },
  });

  return { uploadMutation, updateMutation };
};
