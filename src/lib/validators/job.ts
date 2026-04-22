import { z } from 'zod'
import { JOB_CATEGORIES } from '@/types'

export const jobPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title is too long'),
  description: z
    .string()
    .min(10, 'Please provide more detail (at least 10 characters)')
    .max(2000, 'Description is too long'),
  category: z.enum(
    JOB_CATEGORIES as [string, ...string[]],
    { required_error: 'Please select a category' }
  ),
  budget: z
    .number({ invalid_type_error: 'Budget must be a number' })
    .min(1000, 'Minimum budget is ₦1,000')
    .max(100_000_000, 'Budget seems too high'),
  city: z.string().min(1, 'Please select a city'),
  timeline: z.enum(['urgent', 'this_week', 'this_month', 'flexible']),
  businessName: z.string().min(2, 'Business name is required'),
  businessAddress: z.string().min(5, 'Business address is required'),
  jobType: z.enum(['full-time', 'contract']),
  closingDate: z.string().min(1, 'Closing date is required'),
})

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z
    .string()
    .min(50, 'Please write at least 50 characters in your cover letter'),
  proposedRate: z
    .number({ invalid_type_error: 'Rate must be a number' })
    .min(500, 'Minimum rate is ₦500'),
  availability: z.enum(['immediately', 'within_3_days', 'within_a_week']),
})

export type JobPostInput = z.infer<typeof jobPostSchema>
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>
