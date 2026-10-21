import fs from "fs";
import { askAi } from "../services/openRouter.services.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

// Helper to clean AI responses

const cleanAiResponse = (response) => {
  return response
    .trim()
    .replace(/^```(?:json|text)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

// ANALYZE RESUME

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    if (!resumeText) {
      return res.status(400).json({
        message: "No readable text found in resume.",
      });
    }

    const messages = [
      {
        role: "system",
        content: `Extract structured data from the resume.
Return ONLY valid JSON in this format:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
Do not include Markdown or extra text.`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi({ message: messages });

    console.log("Raw AI Response:", aiResponse);

    const cleanedResponse = cleanAiResponse(aiResponse);

    console.log("Cleaned AI Response:", cleanedResponse);

    const parsed = JSON.parse(cleanedResponse);

    console.log("Parsed AI Response:", parsed);
    console.log("Is Array:", Array.isArray(parsed));

    return res.status(200).json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      resumeText,
    });
  } catch (error) {
    console.error("Analyze Resume Error:", error);
    return res.status(500).json({ message: error.message });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Resume cleanup Error:", error.message);
      }
    }
  }
};

// GENERATE QUESTIONS

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, Experience and Mode are required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 credits required.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    // FIX: Define userPrompt before using it
    const userPrompt = `
Role: ${role}
Experience: ${experience}
InterviewMode: ${mode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
`;

    // FIX: Keep only one messages declaration
    // ========= chatgpt ===========
    
const messages = [
  {
    role: "system",
    content: `You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

STRICT OUTPUT RULES:
- Generate EXACTLY 5 interview questions, no more and no less.
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number the questions.
- Do NOT add explanations, headings, introductions, or extra text.
- Put exactly one question on each line.
- Return exactly 5 lines.
- Keep the language simple and conversational.
- Questions must be practical and realistic.
- Do not generate follow-up questions.

DIFFICULTY PROGRESSION:
Line 1: Easy
Line 2: Easy
Line 3: Medium
Line 4: Medium
Line 5: Hard

Make questions based on the candidate's role, experience, interview mode, projects, skills, and resume details.

Before responding, verify that the output contains exactly 5 questions.`
  },
  {
    role: "user",
    content: userPrompt,
  },
];

    // =========== original code ============
//     const messages = [
//       {
//         role: "system",
//         content: `You are a real human interviewer conducting a professional interview.

// Speak in simple, natural English as if you are directly talking to the candidate.

// Generate exactly 5 interview questions.

// Strict Rules:
// - Each question must contain between 15 and 25 words.
// - Each question must be a single complete sentence.
// - Do NOT number them.
// - Do NOT add explanations.
// - Do NOT add extra text before or after.
// - One question per line only.
// - Keep language simple and conversational.
// - Questions must feel practical and realistic.

// Difficulty progression:
// Question 1 → easy
// Question 2 → easy
// Question 3 → medium
// Question 4 → medium
// Question 5 → hard

// Make questions based on the candidate's role, experience, interviewMode, projects, skills, and resume details.`,
//       },
//       {
//         role: "user",
//         content: userPrompt,
//       },
//     ];

    // FIX: Call AI once
    const aiResponse = await askAi({ message: messages });

    console.log("RAW AI RESPONSE:", aiResponse);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(502).json({
        message: "AI returned empty response.",
      });
    }

    // // FIX: Handle line breaks and numbered responses
    // const questionsArray = cleanAiResponse(aiResponse)
    //   .split(/\r?\n/)
    //   .map((question) => question.trim())
    //   .filter(Boolean)
    //   .map((question) => question.replace(/^\d+[\).\s-]+/, "").trim())
    //   .filter(Boolean);

    // ========= original code ==========
    // const cleanedResponse = cleanAiResponse(aiResponse);

    // let questionsArray = cleanedResponse
    //   .split(/\r?\n/)
    //   .map((question) => question.replace(/^\s*\d+[\s.)-]+/, "").trim())
    //   .filter(Boolean);

    // // If all questions come in one line
    // if (questionsArray.length === 1) {
    //   const matches = cleanedResponse.match(/[^?]+\?/g);

    //   if (matches && matches.length === 5) {
    //     questionsArray = matches.map((question) => question.trim());
    //   }
    // }

    // console.log("PARSED QUESTIONS:", questionsArray);
    // console.log("QUESTION COUNT:", questionsArray.length);

    // if (questionsArray.length !== 5) {
    //   return res.status(502).json({
    //     message: `Expected 5 questions, received ${questionsArray.length}. Please try again.`,
    //   });
    // }

    // ========== cahtgpt ===============

    const cleanedResponse = cleanAiResponse(aiResponse);

let questionsArray = cleanedResponse
  .split(/\r?\n/)
  .map((question) =>
    question.replace(/^\s*(?:\d+[.)-]\s*|[-*•]\s*)/, "").trim()
  )
  .filter(Boolean);

// If all questions come in one line, split by question marks
if (questionsArray.length === 1) {
  const matches = cleanedResponse.match(/[^?]+\?/g);

  if (matches) {
    questionsArray = matches.map((question) => question.trim());
  }
}

console.log("PARSED QUESTIONS:", questionsArray);
console.log("QUESTION COUNT:", questionsArray.length);

// Reject if AI generated fewer than 5 questions
if (questionsArray.length < 5) {
  return res.status(502).json({
    message: `Expected 5 questions, received ${questionsArray.length}. Please try again.`,
  });
}

// Keep exactly 5 questions if AI generated extra ones
questionsArray = questionsArray.slice(0, 5);


    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((question, index) => ({
        question: question,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    user.credits -= 50;
    await user.save();

    return res.status(200).json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Generate Question Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// SUBMIT ANSWER

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answers, timeTaken } = req.body;

    if (
      !interviewId ||
      !Number.isInteger(Number(questionIndex)) ||
      Number(questionIndex) < 0
    ) {
      return res.status(400).json({
        message: "Valid interviewId and questionIndex are required.",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const question = interview.questions[Number(questionIndex)];

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // No answer submitted
    if (!answers || !answers.trim()) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
      });
    }

    // Time exceeded
    if (Number(timeTaken) > question.timeLimit) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "Time limit exceeded, you did not submit an answer.";
      question.answer = answers;

      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `You are a professional human interviewer evaluating a candidate's answer.

Evaluate naturally and fairly.

Score the answer from 0 to 10 in:
1. Confidence
2. Communication
3. Correctness

Be realistic and unbiased. Do not give random high scores.

Calculate finalScore as the average of confidence, communication,
and correctness, rounded to the nearest whole number.

Feedback must contain 10 to 15 words, sound natural, and suggest
improvement when needed. Do not repeat the question.

Return ONLY valid JSON:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}`,
      },
      {
        role: "user",
        // FIX: Use question.question because generation saves that field
        content: `
Question: ${question.question}
Answer: ${answers}
`,
      },
    ];

    // FIX: Pass the messages using the same askAi argument format

    // const aiResponse = await askAi({ message: messages });

    // console.log("AI RESPONSE:", aiResponse);
    // console.log("RESPONSE TYPE:", typeof aiResponse);

    // const parsed = JSON.parse(cleanAiResponse(aiResponse));

    const aiResponse = await askAi({ message: messages });

    console.log("AI RESPONSE:", aiResponse);
    console.log("RESPONSE TYPE:", typeof aiResponse);

    const cleanedResponse = cleanAiResponse(aiResponse);
    console.log("CLEANED RESPONSE:", cleanedResponse);

    const parsed = JSON.parse(cleanedResponse);

    question.answer = answers;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({
      feedback: parsed.feedback,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// FINISH INTERVIEW

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        message: "Interview ID is required.",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((question) => {
      totalScore += question.score || 0;
      totalConfidence += question.confidence || 0;
      totalCommunication += question.communication || 0;
      totalCorrectness += question.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),

      // FIX: Use the same question field saved during generation
      questionWiseScore: interview.questions.map((question) => ({
        question: question.question,
        score: question.score || 0,
        feedback: question.feedback || "",
        confidence: question.confidence || 0,
        communication: question.communication || 0,
        correctness: question.correctness || 0,
      })),
    });
  } catch (error) {
    console.error("Finish Interview Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interview = await Interview.find({ userId:req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interview);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to finish currentUser Interview ${error}` });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      console.error("Interview not found");
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((question) => {
      totalConfidence += question.confidence || 0;
      totalCommunication += question.communication || 0;
      totalCorrectness += question.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions
    });
  } catch (error) {
    console.error("Get Interview Report Error:", error);
    return res.status(404).json({ message: "Interview not found" });
  }
};

