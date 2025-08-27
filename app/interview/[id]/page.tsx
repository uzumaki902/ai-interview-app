"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import AIAvatar from '@/components/ai-avatar';
import { InterviewAvatar } from '@/lib/speech-service';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const interviewId = params.id as any;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcribedAnswer, setTranscribedAnswer] = useState('');

  // Refs
  const interviewAvatarRef = useRef<InterviewAvatar | null>(null);
  const speechServiceRef = useRef<any>(null);

  // Fetch interview data
  const interview = useQuery(api.interviews.getInterview, { interviewId });
  const saveAnswer = useMutation(api.interviews.saveAnswer);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const generateFeedback = useMutation(api.interviews.generateInterviewFeedback);

  useEffect(() => {
    if (interview && interview.questions) {
      // Initialize answers array
      setAnswers(new Array(interview.questions.length).fill(''));
      setCurrentQuestion(interview.questions[0]?.question || '');
      
      // Initialize interview avatar
      if (!interviewAvatarRef.current) {
        interviewAvatarRef.current = new InterviewAvatar();
      }
    }
  }, [interview]);

  useEffect(() => {
    if (interview && interview.status === 'completed') {
      setIsCompleted(true);
    }
  }, [interview]);

  // Handle voice answer
  const handleVoiceAnswer = (answer: string) => {
    setTranscribedAnswer(answer);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
    
    // Auto-save the answer
    if (interview) {
      saveAnswer({
        interviewId: interview._id,
        questionIndex: currentQuestionIndex,
        answer: answer
      });
    }
  };

  // Start listening for voice answer
  const handleStartListening = () => {
    if (interviewAvatarRef.current) {
      setIsListening(true);
      interviewAvatarRef.current.startListening(handleVoiceAnswer);
    }
  };

  // Stop listening
  const handleStopListening = () => {
    if (interviewAvatarRef.current) {
      setIsListening(false);
      interviewAvatarRef.current.stopListening();
    }
  };

  // Start the interview with AI avatar
  const startInterviewWithAvatar = () => {
    if (interview && interviewAvatarRef.current) {
      const questions = interview.questions.map(q => q.question);
      interviewAvatarRef.current.startInterview(questions, handleVoiceAnswer);
    }
  };

  const handleNext = async () => {
    if (!interview) return;

    // Save current answer if not already saved
    if (answers[currentQuestionIndex].trim() && !transcribedAnswer) {
      try {
        await saveAnswer({
          interviewId: interview._id,
          questionIndex: currentQuestionIndex,
          answer: answers[currentQuestionIndex]
        });
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }

    if (currentQuestionIndex < interview.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(interview.questions[nextIndex]?.question || '');
      setTranscribedAnswer('');
    } else {
      // Interview completed
      await completeInterview();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(interview?.questions[prevIndex]?.question || '');
      setTranscribedAnswer(answers[prevIndex] || '');
    }
  };

  const completeInterview = async () => {
    if (!interview) return;

    setIsLoading(true);
    try {
      // Update status to in-progress
      await updateStatus({
        interviewId: interview._id,
        status: 'in-progress'
      });

      // Generate feedback
      const feedback = await generateFeedback({
        interviewId: interview._id
      });

      toast.success('Interview completed! Generating feedback...');
      setIsCompleted(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error('Error completing interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Interview Completed!</h1>
          <p className="text-gray-600 mb-6">
            Great job! Your feedback is being generated. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {interview.title}
            </h1>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - AI Avatar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              🤖 AI Interviewer
            </h2>
            
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              currentQuestion={currentQuestion}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
            />

            {/* Start Interview Button */}
            {currentQuestionIndex === 0 && (
              <div className="text-center mt-6">
                <Button
                  onClick={startInterviewWithAvatar}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  🚀 Start AI Interview
                </Button>
              </div>
            )}
          </div>

          {/* Right Side - Question & Answer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              📝 Question & Answer
            </h2>
            
            {/* Question */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Question {currentQuestionIndex + 1}:</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700">{currentQuestion}</p>
              </div>
            </div>
            
            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer (Voice or Type):
              </label>
              
              {/* Voice Answer Display */}
              {transcribedAnswer && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Voice Answer:</strong> {transcribedAnswer}
                  </p>
                </div>
              )}
              
              <Textarea
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => setAnswers(prev => {
                  const newAnswers = [...prev];
                  newAnswers[currentQuestionIndex] = e.target.value;
                  return newAnswers;
                })}
                placeholder="Type your answer here or use voice input above..."
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="px-6 py-2"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
              >
                {isLoading ? 'Processing...' : 
                 currentQuestionIndex === interview.questions.length - 1 ? 'Complete Interview' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Interview Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the AI avatar for a realistic interview experience</li>
            <li>• Speak clearly when using voice input</li>
            <li>• Be specific and provide examples from your experience</li>
            <li>• Use the STAR method: Situation, Task, Action, Result</li>
            <li>• Keep your answers concise but detailed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
