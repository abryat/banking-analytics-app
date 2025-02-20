<template>
    <div>
        <Pie :data="chartData" />
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, toRefs} from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale } from 'chart.js';
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
            backgroundColor: ['#2C3E50', '#E74C3C', '#27AE60', '#F39C12', '#8E44AD', '#3498DB', '#16A085', '#D35400', '#9B59B6', '#1ABC9C'], //temp pallette
          },
        ],
      };
    });

    return {
      chartData,
    };
  },
});
</script>
