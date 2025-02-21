<template>
    <div class="chart-container">
        <Pie :data="chartData" :options="chartOptions"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, toRefs} from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, ChartOptions } from 'chart.js';
import { Transaction } from  '../store/VuexTransactionStore';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale);

export default defineComponent({
  name: 'PieChart',
  components: {
    Pie,
  },
  props: {
    transactions: {
      type: Array as PropType<Transaction[]>,
      required: true,
    },
  },
  setup(props) {
    const { transactions } = toRefs(props);

    const chartOptions: ChartOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(toolTipValue) {
              const value = toolTipValue.raw as number;
              return `£${value.toFixed(2)}`;
            },
          },
        },
        legend: {
          position: 'right',
          align: 'center',
        },
      },
    };

    //Compute the total transaction value for each category
    const categoryTotals = computed(() => {
      const categoryData: Record<string, number> = {};
      transactions.value.forEach((transaction) => {
        const category = transaction.category;
        if (categoryData[category]) {
          categoryData[category] += Number(transaction.value);
        } else {
          categoryData[category] = Number(transaction.value);
        }
      });
      return categoryData;
    });

    const chartData = computed(() => {
      const categories = Object.keys(categoryTotals.value);
      const values = Object.values(categoryTotals.value);

      return {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: ['#142f40', '#7d4e7e', '#696916', '#275265', '#8c922e', '#1f402d', '#3e6551', '#585490', '#865662', '#956b5f'],
          },
        ],
      };
    });

    return {
      chartOptions,
      chartData,
    };
  },
});
</script>

<style lang="scss" scoped>
  .chart-container {
    width: 100%;
    height: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

</style>
