import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";

const fetchUserPoints = async (uid: string | null) => {
  const docRef = doc(db, `users/${uid}`);
  const user = await getDoc(docRef);
  return user.exists() ? user.data().point : 0;
};

// 포인트 업데이트 함수 정의
const updateUserPoints = async ({
  uid,
  additionalPoints,
}: {
  uid: string | null;
  additionalPoints: number;
}) => {
  const docRef = doc(db, `users/${uid}`);
  await updateDoc(docRef, { point: increment(additionalPoints) });
};

// Custom Hook 정의
export const useUserPoints = (uid: string | null) => {
  const queryClient = useQueryClient();

  // 포인트 조회용 useQuery
  const { data: points = 0 } = useQuery({
    queryKey: ["userDataPoint", uid], // 고유 queryKey
    queryFn: () => fetchUserPoints(uid), // fetch 함수
    enabled: !!uid, // uid가 있을 때만 실행
  });

  // 포인트 업데이트용 useMutation
  const updatePointsMutation = useMutation({
    mutationFn: (additionalPoints: number) =>
      updateUserPoints({ uid, additionalPoints }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPoints", uid] });
      queryClient.invalidateQueries({ queryKey: ["userRank", uid] });
      queryClient.invalidateQueries({ queryKey: ["userData", uid] }); // 업데이트 성공 시 캐시 무효화
    },
  });

  return { points, updatePointsMutation };
};
