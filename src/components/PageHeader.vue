<template>
  <div :class="wrapperClass">
    <div :class="containerClass">
      <h2 :class="titleClass">
        <i :class="`${icon} ${iconColor} me-2`"></i>
        {{ title }}
      </h2>
      <p :class="subtitleClass">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    default: 'text-warning',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
  },
});

const wrapperClass = computed(() => (props.variant === 'dashboard'
  ? 'dashboard-header'
  : 'd-flex justify-content-between align-items-center mb-4'));

const containerClass = computed(() => (props.variant === 'dashboard'
  ? 'container-fluid'
  : ''));

const titleClass = computed(() => (props.variant === 'dashboard'
  ? 'dashboard-title'
  : 'h3 mb-1 text-dark fw-bold'));

const subtitleClass = computed(() => (props.variant === 'dashboard'
  ? 'dashboard-subtitle'
  : 'text-muted mb-0'));
</script>

<style scoped>
/* Dashboard 樣式 */
.dashboard-header {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: #718096;
  margin-bottom: 0;
  font-size: 1rem;
}

/* 響應式處理 */
@media (max-width: 768px) {
  .h3 {
    font-size: 1.5rem;
  }

  .text-muted {
    font-size: 0.9rem;
  }

  .dashboard-header {
    padding: 1.5rem 0;
  }

  .dashboard-title {
    font-size: 1.5rem !important;
  }
}
</style>
