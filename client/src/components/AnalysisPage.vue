<template>
  <main class="analysis-page">
    <section class="analysis-page__overview section-container">
        <h1>Spending Report</h1>
        <hr>
    </section>
    <section class="analysis-page__report">
      <section class="analysis-page__report__config-panel section-container">
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
      <section class="analysis-page__report__pie-panel section-container">
        <h2>
          Total spend by category
        </h2>
        <hr>
        <p>This chart displays your total spending by category over the selected date range.</p>
        <PieChart :transactions="analysisTransactions"/>
      </section>
      <section class="analysis-page__report__line-panel section-container">
        <h2>
          Spend over time
        </h2>
        <hr>
        <div class="analysis-page__report__line-panel__instructions" >
          <p>
            This chart shows the trends in your spending over time, with separate lines for each category.
            Use the dropdown menu to view the data broken down by day, week, or month.
          </p>
        </div>
        <LineChart :transactions="analysisTransactions"/>
      </section>
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

<style lang="scss" scoped>
  .analysis-page {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding-top: 1em;

    &__overview {
      align-items: center;
      max-width: 1400px;
      width: 100%;
      margin: auto;
    }

    &__report {
      display: grid;
      grid-template-columns: 30% 1fr;
      grid-template-rows: auto auto;
      grid-template-areas:
        "config pie"
        "line line";
      gap: 1em;
      max-width: 1400px;
      width: 100%;
      margin: auto;

      &__config-panel {
        grid-area: config;

        ul {
          padding-left: 1em;
        }
        h3 {
          padding-top: 0.5em;
        }
      }

      &__pie-panel {
        grid-area: pie;
      }

      &__line-panel {
        grid-area: line;
      }
    }

    .section-container {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 1em;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
      padding: 2em;
    }
  }
</style>