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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const JobSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is too short').max(80, 'Job title is too long'),
  jobDescription: z.string().min(20, 'Please provide at least 20 characters'),
});

type JobFormValues = z.infer<typeof JobSchema>;

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

  // RHF for Job Description
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<JobFormValues>({
    resolver: zodResolver(JobSchema),
    mode: 'onChange',
    defaultValues: { jobTitle: '', jobDescription: '' }
  });

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const onSubmitJob = async (data: JobFormValues) => {
    await createInterviewFlow({
      type: 'job-description',
      title: data.jobTitle,
      description: data.jobDescription,
    });
  };

  const createInterviewFlow = async (payload: { type: 'resume'|'job-description'; title: string; description?: string }) => {
    if (!user) {
      toast.error("Please sign in to create an interview");
      return;
    }

    setIsLoading(true);
    try {
      const interviewData: any = {
        userId: user.id,
        type: payload.type,
        title: payload.title,
      };

      if (payload.type === 'resume') {
        if (!resumeFile) {
          toast.error("Please upload a resume (PDF)");
          setIsLoading(false);
          return;
        }
        interviewData.resumeUrl = "resume-uploaded";
      } else {
        interviewData.description = payload.description;
      }

      const interviewId = await createInterview(interviewData);
      toast.success("Interview created successfully!");
      // reset
      setIsOpen(false);
      setResumeFile(null);
      reset();
      // Navigate
      router.push(`/interview/${interviewId}`);
      onInterviewCreated?.();
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
                    Upload your resume (PDF) and we'll generate relevant interview questions
                  </p>
                  <FileUpload
                    onChange={(files: File[]) => handleResumeUpload(files[0])}
                  />
                  {resumeFile ? (
                    <p className="text-sm text-green-600 mt-2">✓ {resumeFile.name} selected</p>
                  ) : (
                    <p className="text-sm text-red-600 mt-2">PDF required</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => createInterviewFlow({ type: 'resume', title: 'Resume-based Interview' })}
                    disabled={isLoading || !resumeFile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Creating...' : 'Create Interview'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="job-description" className="mt-6">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmitJob)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <Input
                    placeholder="e.g., Frontend Developer"
                    {...register('jobTitle')}
                    className={errors.jobTitle ? 'border-red-500' : ''}
                  />
                  {errors.jobTitle && (
                    <p className="text-xs text-red-600 mt-1">{errors.jobTitle.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    {...register('jobDescription')}
                    className={`min-h-[120px] ${errors.jobDescription ? 'border-red-500' : ''}`}
                  />
                  {errors.jobDescription && (
                    <p className="text-xs text-red-600 mt-1">{errors.jobDescription.message}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Creating...' : 'Create Interview'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
