<template>
  <div class="home-view">
    <UserHeader :points="dashboardData?.points ?? 0" />
    <div class="home-view__content">
      <template v-if="dashboardData">
        <ProgressOverviewCard
          :progress-data="dashboardData.progressData"
          :current-date="dashboardData.currentDate"
          :score-band="dashboardData.scoreBand"
        />
        <div class="home-view__skills-grid">
          <SkillScoreCard
            v-for="skill in dashboardData.skillScores"
            :key="skill.name"
            :name="skill.name"
            :score="skill.score"
            :icon="skill.icon"
            :color="skill.color"
          />
        </div>
      </template>
      <AIFeedbackCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardData } from '@/composables/useDashboardData'
import UserHeader from '@/components/common/UserHeader.vue'
import ProgressOverviewCard from '@/components/home/ProgressOverviewCard.vue'
import SkillScoreCard from '@/components/home/SkillScoreCard.vue'
import AIFeedbackCard from '@/components/home/AIFeedbackCard.vue'

const { dashboardData, fetchDashboardData } = useDashboardData()

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped lang="scss">
.home-view {
  width: 100%;
  min-height: 100%;
  background-image: url('@/assets/images/home-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    padding: 12px 16px;
    padding-bottom: calc(12px + 80px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
}
</style>
