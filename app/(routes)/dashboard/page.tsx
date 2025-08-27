"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import CreateInterviewDialog from '../../_components/createinterviewdialog';
import FeedbackDialog from '../../_components/feedback-dialog';
import DeleteConfirmationDialog from '../../_components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';

interface Interview {
  _id: string;
  type: string;
  title: string;
  description?: string;
  status: string;
  createdAt: number;
  feedback?: {
    rating: number;
    feedback: string;
    suggestions: string[];
  };
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingInterviewId, setDeletingInterviewId] = useState<any | null>(null);
  const [selectedInterviews, setSelectedInterviews] = useState<Set<any>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Convex mutations
  const deleteInterview = useMutation(api.interviews.deleteInterview);

  // Fetch interviews from Convex
  const userInterviews = useQuery(api.interviews.getUserInterviews, 
    user ? { userId: user.id } : "skip"
  );

  useEffect(() => {
    if (userInterviews) {
      setInterviews(userInterviews);
      setIsLoading(false);
    }
  }, [userInterviews]);

  const handleInterviewCreated = () => {
    // Refresh the interviews list
    window.location.reload();
  };

  const handleStartInterview = (interviewId: any) => {
    router.push(`/interview/${interviewId}`);
  };

  const handleDeleteInterview = async (interviewId: any) => {
    setDeletingInterviewId(interviewId);
    try {
      await deleteInterview({ interviewId });
      toast.success('Interview deleted successfully!');
      
      // Remove from local state
      setInterviews(prev => prev.filter(interview => interview._id !== interviewId));
      // Remove from selected
      setSelectedInterviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(interviewId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview. Please try again.');
    } finally {
      setDeletingInterviewId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInterviews.size === 0) return;

    setIsBulkDeleting(true);
    try {
      // Delete all selected interviews
      const deletePromises = Array.from(selectedInterviews).map(interviewId => 
        deleteInterview({ interviewId })
      );
      
      await Promise.all(deletePromises);
      
      toast.success(`${selectedInterviews.size} interview(s) deleted successfully!`);
      
      // Remove from local state
      setInterviews(prev => prev.filter(interview => !selectedInterviews.has(interview._id)));
      setSelectedInterviews(new Set());
    } catch (error) {
      console.error('Error bulk deleting interviews:', error);
      toast.error('Failed to delete some interviews. Please try again.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleInterviewSelection = (interviewId: string) => {
    setSelectedInterviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interviewId)) {
        newSet.delete(interviewId);
      } else {
        newSet.add(interviewId);
      }
      return newSet;
    });
  };

  const selectAllInterviews = () => {
    setSelectedInterviews(new Set(interviews.map(interview => interview._id)));
  };

  const clearSelection = () => {
    setSelectedInterviews(new Set());
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
            </h1>
            <p className="text-gray-600 mt-2">
              Practice your interview skills with AI-generated questions
            </p>
          </div>
          <CreateInterviewDialog onInterviewCreated={handleInterviewCreated} />
        </div>

        {/* Interviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Interviews</h2>
            
            {/* Bulk Actions */}
            {interviews.length > 0 && (
              <div className="flex items-center space-x-3">
                {selectedInterviews.size > 0 && (
                  <>
                    <span className="text-sm text-gray-600">
                      {selectedInterviews.size} selected
                    </span>
                    <DeleteConfirmationDialog
                      onConfirm={handleBulkDelete}
                      title="Delete Multiple Interviews"
                      message={`Are you sure you want to delete ${selectedInterviews.size} selected interview(s)? This will permanently remove them and all associated feedback. This action cannot be undone.`}
                      isLoading={isBulkDeleting}
                    >
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        disabled={isBulkDeleting}
                      >
                        🗑️ Delete Selected ({selectedInterviews.size})
                      </Button>
                    </DeleteConfirmationDialog>
                    <Button
                      variant="outline"
                      onClick={clearSelection}
                      size="sm"
                    >
                      Clear Selection
                    </Button>
                  </>
                )}
                
                {selectedInterviews.size === 0 && (
                  <Button
                    variant="outline"
                    onClick={selectAllInterviews}
                    size="sm"
                  >
                    Select All
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first interview to start practicing
              </p>
              <CreateInterviewDialog onInterviewCreated={handleInterviewCreated} />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    selectedInterviews.has(interview._id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedInterviews.has(interview._id)}
                        onChange={() => toggleInterviewSelection(interview._id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {interview.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {interview.type.replace('-', ' ')} Interview
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : interview.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {interview.status.replace('-', ' ')}
                    </span>
                  </div>

                  {interview.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {interview.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      Created {new Date(interview.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {interview.status === 'created' && (
                      <Button
                        onClick={() => handleStartInterview(interview._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Start Interview
                      </Button>
                    )}
                    
                    {interview.status === 'completed' && interview.feedback && (
                      <FeedbackDialog feedback={interview.feedback}>
                        <Button
                          variant="outline"
                          className="flex-1"
                        >
                          View Feedback ({interview.feedback.rating}/10)
                        </Button>
                      </FeedbackDialog>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDeleteInterview(interview._id)}
                      title="Delete Interview"
                      message={`Are you sure you want to delete "${interview.title}"? This will permanently remove the interview and all associated feedback. This action cannot be undone.`}
                      isLoading={deletingInterviewId === interview._id}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        🗑️ Delete Interview
                      </Button>
                    </DeleteConfirmationDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

