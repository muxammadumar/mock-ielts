import type {
  ListeningTest,
  TestPart,
  Question,
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from '@/types/listening'
import type { ReadingTest, ReadingTestPart, ReadingPassage, PassageParagraph } from '@/types/reading'
import type { WritingTest, WritingTask } from '@/types/writing'
import type { SpeakingTest, SpeakingPart, SpeakingQuestion } from '@/types/speaking'

// ---------------------------------------------------------------------------
// Shared: item → Question
// ---------------------------------------------------------------------------

function transformItem(item: any, sequentialId: number): Question {
  const meta: Record<string, any> = item.metaJson ?? {}
  const qType: string = meta.qType ?? ''

  const base = {
    id: sequentialId,
    itemId: String(item.id ?? ''),
    question: item.questionText ?? '',
    correctAnswer: '' as string,
  }

  if (qType === 'MCQ_SINGLE') {
    const rawOptions: any[] = meta.options ?? []
    return {
      ...base,
      type: 'multiple-choice',
      options: rawOptions.map((o) =>
        typeof o === 'object' && 'key' in o
          ? { value: String(o.key), label: String(o.text ?? o.key) }
          : { value: String(o), label: String(o) },
      ),
    } as MultipleChoiceQuestion
  }

  if (qType === 'TFNG') {
    return { ...base, type: 'true-false-ng' } as TrueFalseQuestion
  }

  if (['MATCHING_PARAGRAPHS', 'MATCHING_SECTIONS'].includes(qType)) {
    const letters: string[] = meta.letters ?? []
    return {
      ...base,
      type: 'multiple-choice',
      options: letters.map((l) => ({ value: l, label: l })),
    } as MultipleChoiceQuestion
  }

  if (['MATCHING_PEOPLE', 'MATCHING', 'TWO_LETTERS_GROUP'].includes(qType)) {
    const choices: any[] = meta.choices ?? []
    return {
      ...base,
      type: 'multiple-choice',
      options: choices.map((c) =>
        typeof c === 'string'
          ? { value: c, label: c }
          : { value: String(c.key ?? c.value ?? ''), label: String(c.text ?? c.label ?? '') },
      ),
    } as MultipleChoiceQuestion
  }

  // Default → fill-in-blank (SENTENCE_COMPLETION, TABLE_COMPLETION, NOTE_COMPLETION, SUMMARY_COMPLETION, …)
  return {
    ...base,
    type: 'fill-in-blank',
    blanks: meta.blanks ?? 1,
  } as FillInBlankQuestion
}

// ---------------------------------------------------------------------------
// Shared: part.passageText → ReadingPassage
// ---------------------------------------------------------------------------

function parsePassage(part: any): ReadingPassage {
  const meta: Record<string, any> = part.metaJson ?? {}
  const passageText: string = part.passageText ?? ''
  const title: string = part.title ?? ''

  let paragraphs: PassageParagraph[]

  if (meta.paragraphs || meta.sections) {
    // Paragraphs may be prefixed "A\nText…" or plain objects { label, text }
    const rawParas: any[] = meta.paragraphs ?? meta.sections
    paragraphs = rawParas.map((p) => {
      if (typeof p === 'string') {
        const firstNewline = p.indexOf('\n')
        if (firstNewline > 0 && firstNewline < 4) {
          return {
            label: p.substring(0, firstNewline),
            text: p.substring(firstNewline + 1).trim(),
          }
        }
        return { label: '', text: p.trim() }
      }
      return { label: String(p.label ?? ''), text: String(p.text ?? '') }
    })
  } else {
    // Split on blank lines; skip leading token if it repeats the part title
    const tokens = passageText.split('\n\n').filter(Boolean)
    let start = 0
    if (tokens[0]?.trim() === title.trim()) start = 1
    paragraphs = tokens.slice(start).map((t) => ({ label: '', text: t.trim() }))
  }

  return { title, paragraphs }
}

// ---------------------------------------------------------------------------
// Listening
// ---------------------------------------------------------------------------

export function transformListeningSection(section: any): ListeningTest {
  const items: any[] = section.items ?? []
  const parts: any[] = section.parts ?? []
  const media: any[] = section.media ?? []

  let questionCounter = 0

  const transformedParts: TestPart[] = [...parts]
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
    .map((part) => {
      const partNum: number = part.part
      const partItems = [...items]
        .filter((item) => item.part === partNum)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const startQ = questionCounter + 1
      const questions: Question[] = partItems.map((item) => {
        questionCounter++
        return transformItem(item, questionCounter)
      })
      const endQ = questionCounter

      const partAudio = media.find((m) => m.kind === 'AUDIO' && m.part === partNum)

      return {
        partNumber: partNum,
        title: part.title ?? `Part ${partNum}`,
        subtitle: questions.length ? `Questions ${startQ}–${endQ}` : '',
        questions,
        audioUrl: partAudio?.openUrl,
      } as TestPart
    })

  const globalAudio = media.find((m) => m.kind === 'AUDIO')

  return {
    id: section.id ?? '',
    title: section.title ?? 'Listening Test',
    description: '',
    totalQuestions: items.length,
    duration: Math.round((section.timeLimitSec ?? 0) / 60),
    testDuration: Math.round((section.timeLimitSec ?? 0) / 60),
    transferDuration: 10,
    parts: transformedParts,
    audioUrl: globalAudio?.openUrl ?? '',
    audioControlMode: 'exam',
    answerKey: {},
  }
}

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

export function transformReadingSection(section: any): ReadingTest {
  const items: any[] = section.items ?? []
  const parts: any[] = section.parts ?? []

  let questionCounter = 0

  const transformedParts: ReadingTestPart[] = [...parts]
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
    .map((part) => {
      const partNum: number = part.part
      const partItems = [...items]
        .filter((item) => item.part === partNum)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const startQ = questionCounter + 1
      const questions: Question[] = partItems.map((item) => {
        questionCounter++
        return transformItem(item, questionCounter)
      })
      const endQ = questionCounter

      return {
        partNumber: partNum,
        title: part.title ?? `Part ${partNum}`,
        subtitle: questions.length ? `Questions ${startQ}–${endQ}` : '',
        instruction: part.metaJson?.instruction ?? '',
        passage: parsePassage(part),
        questions,
      } as ReadingTestPart
    })

  return {
    id: section.id ?? '',
    title: section.title ?? 'Reading Test',
    description: '',
    totalQuestions: items.length,
    duration: Math.round((section.timeLimitSec ?? 0) / 60),
    parts: transformedParts,
    answerKey: {},
  }
}

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

export function transformWritingSection(section: any): WritingTest {
  const items: any[] = section.items ?? []
  const media: any[] = section.media ?? []

  const tasks: WritingTask[] = [...items]
    .filter((item) => item.itemType === 'WRITING_TASK')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item, i) => {
      const meta: Record<string, any> = item.metaJson ?? {}
      const taskImage = media.find((m) => m.kind === 'IMAGE' && m.part === item.part)
      return {
        id: i + 1,
        taskNumber: (i + 1) as 1 | 2,
        title: `Task ${i + 1}`,
        description: item.questionText ?? '',
        imageUrl: taskImage?.openUrl,
        minWords: meta.minWords ?? (i === 0 ? 150 : 250),
        taskKey: item.taskKey ?? `task${i + 1}`,
      } as WritingTask
    })

  return {
    id: section.id ?? '',
    title: section.title ?? 'Writing Test',
    duration: Math.round((section.timeLimitSec ?? 0) / 60),
    tasks,
    answerKey: {},
  }
}

// ---------------------------------------------------------------------------
// Speaking
// ---------------------------------------------------------------------------

export function transformSpeakingSection(section: any): SpeakingTest {
  const items: any[] = section.items ?? []
  const parts: any[] = section.parts ?? []

  let questionCounter = 0

  const transformedParts: SpeakingPart[] = [...parts]
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
    .map((part) => {
      const partNum: number = part.part
      const partItems = [...items]
        .filter((item) => item.part === partNum)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const questions: SpeakingQuestion[] = partItems.map((item, i) => {
        questionCounter++
        return {
          id: questionCounter,
          itemId: String(item.id ?? ''),
          questionNumber: item.order ?? i + 1,
          topic: part.title ?? '',
          question: item.questionText ?? '',
        }
      })

      return {
        partNumber: partNum,
        title: part.title ?? `Part ${partNum}`,
        questions,
      } as SpeakingPart
    })

  return {
    id: section.id ?? '',
    title: section.title ?? 'Speaking Test',
    duration: Math.round((section.timeLimitSec ?? 0) / 60),
    parts: transformedParts,
    totalQuestions: items.length,
  }
}
