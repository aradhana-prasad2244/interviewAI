import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Auth from "../pages/Auth";
import { FaTimes } from "react-icons/fa";

const AuthModel = ({ onclose }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onclose();
    }
  }, [userData, onclose]);

  return (
    <div className="fixed inset-0 z-\[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4">
      <div className="realative w-full max-w-md">
        <button className="absolute top-8 right-5 text-gray-500 hover:text-black text-xl cursor-pointer" onClick={onclose}>
            <FaTimes size={18}/>
        </button>
        <Auth isModel={true}/>

      </div>
    </div>
  );
};

export default AuthModel;
