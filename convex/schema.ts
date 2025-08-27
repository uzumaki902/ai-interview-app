import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(), 
        email: v.string()
    }),
    
    InterviewTable: defineTable({
        userId: v.string(),
        type: v.string(), // "resume" or "job-description"
        title: v.string(),
        description: v.optional(v.string()),
        resumeUrl: v.optional(v.string()),
        questions: v.array(v.object({
            question: v.string(),
            answer: v.optional(v.string())
        })),
        status: v.string(), // "created", "in-progress", "completed"
        feedback: v.optional(v.object({
            rating: v.number(),
            feedback: v.string(),
            suggestions: v.array(v.string())
        })),
        createdAt: v.number()
    })
});