// Free AI Interview Question Generator
// This service generates interview questions using templates and patterns
// No external AI APIs required - completely free!

export interface InterviewQuestion {
  question: string;
  category: string;
}

export interface JobInfo {
  title: string;
  description: string;
}

export interface ResumeInfo {
  skills: string[];
  experience: string[];
  education: string[];
}

// Common interview question templates
const COMMON_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths?",
  "What are your greatest weaknesses?",
  "Where do you see yourself in 5 years?",
  "Why do you want to work for this company?",
  "What motivates you?",
  "Describe a challenging situation you faced at work and how you handled it.",
  "What are your salary expectations?",
  "Do you have any questions for us?",
  "Why should we hire you?"
];

// Technical question templates
const TECHNICAL_QUESTIONS = [
  "Can you walk me through your technical background?",
  "What programming languages are you most comfortable with?",
  "Describe a technical problem you solved recently.",
  "How do you stay updated with the latest technology trends?",
  "What's your experience with version control systems?",
  "How do you approach debugging complex issues?",
  "What's your experience with agile development methodologies?",
  "How do you handle tight deadlines?",
  "What's your experience with testing and quality assurance?",
  "How do you collaborate with non-technical team members?"
];

// Behavioral question templates
const BEHAVIORAL_QUESTIONS = [
  "Tell me about a time you had to work with a difficult team member.",
  "Describe a situation where you had to learn something quickly.",
  "Give me an example of when you showed leadership.",
  "Tell me about a time you failed and what you learned from it.",
  "Describe a situation where you had to make a decision without all the information.",
  "Tell me about a time you had to adapt to a significant change at work.",
  "Give me an example of when you had to persuade someone to see your point of view.",
  "Describe a time when you had to work under pressure.",
  "Tell me about a time you had to resolve a conflict.",
  "Give me an example of when you went above and beyond what was expected."
];

export function generateInterviewQuestions(
  type: "resume" | "job-description",
  info: JobInfo | ResumeInfo
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  
  // Always include some common questions
  questions.push(
    ...COMMON_QUESTIONS.slice(0, 3).map(q => ({
      question: q,
      category: "general"
    }))
  );
  
  if (type === "job-description") {
    const jobInfo = info as JobInfo;
    
    // Add job-specific questions
    questions.push(
      {
        question: `What experience do you have with ${jobInfo.title}?`,
        category: "role-specific"
      },
      {
        question: `How do you think your background aligns with this ${jobInfo.title} position?`,
        category: "role-specific"
      },
      {
        question: `What interests you most about this ${jobInfo.title} role?`,
        category: "motivation"
      }
    );
    
    // Add technical questions if it's a technical role
    if (isTechnicalRole(jobInfo.title)) {
      questions.push(
        ...TECHNICAL_QUESTIONS.slice(0, 4).map(q => ({
          question: q,
          category: "technical"
        }))
      );
    }
    
    // Add behavioral questions
    questions.push(
      ...BEHAVIORAL_QUESTIONS.slice(0, 3).map(q => ({
        question: q,
        category: "behavioral"
      }))
    );
  } else {
    // Resume-based questions
    const resumeInfo = info as ResumeInfo;
    
    questions.push(
      {
        question: `Can you tell me more about your experience with ${resumeInfo.skills[0] || 'your skills'}?`,
        category: "experience"
      },
      {
        question: `What was your most significant achievement in your previous role?`,
        category: "achievement"
      },
      {
        question: `How has your education prepared you for your career?`,
        category: "education"
      }
    );
    
    // Add technical questions based on skills
    if (resumeInfo.skills.length > 0) {
      questions.push(
        ...TECHNICAL_QUESTIONS.slice(0, 3).map(q => ({
          question: q,
          category: "technical"
        }))
      );
    }
    
    // Add behavioral questions
    questions.push(
      ...BEHAVIORAL_QUESTIONS.slice(0, 3).map(q => ({
        question: q,
        category: "behavioral"
      }))
    );
  }
  
  // Shuffle questions to make them more natural
  return shuffleArray(questions).slice(0, 10);
}

function isTechnicalRole(title: string): boolean {
  const technicalKeywords = [
    'developer', 'engineer', 'programmer', 'software', 'web', 'frontend', 'backend',
    'fullstack', 'devops', 'data', 'analyst', 'architect', 'qa', 'test'
  ];
  
  return technicalKeywords.some(keyword => 
    title.toLowerCase().includes(keyword)
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Simple feedback generator
export function generateFeedback(answers: { question: string; answer: string }[]): {
  rating: number;
  feedback: string;
  suggestions: string[];
} {
  const totalQuestions = answers.length;
  const answeredQuestions = answers.filter(a => a.answer && a.answer.trim().length > 10).length;
  const answerQuality = answers.filter(a => a.answer && a.answer.trim().length > 20).length;
  
  let rating = 5; // Base rating
  
  // Adjust rating based on participation
  if (answeredQuestions === totalQuestions) rating += 2;
  else if (answeredQuestions >= totalQuestions * 0.8) rating += 1;
  
  // Adjust rating based on answer quality
  if (answerQuality >= totalQuestions * 0.7) rating += 2;
  else if (answerQuality >= totalQuestions * 0.5) rating += 1;
  
  // Cap rating at 10
  rating = Math.min(rating, 10);
  
  let feedback = "";
  if (rating >= 8) {
    feedback = "Excellent interview performance! You demonstrated strong communication skills and provided thoughtful, detailed responses.";
  } else if (rating >= 6) {
    feedback = "Good interview performance. You answered most questions well, but could provide more detailed responses in some areas.";
  } else {
    feedback = "Fair interview performance. Consider practicing more detailed responses and preparing specific examples for common questions.";
  }
  
  const suggestions = [
    "Practice answering common interview questions with specific examples from your experience",
    "Prepare stories that demonstrate your skills and achievements",
    "Research the company and role before interviews",
    "Practice active listening and ask clarifying questions when needed",
    "Follow up with thank you notes after interviews"
  ];
  
  return { rating, feedback, suggestions };
} 