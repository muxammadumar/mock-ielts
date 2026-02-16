import type { WritingTest } from '@/types/writing'

export const mockWritingTest: WritingTest = {
  id: 'writing-test-1',
  title: 'IELTS Academic Writing Test',
  duration: 60 * 60,
  tasks: [
    {
      id: 1,
      taskNumber: 1,
      title: 'IELTS practice Academic Writing test - Task 1',
      description:
        'The graph below shows the amount of waste produced by three companies over a period of 15 years.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      imageUrl: 'https://placehold.co/600x300?text=Recycling+Graph',
      minWords: 150,
    },
    {
      id: 2,
      taskNumber: 2,
      title: 'IELTS practice Academic Writing test - Task 2',
      description:
        'Some people believe that the best way to improve public health is by increasing the number of sports facilities. Others, however, believe that this would have little effect on public health and that other measures are required.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      minWords: 250,
    },
  ],
  answerKey: {},
}
