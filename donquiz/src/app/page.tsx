"use client";

import { useUpload } from "@/hooks/useUpload";
import { useEffect } from "react";

export default function Home() {
  const falseUpload = useUpload((state) => state.FalseUpload);

  useEffect(() => {
    falseUpload();
  });

  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-center">
      hi
    </div>
  );
}
