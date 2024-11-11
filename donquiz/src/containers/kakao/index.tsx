"use client";

import { useEffect } from "react";
import { auth, db } from "../../../firebase/firebasedb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { setCookie } from "@/global/cookie";
import { useAuthStore } from "@/hooks/useAuthStore";
import toast from "react-hot-toast";

const KaKao = () => {
  const router = useRouter();
  const saveUser = useAuthStore((state) => state.saveUser);

  const getResponse = async (code: string) => {
    try {
      const params = {
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_API_KEY || "",
        REDIRECT_URI:
          process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
          "https://donquiz.vercel.app/kakao",
        code: code,
      };

      const queryString = new URLSearchParams(params).toString();

      const tokenResponse = await fetch(
        `https://kauth.kakao.com/oauth/token?${queryString}`,
        { method: "POST" }
      );
      const TokenResponseData = await tokenResponse.json();
      const { access_token } = TokenResponseData;

      const userResponse = await fetch(`https://kapi.kakao.com/v2/user/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const UserResponseData = await userResponse.json();
      const id: number = UserResponseData.id;
      const email: string = UserResponseData.kakao_account.email;
      const nickName: string = UserResponseData.properties.nickname;

      return { id, email, access_token, nickName };
    } catch (e) {
      console.log(e);
    }
  };

  const loginOrRegisterWithKakao = async () => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    const response = await getResponse(code);

    if (!response) {
      console.error("Kakao login failed: email not found");
      return;
    }

    const { id, email, nickName, access_token } = response;
    const tempPassword = `kakao_${id}`;

    try {
      // 이메일로 Firebase 로그인 시도
      await signInWithEmailAndPassword(auth, email, tempPassword).then(
        async (userCredential) => {
          const user = userCredential.user;
          const accessToken = await user.getIdToken();

          setCookie("kakaoToken", access_token);
          setCookie("token", accessToken);
          if (user.displayName && user.email)
            saveUser(user.displayName, user.email, user.uid);
          toast.success("로그인 성공", { duration: 1000 });
        }
      );
    } catch (error) {
      // 사용자 등록 (계정이 없으면 생성)
      await createUserWithEmailAndPassword(auth, email, tempPassword).then(
        async (userCredential) => {
          const user = userCredential.user;
          const accessToken = await user.getIdToken();

          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: nickName,
            });
          } else {
            console.log(error);
          }

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: nickName,
            email: email,
            point: 0,
          });

          setCookie("kakaoToken", access_token);
          setCookie("token", accessToken);

          if (user.displayName && user.email)
            saveUser(user.displayName, user.email, user.uid);
          toast.success("로그인 성공", { duration: 1000 });
        }
      );
      console.log(error);
    } finally {
      router.replace("/"); // 로그인 후 홈 페이지로 리다이렉트
    }
  };

  useEffect(() => {
    loginOrRegisterWithKakao();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)] z-30">
      <div className="border-4 border-r-white border-[#fee500] rounded-full w-[50px] h-[50px] animate-spin mb-2" />
      <div className="text-[#FEE500] border-2 border-black">
        카카오 로그인 중...
      </div>
    </div>
  );
};

export default KaKao;
