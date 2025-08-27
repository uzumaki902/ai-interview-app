"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CreateInterviewDialogProps {
  onInterviewCreated?: () => void;
}

export default function CreateInterviewDialog({ onInterviewCreated }: CreateInterviewDialogProps) {
  const { user } = useUser();
  const router = useRouter();
  const createInterview = useMutation(api.interviews.createInterview);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const [isLoading, setIsLoading] = useState(false);
  
  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Job description state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to create an interview");
      return;
    }

    setIsLoading(true);

    try {
      let interviewData: any = {
        userId: user.id,
        type: activeTab,
        title: activeTab === "resume" ? "Resume-based Interview" : jobTitle,
      };

      if (activeTab === "resume") {
        if (!resumeFile) {
          toast.error("Please upload a resume");
          setIsLoading(false);
          return;
        }
        // For now, we'll just create the interview without file upload
        // In a real app, you'd upload to Convex file storage
        interviewData.resumeUrl = "resume-uploaded";
      } else {
        if (!jobTitle.trim() || !jobDescription.trim()) {
          toast.error("Please fill in both job title and description");
          setIsLoading(false);
          return;
        }
        interviewData.description = jobDescription;
      }

      const interviewId = await createInterview(interviewData);
      
      toast.success("Interview created successfully!");
      setIsOpen(false);
      
      // Reset form
      setResumeFile(null);
      setJobTitle("");
      setJobDescription("");
      
      // Navigate to interview start page
      router.push(`/interview/${interviewId}`);
      
      if (onInterviewCreated) {
        onInterviewCreated();
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Failed to create interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Create Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Interview
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resume">Upload Resume</TabsTrigger>
              <TabsTrigger value="job-description">Job Description</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Upload your resume and we'll generate relevant interview questions
                  </p>
                  <FileUpload
                    onChange={(files: File[]) => handleResumeUpload(files[0])}
                  />
                  {resumeFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {resumeFile.name} selected
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="job-description" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <Input
                    placeholder="e.g., Frontend Developer, Product Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
