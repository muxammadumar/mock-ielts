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
    audioFileId: string
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
): UpsertAnswersDto['answers'] => {
  return Object.entries(answers).map(([id, ans]) => ({
    itemId: String(id),
    answerText: Array.isArray(ans.value) ? ans.value.join(',') : ans.value,
    answerJson: {},
    audioFileId: '',
  }))
}

export const formatWritingAnswers = (
  answers: Record<number, { value: string }>,
): UpsertAnswersDto['writings'] => {
  return Object.entries(answers).map(([taskId, ans]) => ({
    taskKey: taskId,
    text: ans.value,
  }))
}

export const formatSpeakingAnswers = (
  recordings: { questionId: number; blob: Blob | null }[],
  uploadedFileIds: string[],
): UpsertAnswersDto['answers'] => {
  return recordings.map((rec, i) => ({
    itemId: String(rec.questionId),
    answerText: '',
    answerJson: {},
    audioFileId: uploadedFileIds[i] ?? '',
  }))
}
