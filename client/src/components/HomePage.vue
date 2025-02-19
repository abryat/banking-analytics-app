<template>
  <div>
      <h1>Banking Analytics</h1>
      <h2>Select a date range to get started</h2>
  </div>
  <div>
      <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="Pick a start date"
          :disabled-date="disabledDates"
          size="large"
        />
        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="Pick a start date"
          :disabled-date="disabledDates"
          size="large"
        />
  </div>
  <el-button type="primary" :disabled="analyseDisabled" @click="onAnalyse">
    Analyse
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    fullscreen
  >
    <AnalysisPage />
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, computed, ref} from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import AnalysisPage from './AnalysisPage.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    AnalysisPage,
  },
  setup() {
    const store = useStore();
    const transactionDateRange = computed(() => store.getters.getTransactionDateRange);

    const disabledDates = (date: Date) => {
      const calendarDate = moment(date).startOf('day');
      const startDate = moment(transactionDateRange.value.start).startOf('day');
      const endDate = moment(transactionDateRange.value.end).startOf('day');
      return !calendarDate.isBetween(startDate, endDate);
    };

    const startDate = ref(undefined);
    const endDate = ref(undefined);

    const analyseDisabled = computed(() => !startDate.value || !endDate.value);
    const dialogVisible = ref(false);

    const onAnalyse = () => {
      dialogVisible.value = true;
    };

    return {
      transactionDateRange,
      startDate,
      endDate,
      disabledDates,
      onAnalyse,
      analyseDisabled,
      dialogVisible,
    };
  },
});
</script>