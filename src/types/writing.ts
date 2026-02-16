export interface WritingTask {
  id: number
  taskNumber: 1 | 2
  title: string
  description: string
  imageUrl?: string
  minWords: number
}

export interface WritingTest {
  id: string
  title: string
  duration: number
  tasks: WritingTask[]
  answerKey: Record<number, string>
}

export interface WritingAnswer {
  taskId: number
  value: string
}

export interface WritingTestResult {
  testId: string
  tasksAnswered: number
  timeSpent: number
  completedAt: string
}
