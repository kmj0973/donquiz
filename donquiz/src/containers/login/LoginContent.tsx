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

const LoginContent = () => {
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

        if (user.displayName && user.email)
          saveUser(user.displayName, user.email, user.uid);
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
    <>
      <div className="mb-8 w-full max-w-[400px]">
        <form onSubmit={onSignIn} className="flex flex-col w-full">
          <label htmlFor="email" className="text-[#999999] mb-2">
            Email
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-2 mb-3"
            id="email"
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password" className="text-[#999999] mb-2">
            Password
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-2 mb-14"
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full max-w-[350px] m-auto text-black bg-[#bbbbbb80] hover:bg-[#bbbbbb] rounded-2xl p-2 mb-4"
          >
            Login
          </button>
          {isCheckAuth ? (
            <div className="text-red-600 font-bold mt-1 text-center">
              이메일과 비밀번호를 확인해주세요
            </div>
          ) : null}
        </form>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-[350px]">
        <button
          onClick={onOpenPopUp}
          className="w-full text-center text-black bg-[#bbbbbb80] hover:bg-[#bbbbbb] rounded-2xl p-2 mb-2"
        >
          Sign Up
        </button>
        {isOpen ? <Auth /> : null}
        <Link
          className="w-full text-center text-black bg-[#FEE500] hover:bg-[#c4b426] rounded-2xl p-2 mb-2"
          href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
        >
          Sing up for kakao
        </Link>
      </div>
    </>
  );
};

export default LoginContent;
