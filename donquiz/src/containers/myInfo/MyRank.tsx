"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";

interface UserRanking {
  rank: number;
  totalUsers: number;
}

const MyRank = () => {
  const uid = useAuthStore((state) => state.uid);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);

  useEffect(() => {
    const getUserRank = async () => {
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, orderBy("point", "desc"));
      const querySnapshot = await getDocs(usersQuery);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
      }));

      const totalUsers = users.length;

      const userRank = users.findIndex((user) => user.id === uid);

      setUserRanking({
        rank: userRank + 1,
        totalUsers,
      });
    };

    getUserRank();
  }, [uid]);

  return (
    <div className="text-[15px] text-[#8F8F8F] mb-2">
      포인트 랭킹 {userRanking?.rank}위
    </div>
  );
};

export default MyRank;
