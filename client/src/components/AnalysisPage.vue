<template>
  <main class="analysis-page">
    <section>
        <h1>Spending Report</h1>
        <hr>
        <p></p>
    </section>
    <section>
      <h2>Configuration</h2>
      <hr>
      <h3>Date Range:</h3>
      <p>{{ startDate }} - {{ endDate }}</p>
      <h3>Categories:</h3>
      <ul>
        <li v-for="category in categories" :key="category">{{ category }}</li>
      </ul>
      <h3>Sub-Categories:</h3>
      <ul>
        <li v-for="subCategory in subCategories" :key="subCategory">{{ subCategory }}</li>
      </ul>
      <h3>Accounts:</h3>
      <ul>
        <li v-for="account in accounts" :key="account">{{ account }}</li>
      </ul>
    </section>
    <section>
      <h2>
        Total spend by category
      </h2>
      <p>This chart displays your total spending by category over the selected date range.</p>
      <PieChart :transactions="analysisTransactions"/>
    </section>
    <section>
      <h2>
        Spend over time
      </h2>
      <p>This chart shows the trends in your spending over time, with separate lines for each category.</p>
      <p>Use the dropdown menu to view the data broken down by day, week, or month.</p>
      <LineChart :transactions="analysisTransactions"/>
    </section>
  </main>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import PieChart from './PieChart.vue';
import LineChart from './LineChart.vue';
import { AnalysisConfig, Transaction } from '@/store/VuexTransactionStore';
import moment from 'moment';

export default defineComponent({
  name: 'AnalysisPage',
  components: {
    PieChart,
    LineChart,
  },
  setup() {
    const store = useStore();

    //Access the transaction data and config from the store
    const analysisTransactions = computed<Transaction[]>(() => store.getters.getAnalysisTransactions);
    const analysisConfig = computed<AnalysisConfig>(() => store.getters.getAnalysisConfig);

    const startDate = moment(analysisConfig.value.startDate).format('DD/MM/YYYY');
    const endDate = moment(analysisConfig.value.endDate).format('DD/MM/YYYY');
    const categories = analysisConfig.value.selectedCategories.length > 0 ? analysisConfig.value.selectedCategories : ['All'];
    const subCategories = analysisConfig.value.selectedCategories.length > 0 ? analysisConfig.value.selectedSubCategories : ['All'];
    const accounts = analysisConfig.value.selectedAccounts.length > 0 ? analysisConfig.value.selectedAccounts : ['All'];

    return {
      analysisTransactions,
      analysisConfig,
      startDate,
      endDate,
      categories,
      subCategories,
      accounts,
    };
  },
});
</script>