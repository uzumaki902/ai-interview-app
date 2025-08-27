# 🚀 Free AI Mock Interview App

A completely free AI-powered mock interview application built with Next.js, React, and Convex. Practice your interview skills with AI-generated questions and get instant feedback - no subscriptions, no limits!

## ✨ Features

- **🤖 AI Avatar Interviewer**: Realistic interview experience with animated AI avatar
- **🎤 Voice Interaction**: AI speaks questions out loud and listens to your voice answers
- **🎯 AI-Generated Questions**: Smart interview questions based on job descriptions or resume analysis
- **📝 Interactive Interviews**: Answer questions one by one with a clean, intuitive interface
- **🎉 Instant Feedback**: Get detailed feedback, ratings, and improvement suggestions
- **🔐 User Authentication**: Secure sign-up and sign-in with Clerk
- **💾 Persistent Storage**: Save your interview history and progress with Convex
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI**: Beautiful interface built with Tailwind CSS and Shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Convex (real-time, serverless)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, Shadcn/ui
- **AI**: Custom question generation (no external APIs needed!)
- **Deployment**: Vercel (free tier)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account (free tier)
- Clerk account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### 1. Create an Account
- Sign up with your email or use social login
- Complete your profile setup

### 2. Create an Interview
- Choose between resume upload or job description
- For resume: Upload your PDF resume
- For job description: Enter the job title and description

### 3. Take the Interview
- Answer each question thoughtfully
- Use the STAR method for behavioral questions
- Navigate between questions with Previous/Next buttons

### 4. Get Feedback
- Receive instant feedback and rating
- Review improvement suggestions
- Track your progress over time

## 🔧 Customization

### Adding New Question Types
Edit `lib/ai-service.ts` to add more question categories:
- General questions
- Technical questions  
- Behavioral questions
- Role-specific questions

### Modifying the UI
- Update components in `app/_components/`
- Modify styles in `tailwind.config.js`
- Customize the color scheme and layout

## 🌟 Why It's Completely Free

- **No External AI APIs**: Uses smart templates and patterns instead of expensive AI services
- **Free Voice Technology**: Uses built-in browser Web Speech API (no external voice services)
- **Free Database**: Convex free tier provides generous limits
- **Free Authentication**: Clerk free tier handles user management
- **Free Hosting**: Deploy on Vercel for free
- **No Rate Limiting**: Unlimited interviews for all users
- **No Subscriptions**: One-time setup, forever free

## 🚀 Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Update Convex**
   - Deploy your Convex functions
   - Update production environment variables

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help:
- Check the documentation
- Open an issue on GitHub
- Review the code examples

---

**Built with ❤️ for developers who want to practice interviews without breaking the bank!**
