"use client";

import React, { useState } from "react";
import { auth, db } from "../../../firebase/firebasedb";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { usePopUp } from "@/hooks/usePopUp";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const Auth = () => {
  const { ClosePopUp } = usePopUp();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckNick, setIsCheckNick] = useState(false);
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isCheckPassword, setIsCheckPassword] = useState(false);

  const onClosePopUp = () => {
    ClosePopUp();
    setNickname("");
    setEmail("");
    setPassword("");
    setIsCheckNick(false);
    setIsCheckEmail(false);
    setIsCheckPassword(false);
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCheckNick(false);
    setIsCheckEmail(false);
    setIsCheckPassword(false);

    const q = query(
      collection(db, "users"),
      where("displayName", "==", nickname)
    );

    const querySnapshot = await getDocs(q);

    if (nickname.length < 2 || !querySnapshot.empty) {
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
          // await addDoc(collection(db, "users"), {
          //   uid: user.uid,
          //   displayName: nickname,
          //   email: email,
          // }); //document id를 user의 uid로 만들기 위해 setDoc 함수 사용

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: nickname,
            email: email,
          });

          await addDoc(collection(db, `users/${user.uid}/quizList`), {});

          onClosePopUp();
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
    <>
      <div
        onClick={onClosePopUp}
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
  );
};

export default Auth;
