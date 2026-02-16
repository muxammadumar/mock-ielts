<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { useListeningStore } from '@/stores/useListeningStore'
import { useReadingStore } from '@/stores/useReadingStore'
import TestNavHeader from '@/components/common/TestNavHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const attemptStore = useAttemptStore()
const listeningStore = useListeningStore()
const readingStore = useReadingStore()

const apiResult = computed(() => attemptStore.result)

const overallBand = computed(() => {
  const r = apiResult.value
  return r?.overallBand ?? r?.band ?? r?.overall_band ?? '--'
})

const listeningBand = computed(() => listeningStore.testResult?.score ?? 0)
const listeningRaw = computed(() => listeningStore.testResult?.correctAnswers ?? 0)
const readingBand = computed(() => readingStore.testResult?.score ?? 0)
const readingRaw = computed(() => readingStore.testResult?.correctAnswers ?? 0)

const writingBand = computed(() => {
  const r = apiResult.value
  return r?.sections?.WRITING?.band ?? r?.sections?.writing?.band ?? r?.writing?.band ?? '--'
})

const speakingBand = computed(() => {
  const r = apiResult.value
  return r?.sections?.SPEAKING?.band ?? r?.sections?.speaking?.band ?? r?.speaking?.band ?? '--'
})

const sectionScores = computed(() => [
  { key: 'listening', label: 'Listening', icon: 'headphones', bg: '#EEF2FF', band: listeningBand.value, extra: `${listeningRaw.value} Right answers` },
  { key: 'reading', label: 'Reading', icon: 'book', bg: '#FFF7ED', band: readingBand.value, extra: `${readingRaw.value} Right answers` },
  { key: 'writing', label: 'Writing', icon: 'pencil', bg: '#F0FDF4', band: writingBand.value, extra: 'AI scored' },
  { key: 'speaking', label: 'Speaking', icon: 'speech-bubble', bg: '#FDF2F8', band: speakingBand.value, extra: 'AI scored' },
])

const strongAreas = computed(() =>
  sectionScores.value
    .filter(s => typeof s.band === 'number' && s.band >= 7.0)
    .map(s => s.label),
)

const needsImprovement = computed(() =>
  sectionScores.value
    .filter(s => typeof s.band === 'number' && s.band < 7.0)
    .map(s => s.label),
)

const insights = computed<string[]>(() => {
  const r = apiResult.value
  const raw = r?.insights ?? r?.performanceInsights ?? r?.performance_insights ?? null
  if (Array.isArray(raw) && raw.length) return raw
  return ['Your results are ready. Review your section scores above.']
})

const recommendations = computed<string[]>(() => {
  const r = apiResult.value
  const raw = r?.recommendations ?? null
  if (Array.isArray(raw) && raw.length) return raw
  return ['Continue practicing regularly to improve your score.']
})

const completedDate = computed(() => {
  const r = apiResult.value
  const dateStr = r?.completedAt ?? r?.completed_at ?? null
  if (!dateStr) return new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  return new Date(dateStr).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
})

const handleBack = () => router.push({ name: 'home' })
const handleReviewAnswers = () => router.push({ name: 'answers-review' })
const handleHome = () => router.push({ name: 'home' })
const handleRetake = () => router.push({ name: 'mock-test' })
</script>

