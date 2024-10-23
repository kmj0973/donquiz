"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUpload } from "@/hooks/useUpload";

export function RouteChangeListener() {
  //이탈 감지 함수
  const isUpload = useUpload((state) => state.isUpload);
  const falseUpload = useUpload((state) => state.FalseUpload);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const [prevFullname, setPrevFullname] = useState<string | null>(null); // 이전 경로 저장
  const pathname: string = usePathname(); // 현재 경로
  const router = useRouter();

  const uid = useAuthStore((state) => state.uid); //user id

  const params = useSearchParams();

  const userId = params.get("userId");
  const quizId = params.get("quizId");
  const title = params.get("title");

  useEffect(() => {
    if (
      prevFullname &&
      prevPathname &&
      prevPathname !== pathname &&
      !isUpload &&
      !pathname.includes("quiz")
    ) {
      // 경로가 변경되기 전에 alert 창을 띄움

      if (prevPathname.includes("create") || prevPathname.includes("quiz")) {
        const confirmLeave = window.confirm(
          "현재 페이지를 떠나시겠습니까?\n(변경사항이 저장되지 않을 수 있습니다.)"
        );
        if (!confirmLeave) {
          // 사용자가 이동을 취소했을 경우, 이전 경로로 강제로 되돌리기
          if (prevPathname.includes("quiz")) {
            router.replace(prevFullname);
          } else {
            router.replace(prevPathname);
          }
        } else {
          //퀴즈 제목 썸네일 삭제
          const docId = prevPathname.slice(8);
          if (docId && uid) {
            const docRef = doc(db, "users", uid, "quizList", docId);

            deleteDoc(docRef);
          }
        }
      }
    } else {
      falseUpload();
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
    setPrevFullname(
      pathname + `?userId=${userId}&quizId=${quizId}&title=${title}`
    );

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, prevPathname, router, uid]);

  return <></>;
}
