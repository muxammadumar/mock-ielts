import type { SpeakingTest } from '@/types/speaking'

export const mockSpeakingTest: SpeakingTest = {
  id: 'speaking-test-1',
  title: 'IELTS Speaking Test',
  duration: 14 * 60,
  totalQuestions: 12,
  parts: [
    {
      partNumber: 1,
      title: 'Part 1',
      questions: [
        {
          id: 1,
          questionNumber: 1,
          topic: 'Your home town or village',
          question: 'What kind of place is it?',
        },
        {
          id: 2,
          questionNumber: 2,
          topic: 'Your home town or village',
          question: 'What\'s the most interesting part of your town or village?',
        },
        {
          id: 3,
          questionNumber: 3,
          topic: 'Your home town or village',
          question: 'What kind of jobs do people in your town or village do?',
        },
        {
          id: 4,
          questionNumber: 4,
          topic: 'Your home town or village',
          question: 'Would you say it\'s a good place to live? Why or why not?',
        },
        {
          id: 5,
          questionNumber: 5,
          topic: 'Daily routine',
          question: 'Can you describe your typical daily routine?',
        },
        {
          id: 6,
          questionNumber: 6,
          topic: 'Daily routine',
          question: 'What do you usually do in your free time?',
        },
        {
          id: 7,
          questionNumber: 7,
          topic: 'Daily routine',
          question: 'Has your daily routine changed recently? In what way?',
        },
        {
          id: 8,
          questionNumber: 8,
          topic: 'Work or study',
          question: 'Are you currently working or studying?',
        },
        {
          id: 9,
          questionNumber: 9,
          topic: 'Work or study',
          question: 'What do you enjoy most about your work or studies?',
        },
        {
          id: 10,
          questionNumber: 10,
          topic: 'Hobbies',
          question: 'What hobbies or interests do you have?',
        },
        {
          id: 11,
          questionNumber: 11,
          topic: 'Hobbies',
          question: 'How long have you been interested in this hobby?',
        },
        {
          id: 12,
          questionNumber: 12,
          topic: 'Hobbies',
          question: 'Do you think hobbies are important? Why?',
        },
      ],
    },
  ],
}
