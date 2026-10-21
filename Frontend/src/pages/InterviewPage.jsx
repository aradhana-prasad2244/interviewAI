import React, { useState } from "react";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";

const InterviewPage = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  const handleStart = (data) => {
  console.log("Interview Data:", data);
  console.log("Interview ID:", data.interviewId);
  console.log("Remaining Credits:", data.creditsLeft);
  console.log("User Name:", data.userName);
  console.log("Questions:", data.questions);

  console.log("First Question:", data.questions[0]);
  console.log("Question Text:", data.questions[0]?.question);

  setInterviewData(data);
  setStep(2);
};

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && <Step1SetUp onStart={handleStart} />}

      {step === 2 && (
        <Step2Interview
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
      <Step3Report report={interviewData} />
      )}
    </div>
  );
};

export default InterviewPage;
