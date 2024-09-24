"use client";

import Link from "next/link";
import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase/firebasedb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckNick, setIsCheckNick] = useState(false);
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isCheckPassword, setIsCheckPassword] = useState(false);

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

  const onPopUp = () => {
    setIsOpenPopUp(!isOpenPopUp);
    setNickname("");
    setEmail("");
    setPassword("");
    setIsCheckNick(false);
    setIsCheckEmail(false);
    setIsCheckPassword(false);
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const accessToken = await user.getIdToken();

        console.log(user);

        localStorage.setItem("accessToken", accessToken);
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("code:" + errorCode + errorMessage);

        setIsCheckEmail(true);
      });
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCheckNick(false);
    setIsCheckEmail(false);
    setIsCheckPassword(false);

    if (nickname.length < 2) {
      setIsCheckNick(true);
    } else if (email.length < 3) {
      setIsCheckEmail(true);
    } else if (password.length < 6) {
      setIsCheckPassword(true);
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log(user);

          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: nickname,
            });
          }

          await addDoc(collection(db, "users"), {
            uid: user.uid,
            displayName: nickname,
            email: email,
          });

          onPopUp();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("code:" + errorCode + errorMessage);

          if (errorCode.includes("email")) {
            setIsCheckEmail(true);
          } else {
            setIsCheckPassword(true);
          }
        });
    }
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
          onClick={onPopUp}
          className="w-[400px] text-center text-white bg-[#222222] hover:bg-black rounded-lg p-3 mb-2"
        >
          SIGN UP
        </button>
        {isOpenPopUp ? (
          <>
            <div
              onClick={onPopUp}
              className="absolute w-screen h-screen top-0 bg-black opacity-70 flex justify-center items-center"
            ></div>
            <div className="absolute w-[550px] h-[550px] bottom-[25%] bg-white rounded-3xl flex flex-col justify-center items-center">
              <div className="text-5xl font-bold mb-10 ">SIGN UP</div>
              <form onSubmit={onSignUp} className="flex flex-col w-[400px]">
                <label htmlFor="nickname" className="text-[#999999] mb-2">
                  Nickname
                </label>
                <input
                  className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-3"
                  id="nickname"
                  type="text"
                  placeholder="2자 이상"
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                />
                <label htmlFor="email" className="text-[#999999] mb-2">
                  Email
                </label>
                <input
                  className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-3"
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
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
                  placeholder="6자 이상"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    console.log(password);
                  }}
                />
                <button className="bg-[#222222] hover:bg-black rounded-lg p-3 text-white">
                  SIGN UP
                </button>
                {isCheckNick ? (
                  <div className="text-red-600 font-bold mt-1 text-center">
                    허용되지 않은 닉네임입니다
                  </div>
                ) : null}
                {isCheckEmail ? (
                  <div className="text-red-600 font-bold mt-1 text-center">
                    허용되지 않은 이메일입니다
                  </div>
                ) : null}
                {isCheckPassword ? (
                  <div className="text-red-600 font-bold mt-1 text-center">
                    비밀번호를 다시 입력해주세요
                  </div>
                ) : null}
              </form>
            </div>
          </>
        ) : null}
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
