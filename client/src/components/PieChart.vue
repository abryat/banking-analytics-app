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

    //Set chart configuration
    const chartOptions: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: true,
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
            backgroundColor: ['#0971B9', '#D57DD2', '#B4A017', '#2AB0C1', '#B6D85A', '#1E8037', '#56A679', '#5A82E0', '#F5598C', '#FF8C5E'],
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
    margin: 0;
    position: relative;
    height: 50vh;
    width: 50vh;
    align-self: center;
  }
</style>
