import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateInterviewQuestions, generateFeedback } from "../lib/ai-service";

// Create a new interview
export const createInterview = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate interview questions using our free AI service
    let questions;
    
    if (args.type === "resume") {
      // For resume-based interviews, create generic questions
      questions = generateInterviewQuestions("resume", {
        skills: ["general skills"],
        experience: ["work experience"],
        education: ["education background"]
      });
    } else {
      // For job description-based interviews
      questions = generateInterviewQuestions("job-description", {
        title: args.title,
        description: args.description || ""
      });
    }

    // Convert to database format
    const dbQuestions = questions.map(q => ({
      question: q.question,
      answer: undefined
    }));

    const interviewId = await ctx.db.insert("InterviewTable", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      description: args.description,
      resumeUrl: args.resumeUrl,
      questions: dbQuestions,
      status: "created",
      createdAt: Date.now()
    });

    return interviewId;
  },
});

// Get interviews for a user
export const getUserInterviews = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const interviews = await ctx.db
      .query("InterviewTable")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    return interviews;
  },
});

// Get a specific interview
export const getInterview = query({
  args: { interviewId: v.id("InterviewTable") },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    return interview;
  },
});

// Update interview status
export const updateInterviewStatus = mutation({
  args: {
    interviewId: v.id("InterviewTable"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewId, {
      status: args.status,
    });
  },
});

// Save answer to a question
export const saveAnswer = mutation({
  args: {
    interviewId: v.id("InterviewTable"),
    questionIndex: v.number(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error("Interview not found");

    const updatedQuestions = [...interview.questions];
    updatedQuestions[args.questionIndex] = {
      ...updatedQuestions[args.questionIndex],
      answer: args.answer,
    };

    await ctx.db.patch(args.interviewId, {
      questions: updatedQuestions,
    });
  },
});

// Generate and save feedback
export const generateInterviewFeedback = mutation({
  args: {
    interviewId: v.id("InterviewTable"),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error("Interview not found");

    // Generate feedback using our free service
    // Filter questions that have answers
    const questionsWithAnswers = interview.questions
      .filter(q => q.answer && q.answer.trim().length > 0)
      .map(q => ({ question: q.question, answer: q.answer! }));
    
    const feedback = generateFeedback(questionsWithAnswers);

    await ctx.db.patch(args.interviewId, {
      status: "completed",
      feedback: feedback,
    });

    return feedback;
  },
});

// Delete an interview
export const deleteInterview = mutation({
  args: {
    interviewId: v.id("InterviewTable"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.interviewId);
  },
}); 