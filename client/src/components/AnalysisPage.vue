<template>
    <div>
        <h1>Test</h1>
        <h2>Analysis</h2>
    </div>
    <PieChart :transactions="analysisTransactions"/>
    <LineChart :transactions="analysisTransactions"/>
  </template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import PieChart from './PieChart.vue';
import LineChart from './LineChart.vue';

export default defineComponent({
  name: 'AnalysisPage',
  components: {
    PieChart,
    LineChart,
  },
  setup() {
    const store = useStore();

    //Access the transaction data from the store
    const analysisTransactions = computed(() => store.getters.getAnalysisTransactions);

    return {
      analysisTransactions,
    };
  },
});
</script>