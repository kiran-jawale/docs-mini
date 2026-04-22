import React from "react";

const Background = () => {
  return (
    <div className="absolute w-full h-full z-[0]">
      <div className="absolute top-[5%] w-full flex justify-center text-zinc-600 font-semibold text-xl">
        Documents
      </div>
      <h1 className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] text-[13vw] leading-none tracking-tighter font-semibold text-zinc-900">
        DOCS
      </h1>
    </div>
  );
};

export default Background;