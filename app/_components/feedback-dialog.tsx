"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Feedback {
  rating: number;
  feedback: string;
  suggestions: string[];
}

interface FeedbackDialogProps {
  feedback: Feedback;
  children: React.ReactNode;
}

export default function FeedbackDialog({ feedback, children }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 8) return '🎉';
    if (rating >= 6) return '👍';
    return '💪';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Interview Feedback
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Rating */}
          <div className="text-center">
            <div className="text-6xl mb-2">{getRatingEmoji(feedback.rating)}</div>
            <div className={`text-4xl font-bold ${getRatingColor(feedback.rating)}`}>
              {feedback.rating}/10
            </div>
            <p className="text-gray-600 mt-2">
              {feedback.rating >= 8 ? 'Excellent!' : 
               feedback.rating >= 6 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </div>

          {/* Feedback */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Overall Feedback</h3>
            <p className="text-gray-700 leading-relaxed">
              {feedback.feedback}
            </p>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Suggestions for Improvement</h3>
            <div className="space-y-2">
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="text-center pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
