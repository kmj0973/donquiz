"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";

export function RouteChangeListener() {
  //이탈 감지 함수
  const [prevPathname, setPrevPathname] = useState<string | null>(null); // 이전 경로 저장
  const pathname: string = usePathname(); // 현재 경로
  const router = useRouter();

  const uid = useAuthStore((state) => state.uid); //user id

  useEffect(() => {
    if (prevPathname && prevPathname !== pathname) {
      // 경로가 변경되기 전에 alert 창을 띄움

      if (prevPathname.length > 10) {
        const confirmLeave = window.confirm(
          "현재 페이지를 떠나시겠습니까?\n(변경사항이 저장되지 않을 수 있습니다.)"
        );
        if (!confirmLeave) {
          // 사용자가 이동을 취소했을 경우, 이전 경로로 강제로 되돌리기
          router.replace(prevPathname);
        } else {
          console.log("삭제"); //퀴즈 제목 썸네일 삭제
          const docId = prevPathname.slice(8);
          if (docId && uid) {
            const docRef = doc(db, "users", uid, "quizList", docId);

            deleteDoc(docRef);
          }
        }
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      //새로고침 불가
      if (pathname.length > 15) {
        event.preventDefault();
        event.returnValue = ""; // 크롬에서는 빈 문자열이 필요함
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    // 경로가 변경되었을 때의 로직
    setPrevPathname(pathname); // 이전 경로 업데이트

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, prevPathname, router, uid]);

  return <></>;
}
