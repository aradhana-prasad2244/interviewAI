import React from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react";
import { BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { HiOutlineLogout } from "react-icons/hi";
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../App';
import AuthModel from './AuthModel';

const Navbar = () => {

    const {userData} = useSelector((state) => state.user);
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true})
            dispatch(setUserData(null));
            setShowUserPopup(false);
            setShowCreditPopup(false);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 py-6'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration:0.3}}
        className='w-full max-w-6xl bg-white rounded-xl shadow-sm-border border-gray-200 px-8 py-4 flex justify-between items-center relative'>

        <div className='flex items-center gap-1 cursor-pointer'>
            <div className="p-2 rounded-lg">
             <img className="h-9" src="./public/interviewAI logo.png" alt="logo"/>
          </div>

          <h2 className="text-blue-950 font-semibold text-lg hidden md:block">interview.AI</h2>
        </div>

        <div className='flex items-center gap-6 relative'>

            <div className='relative'>
                <button
                onClick={()=>{
                    if(!userData) {
                        setShowAuth(true);
                        return;
                    }
                    setShowCreditPopup(!showCreditPopup);
                    setShowUserPopup(false);
                    console.log(showCreditPopup);
                }}
                className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition cursor-pointer'>
                <BsCoin size={20} />
                {userData?.credits || 0}
                </button>

                {
                    showCreditPopup && (
                        <div className='absolute right-\[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>
                            <p className='text-sm text-gray-600 mb-4'>Need more credits to continue interviews?</p>
                            <button 
                            onClick={()=>navigate('/pricing')}
                            className='w-full bg-black text-white py-2 rounded-lg text-sm cursor-pointer'>Buy more credits</button>
                        </div>
                    )
                }
            </div>

            <div className='relative'>
                <button 
                onClick={()=>{
                    if(!userData) {
                        setShowAuth(true);
                        return;
                    }
                    setShowUserPopup(!showUserPopup);
                    setShowCreditPopup(false);
                    console.log(showUserPopup);
                }}
                className='w-9 h-9 bg-blue-950 text-white rounded-full flex items-center justify-center font-semibold cursor-pointer'>
                {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16} />}
                </button>

                {
                    showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50'>
                            <p className='text-md text-blue-500 font-medium mb-1'>
                                {userData?.name}
                            </p>

                            <button 
                            onClick={()=>{
                                navigate("/history")
                            }}
                            className='w-full text-left text-sm py-2 hover:text-black text-gray-600'>Interview History</button>
                            <button 
                            onClick={handleLogout}
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-700 cursor-pointer'>
                                <HiOutlineLogout size={16} />
                                logout
                                </button>
                        </div>
                    )
                }
            </div>

        </div>
        </motion.div>

        {showAuth && <AuthModel onclose={()=>setShowAuth(false)}/>}
    </div>
  )
}

export default Navbar