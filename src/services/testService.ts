import { apiClient } from '@/services'

export interface StartAttemptDto {
  testId: string
  random: boolean
  mode: 'FULL' | 'PRACTICE'
  requestedSections: ('LISTENING' | 'READING' | 'WRITING' | 'SPEAKING')[]
}

export interface UpsertAnswersDto {
  answers?: {
    itemId: string
    answerText: string
    answerJson: object
    audioFileId?: string
  }[]
  writings?: {
    taskKey: string
    text: string
  }[]
}

export const getPublishedTests = (): Promise<any> => {
  return apiClient.get('/v1/tests')
}

export const getTestStructure = (testId: string): Promise<any> => {
  return apiClient.get(`/v1/tests/${testId}`)
}

export const startAttempt = (dto: StartAttemptDto): Promise<any> => {
  return apiClient.post('/v1/attempts', dto)
}

export const upsertAnswers = (attemptId: string, dto: UpsertAnswersDto): Promise<any> => {
  return apiClient.put(`/v1/attempts/${attemptId}/answers`, dto)
}

export const advanceSection = (attemptId: string): Promise<any> => {
  return apiClient.post(`/v1/attempts/${attemptId}/advance`)
}

export const submitAttempt = (attemptId: string): Promise<any> => {
  return apiClient.post(`/v1/attempts/${attemptId}/submit`)
}

export const getAttemptResult = (attemptId: string): Promise<any> => {
  return apiClient.get(`/v1/attempts/${attemptId}/result`)
}

export const uploadAudioFile = async (blob: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('file', blob, 'recording.webm')
  // Do not set Content-Type manually — axios sets multipart/form-data with boundary automatically
  const response: any = await apiClient.post('/v1/files/upload', formData, {
    headers: { 'Content-Type': undefined },
  } as any)
  return response?.id ?? response?.fileId ?? ''
}

export const formatListeningAnswers = (
  answers: Record<number, { value: string | string[] }>,
  questions: { id: number; itemId: string }[],
): UpsertAnswersDto['answers'] => {
  return Object.entries(answers).map(([id, ans]) => {
    const q = questions.find((q) => q.id === Number(id))
    return {
      itemId: q?.itemId ?? String(id),
      answerText: Array.isArray(ans.value) ? ans.value.join(',') : ans.value,
      answerJson: {},
    }
  })
}

export const formatWritingAnswers = (
  answers: Record<string, { value: string }>,
): UpsertAnswersDto['writings'] => {
  return Object.entries(answers).map(([taskKey, ans]) => ({
    taskKey,
    text: ans.value,
  }))
}

export const formatSpeakingAnswers = (
  recordings: { questionId: number; blob: Blob | null }[],
  uploadedFileIds: string[],
  questions: { id: number; itemId: string }[],
): UpsertAnswersDto['answers'] => {
  return recordings.map((rec, i) => {
    const q = questions.find((q) => q.id === rec.questionId)
    return {
      itemId: q?.itemId ?? String(rec.questionId),
      answerText: '',
      answerJson: {},
      ...(uploadedFileIds[i] ? { audioFileId: uploadedFileIds[i] } : {}),
    }
  })
}
