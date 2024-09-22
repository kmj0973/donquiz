"use client";

import React, { useState } from "react";
import { auth } from "../../../firebase/firebasedb";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckEmail, setIsCheckEmail] = useState(false);

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsCheckEmail(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setIsCheckEmail(true);
      });
  };

  return (
    <>
      <div className="absolute w-screen h-screen top-0 bg-black opacity-70 flex justify-center items-center"></div>
      <div className="absolute w-[550px] h-[550px] bottom-[25%] bg-white rounded-3xl flex flex-col justify-center items-center">
        <div className="text-5xl font-bold mb-10 ">회원 가입</div>
        <form onSubmit={onSignUp} className="flex flex-col w-[400px]">
          <label htmlFor="nickname" className="text-[#999999] mb-2">
            Nickname
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-3"
            id="nickname"
            type="text"
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
              console.log(password);
            }}
          />
          <button className="bg-[#222222] rounded-lg p-3 text-white">
            SIGN UP
          </button>
          {isCheckEmail ? (
            <div className="text-red-600 font-bold mt-1 text-center">
              중복된 이메일입니다
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default Auth;
