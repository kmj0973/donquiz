"use client";

import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../../firebase/firebasedb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { setCookie } from "../../global/cookie";
import { useAuthStore } from "@/hooks/useAuthStore";
import { usePopUp } from "@/hooks/usePopUp";
import Auth from "../auth";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();

  const saveUser = useAuthStore((state) => state.saveUser);
  const { isOpen, OpenPopUp } = usePopUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckAuth, setIsCheckAuth] = useState(false);

  const onOpenPopUp = () => {
    OpenPopUp();
    setIsCheckAuth(false);
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const accessToken = await user.getIdToken();

        setCookie("token", accessToken);
        console.log(user);
        if (user.displayName) saveUser(user.displayName, user.uid);
        toast.success("로그인 성공", { duration: 1000 });

        router.replace("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("code:" + errorCode + errorMessage);

        setIsCheckAuth(true);
      });
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="h-28 sm:h-36 text-[48px] sm:text-[72px] lg:text-[108px] text-white bg-black px-4 sm:px-6 pb-2 sm:pb-3 flex items-center mt-8 sm:mt-12 mb-10 sm:mb-20">
        <span className="text-[#FF0000]">D</span>ON
        <span className="text-[#FFF700]">Q</span>UIZ
      </div>
      <div className="mb-8 sm:mb-10 w-full max-w-[400px]">
        <form onSubmit={onSignIn} className="flex flex-col w-full">
          <label htmlFor="email" className="text-[#999999] mb-2">
            Email
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-2 sm:p-3 mb-3"
            id="email"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password" className="text-[#999999] mb-2">
            Password
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-2 sm:p-3 mb-5"
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-[#222222] hover:bg-black rounded-lg p-2 sm:p-3 text-white"
          >
            SIGN IN
          </button>
          {isCheckAuth ? (
            <div className="text-red-600 font-bold mt-1 text-center">
              이메일과 비밀번호를 확인해주세요
            </div>
          ) : null}
        </form>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-[400px]">
        <button
          onClick={onOpenPopUp}
          className="w-full text-center text-white bg-[#222222] hover:bg-black rounded-lg p-2 sm:p-3 mb-2"
        >
          SIGN UP
        </button>
        {isOpen ? <Auth /> : null}
        <Link
          className="w-full text-center text-white bg-[#fff022] rounded-lg p-2 sm:p-3 mb-2"
          href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
        >
          KAKAO
        </Link>
        <Link
          className="w-full text-center text-white bg-[#3bf8ff] rounded-lg p-2 sm:p-3 mb-2"
          href="/auth"
        >
          GOOGLE
        </Link>
        {/* <Image alt="kakao_login" src={kakao_image} width={400} height={50} />
        <Image alt="google_login" src={google_image} width={400} height={50} /> */}
      </div>
    </div>
  );
};

export default Login;
