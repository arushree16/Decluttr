# 🌱 Decluttr - Mind Decluttering App

A full-stack web application designed to help users declutter their minds by organizing thoughts, tracking moods, and providing AI-powered suggestions.

## ✨ Features

- **🧠 Thought Dump**: Voice and text input for mind decluttering
- **🤖 AI-Powered Categorization**: Automatically categorizes thoughts into Academic, Project, Emotional, Social, Personal, or Other
- **📝 Smart Suggestions**: AI-generated actionable suggestions based on your thoughts
- **✅ To-Do List**: Automatic task extraction and manual task management
- **😊 Mood Tracking**: Daily mood tracking with emoji interface
- **📊 History**: View and manage your thought, suggestion, and mood history
- **🔐 Authentication**: Google and email/password authentication via Firebase


## 🚀 Tech Stack

### Frontend

- **React** - UI framework
- **Chakra UI** - Component library
- **Framer Motion** - Animations
- **Firebase Auth** - Authentication
- **Axios** - HTTP client for AI APIs

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM

### AI Services

- **OpenAI GPT-3.5** - Primary AI service
- **Cohere** - Fallback AI service
- **Web Speech API** - Voice input

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- OpenAI API key (optional)
- Cohere API key (optional)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/arushree16/Decluttr
   cd Decluttr
   ```

2. **Frontend Setup**

   ```bash
   cd decluttr-app
   npm install
   ```

3. **Backend Setup**

   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Configuration**

   Create `.env` file in the backend directory:

   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```

   Create `.env.local` file in the root directory for frontend API keys:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

   # AI API Keys
   OPENAI_API_KEY=your_openai_api_key_here
   COHERE_API_KEY=your_cohere_api_key_here
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**

   ```bash
   cd decluttr-app
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

1. **Build the frontend**

   ```bash
   cd decluttr-app
   npm run build
   ```

2. **Deploy to your preferred hosting service**

## 🌐 Deployment

### Frontend Deployment Options

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `build` folder or connect to GitHub
- **Firebase Hosting**: Use Firebase CLI to deploy

### Backend Deployment Options

- **Heroku**: Connect your GitHub repo
- **Railway**: Simple deployment with automatic scaling
- **Render**: Free tier available with automatic deployments

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

**Backend:**

- `MONGO_URI`
- `PORT` (if required by your hosting service)

**Frontend:**

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `OPENAI_API_KEY`
- `COHERE_API_KEY`

## 📁 Project Structure

```
Decluttr/
├── backend/
│   ├── index.js          # Express server
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── decluttr-app/
│   ├── public/
│   │   ├── index.html    # Main HTML file
│   │   ├── favicon.ico   # App icon
│   │   ├── manifest.json # PWA manifest
│   │   └── robots.txt    # SEO robots file
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── index.js      # React entry point
│   │   ├── firebase.js   # Firebase configuration
│   │   └── index.css     # Global styles
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Frontend documentation
└── README.md             # This file
```

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP address to the whitelist
4. Create a database user
5. Get your connection string

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Google and Email/Password)
3. Get your Firebase config from the Firebase Console
4. Add the Firebase environment variables to your `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### AI Services Setup

1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Cohere**: Get API key from [Cohere](https://cohere.ai/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ for better mental health and productivity
