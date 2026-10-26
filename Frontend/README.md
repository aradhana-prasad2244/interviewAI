# InterviewAI 🎯

**An AI-Powered Interview Preparation Platform**

InterviewAI is a full-stack web application that helps users prepare for job interviews using Artificial Intelligence. It integrates Google's Gemini API to analyze resumes, generate interview questions, and evaluate answers, making interview preparation more interactive and accessible.

## 🚀 Live Demo

- **Frontend:** [InterviewAI](https://interviewai-frontend-kpsg.onrender.com)
- **Backend:** [Backend API](https://interviewai-vwct.onrender.com)
- **GitHub Repository:** [InterviewAI on GitHub](https://github.com/aradhana-prasad2244/interviewAI)

> **Note:** The application is hosted on Render. Initial requests may take longer if the backend service is inactive. AI features depend on API availability and usage quotas.

## ✨ Features

- **AI-Powered Resume Analysis:** Analyze resume content using Google's Gemini AI.
- **AI Interview Question Generation:** Generate interview questions for interview preparation.
- **Answer Evaluation:** Receive AI-generated feedback on interview answers.
- **Interview History:** Save and revisit previous interview sessions.
- **PDF Generation:** Generate PDF reports of interview results.
- **Google Authentication:** Sign in using Google authentication.
- **Credit System:** Manage credits for AI-powered interview features.
- **Payment Integration:** Purchase additional credits using Razorpay.
- **RESTful APIs:** Connect the frontend and backend through API endpoints.
- **Database Integration:** Store application data using MongoDB.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Redux Toolkit

### Backend
- Node.js
- Express.js
- JavaScript
- REST APIs
- JWT Authentication
- PDF Parsing

### Database
- MongoDB
- Mongoose

### Artificial Intelligence
- Google Gemini API
- Google GenAI SDK
- Large Language Model (LLM) integration
- Prompt engineering

### Authentication and Payments
- Firebase Authentication
- JSON Web Tokens (JWT)
- Razorpay

### Deployment and Tools
- Git and GitHub
- Render
- npm

## 🧠 How It Works

1. The user signs in and accesses the InterviewAI application.
2. The user uploads a resume for analysis.
3. The backend processes the request and sends the relevant input to the Gemini API.
4. The AI model analyzes the resume and generates interview-related content.
5. The user answers interview questions and receives AI-generated evaluation and feedback.
6. Interview sessions can be saved and revisited through interview history.
7. The user can generate a PDF report of interview results.

## 📂 Project Structure

## 📂 Project Structure

```text
InterviewAI/
├── Backend/
│   ├── controllers/
│   │   └── interview.controller.js
│   ├── services/
│   │   └── openRouter.services.js
│   ├── models/
│   ├── routes/
│   └── package.json
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

> The structure above shows the main folders and selected files. Refer to the repository for the complete project structure.

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Google Gemini API key
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/aradhana-prasad2244/interviewAI.git
cd interviewAI
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory and add the environment variables required by your backend.

Example:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

**Important:** Use the exact environment variable names referenced in your backend code. Add any additional variables required for authentication and payment integration.

Start the backend using the script defined in `Backend/package.json`. For example:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd Frontend
npm install
```

Configure the frontend environment variables required by your application.

Use the exact variable name expected by your frontend code.

Start the frontend using the script defined in `Frontend/package.json`. For example:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 🤖 AI Integration

InterviewAI uses Google's Gemini API to power its AI-based features.

The AI integration supports:

- Resume analysis
- Interview question generation
- Interview answer evaluation
- AI-generated feedback

The backend service layer handles communication with the AI model, while the controllers manage application requests and responses.

This project integrates an existing Large Language Model (LLM) through an API. It does not train a custom AI model.

## 🔐 Security

- Store API keys and database credentials in environment variables.
- Never expose secret keys in frontend code or public repositories.
- Validate incoming requests on the backend.
- Handle AI API errors and quota limits appropriately.
- Protect authenticated routes and user-specific data.
- Avoid logging sensitive user information.

## ⚠️ Limitations

- AI responses depend on the selected model and API availability.
- API usage quotas may limit the number of AI requests.
- AI-generated feedback may not always be accurate.
- Application availability depends on the hosting service.

## 🔮 Future Improvements

- Adaptive interview questions based on previous answers.
- More detailed interview performance analytics.
- Expanded customization for different job roles and skill levels.
- Improved automated testing and error handling.
- Integration of additional AI capabilities to improve interview feedback and personalization.

## 🎯 Project Objective

InterviewAI demonstrates the integration of full-stack web development and Artificial Intelligence to create an interactive interview preparation platform. It combines a React frontend, Node.js and Express backend, MongoDB database, and Gemini-powered features in one application.

## 👩‍💻 Author

**Aradhana Prasad**

- [GitHub Profile](https://github.com/aradhana-prasad2244/interviewAI)

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.