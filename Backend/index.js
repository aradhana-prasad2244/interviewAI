import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";
dotenv.config();

const app = express();

app.use(cors(
    {origin: "https://interviewai-frontend-kpsg.onrender.com",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 5000;

app.get("/", (req,res)=>{
    return res.json({message: "Server Started"});
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
})
