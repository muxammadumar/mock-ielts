<template>
  <div class="home-view">
    <UserHeader :points="dashboardData.points" />
    <div class="home-view__content">
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
  background: linear-gradient(
    180deg,
    rgba(224, 187, 228, 0.3) 0%,
    rgba(243, 236, 248, 0.5) 100%
  );
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    padding: var(--spacing-md);
    padding-bottom: calc(var(--spacing-md) + 80px); // Space for navbar
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
}
</style>
