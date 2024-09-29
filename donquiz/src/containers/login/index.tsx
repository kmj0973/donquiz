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

const Login = () => {
  const router = useRouter();

  const { saveUser } = useAuthStore();
  const { isOpen, OpenPopUp } = usePopUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isCheckPassword, setIsCheckPassword] = useState(false);
  const onOpenPopUp = () => {
    OpenPopUp();
    setEmail("");
    setPassword("");
    setIsCheckEmail(false);
    setIsCheckPassword(false);
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const accessToken = await user.getIdToken();

        setCookie("token", accessToken);

        if (user.displayName) saveUser(user.displayName, user.uid);
        router.replace("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("code:" + errorCode + errorMessage);

        setIsCheckEmail(true);
      });
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center">
      <div className="h-36 text-[108px] text-white bg-black px-6 flex items-center mt-12 mb-20">
        <span className="text-[#FF0000]">D</span>ON
        <span className="text-[#FFF700]">Q</span>UIZ
      </div>
      <div className="mb-10">
        <form onSubmit={onSignIn} className="flex flex-col w-[400px]">
          <label htmlFor="email" className="text-[#999999] mb-2">
            Email
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-3"
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
            className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-5"
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-[#222222] hover:bg-black rounded-lg p-3 text-white"
          >
            SIGN IN
          </button>
          {isCheckEmail ? (
            <div className="text-red-600 font-bold mt-1 text-center">
              이메일과 비밀번호를 확인해주세요
            </div>
          ) : null}
          {isCheckPassword ? (
            <div className="text-red-600 font-bold mt-1 text-center">
              이메일과 비밀번호를 확인해주세요
            </div>
          ) : null}
        </form>
      </div>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={onOpenPopUp}
          className="w-[400px] text-center text-white bg-[#222222] hover:bg-black rounded-lg p-3 mb-2"
        >
          SIGN UP
        </button>
        {isOpen ? <Auth /> : null}
        <Link
          className="w-[400px] text-center text-white bg-[#ffe921] rounded-lg p-3 mb-2"
          href="/auth"
        >
          KAKAO
        </Link>
        <Link
          className="w-[400px] text-center text-white bg-[#3bf8ff] rounded-lg p-3 mb-2"
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
