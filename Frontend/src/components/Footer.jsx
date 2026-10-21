import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 pb-10 py-4 pt-10'>
        <div className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
        <img className="h-9" src="./public/interviewAI logo.png" alt="logo"/>
        <h2 className='font-semibold'>Interview.AI</h2>
        </div>
        <p className='text-gray-500 text-sm max-w-xl mx-auto'>
            AI-driven interview practice platform built to strengthen communication, enhance technical knowledge, and boost interview confidence.
        </p>
        </div>
    </div>
  )
}

export default Footer