<template>
  <div class="result-view">
    <TestNavHeader title="Your result" @back="handleBack" />

    <div class="result-view__scroll">
      <!-- Completion card -->
      <div class="result-view__card result-view__card--completion">
        <span class="result-view__celebrate">🎉</span>
        <h2 class="result-view__completion-title">You've Completed the Full IELTS Mock Test!</h2>
        <p class="result-view__completion-subtitle">Great effort! Here's a summary of your performance.</p>
        <p class="result-view__completion-date">{{ completedDate }}</p>
      </div>

      <!-- Overall band score card -->
      <div class="result-view__card">
        <p class="result-view__card-label">OVERALL BAND SCORE</p>
        <p class="result-view__band-score">Band {{ overallBand }}</p>

        <div v-if="strongAreas.length" class="result-view__area-row">
          <span class="result-view__area-icon result-view__area-icon--strong">✅</span>
          <div>
            <p class="result-view__area-caption">Strong areas</p>
            <p class="result-view__area-text">{{ strongAreas.join(', ') }}</p>
          </div>
        </div>

        <div v-if="needsImprovement.length" class="result-view__area-row">
          <span class="result-view__area-icon result-view__area-icon--weak">😓</span>
          <div>
            <p class="result-view__area-caption">Needs improvement</p>
            <p class="result-view__area-text">{{ needsImprovement.join(', ') }}</p>
          </div>
        </div>
      </div>

      <!-- Section breakdown card -->
      <div class="result-view__card">
        <p class="result-view__card-label">SECTION BREAKDOWN</p>
        <div class="result-view__section-list">
          <div
            v-for="section in sectionScores"
            :key="section.key"
            class="result-view__section-row"
          >
            <div class="result-view__section-icon-wrap" :style="{ backgroundColor: section.bg }">
              <Icon :name="section.icon" size="20px" />
            </div>
            <div class="result-view__section-info">
              <p class="result-view__section-name">{{ section.label }}</p>
              <p class="result-view__section-extra">{{ section.extra }}</p>
            </div>
            <p class="result-view__section-band">{{ section.band }}</p>
          </div>
        </div>
      </div>

      <!-- Performance insights card -->
      <div class="result-view__card">
        <p class="result-view__card-label">PERFORMANCE INSIGHTS</p>
        <p class="result-view__card-subheading">Personalized highlights</p>
        <ul class="result-view__bullet-list">
          <li v-for="(insight, i) in insights" :key="i">{{ insight }}</li>
        </ul>
      </div>

      <!-- Recommendations card -->
      <div class="result-view__card">
        <p class="result-view__card-label">RECOMMENDATIONS</p>
        <p class="result-view__card-subheading">Recommendations</p>
        <ul class="result-view__bullet-list">
          <li v-for="(rec, i) in recommendations" :key="i">{{ rec }}</li>
        </ul>
      </div>

      <!-- Bottom action bar -->
      <div class="result-view__actions">
        <button class="result-view__icon-btn" @click="handleHome">
          <Icon name="home" size="22px" />
        </button>
        <button class="result-view__icon-btn" @click="handleRetake">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.01" />
          </svg>
        </button>
        <button class="result-view__icon-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
        <PrimaryButton inline style="flex: 1" @click="handleReviewAnswers">Review Answers</PrimaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ede8f8;

  &__scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__card {
    background: #ffffff;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &--completion {
      align-items: center;
      text-align: center;
    }
  }

  &__card-label {
    font-size: 11px;
    font-weight: 700;
    color: #9e9e9e;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
  }

  &__card-subheading {
    font-size: 15px;
    font-weight: 700;
    color: #171717;
    margin: 0;
  }

  &__celebrate {
    font-size: 40px;
    line-height: 1;
  }

  &__completion-title {
    font-size: 18px;
    font-weight: 700;
    color: #171717;
    margin: 0;
    line-height: 1.4;
  }

  &__completion-subtitle {
    font-size: 14px;
    color: #5c5c5c;
    margin: 0;
  }

  &__completion-date {
    font-size: 12px;
    color: #9e9e9e;
    margin: 0;
  }

  &__band-score {
    font-size: 36px;
    font-weight: 900;
    color: var(--color-primary, #7c3aed);
    margin: 0;
    line-height: 1.2;
  }

  &__area-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  &__area-icon {
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__area-caption {
    font-size: 11px;
    color: #9e9e9e;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__area-text {
    font-size: 14px;
    font-weight: 600;
    color: #171717;
    margin: 0;
  }

  &__section-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__section-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__section-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__section-info {
    flex: 1;
  }

  &__section-name {
    font-size: 15px;
    font-weight: 600;
    color: #171717;
    margin: 0;
  }

  &__section-extra {
    font-size: 12px;
    color: #9e9e9e;
    margin: 0;
  }

  &__section-band {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-primary, #7c3aed);
    margin: 0;
  }

  &__bullet-list {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    li {
      font-size: 14px;
      color: #3d3d3d;
      line-height: 1.5;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0 calc(16px + env(safe-area-inset-bottom, 0px));
  }

  &__icon-btn {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: #171717;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.7;
    }
  }
}
</style>
