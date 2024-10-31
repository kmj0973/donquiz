import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";
import { useQuery } from "@tanstack/react-query";

const getUserRank = async (uid: string | null) => {
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, orderBy("point", "desc"));
  const querySnapshot = await getDocs(usersQuery);

  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
  }));

  const userRank = users.findIndex((user) => user.id === uid);

  return {
    rank: userRank + 1,
  };
};

export const useUserRank = (uid: string | null) => {
  return useQuery({
    queryKey: ["userRank", uid],
    queryFn: () => getUserRank(uid),
  });
};
