<template>
    <div class="select-date-mode">
      View breakdown by:
      <el-select
        v-model="dateMode"
        placeholder="Select date mode"
      >
        <el-option
            v-for="option in dateModes"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
      </el-select>
    </div>
    <div class="chart-container">
        <Line :data="chartData" :options="chartOptions"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, ref, toRefs} from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartOptions} from 'chart.js';
import { Transaction } from  '../store/VuexTransactionStore';
import dayjs from 'dayjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

interface Option {
  label: string,
  value: string,
}

interface GroupedTransactions {
  [categoryKey: string]: {
    [dateKey: string]: number;
  }
}

export default defineComponent({
  name: 'LineChart',
  components: {
    Line,
  },
  props: {
    transactions: {
      type: Array as PropType<Transaction[]>,
      required: true,
    },
  },
  setup(props) {
    const { transactions } = toRefs(props);

    //Initialise options to select date mode
    const dateMode = ref('day');

    const dateModes: Option[] = [
      {
        label: 'Day',
        value: 'day',
      },
      {
        label: 'Week',
        value: 'week',
      },
      {
        label: 'Month',
        value: 'month',
      },
    ];

    const dateFormat = computed(() =>
      dateMode.value === 'month' ? 'MMM-YYYY' : 'DD/MM/YYYY',
    );

    //Group transactions by category and date, based on selected date mode
    const groupedTransactions = computed(() => {
      const groupedData: GroupedTransactions = {};

      transactions.value.forEach((transaction) => {
        const dateKey = formatDateGroup(transaction);
        const categoryKey = transaction.category;
        const value = transaction.value;

        if (!groupedData[categoryKey]) {
          groupedData[categoryKey] = {};
        }

        if (!groupedData[categoryKey][dateKey]) {
          groupedData[categoryKey][dateKey] = 0;
        }

        groupedData[categoryKey][dateKey] += Number(value);

      });
      return groupedData;
    });

    //Compute and sort the list of unique dates in the selected date mode format
    const labels = computed(() => {
      const uniqueDates = [
        ...new Set(transactions.value.map((transaction: Transaction) => formatDateGroup(transaction))),
      ];

      return uniqueDates.sort((a, b) => {
        const dateA = dayjs(a, dateFormat.value);
        const dateB = dayjs(b, dateFormat.value);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      });
    });

    //Map grouped transactions to unique date labels, creating the chart datasets for each category
    const datasets = computed(() => {
      return Object.keys(groupedTransactions.value).map((categoryKey: string, index: number) => ({
        label: categoryKey,
        data: labels.value.map((dateKey) => groupedTransactions.value[categoryKey][dateKey] || 0),
        borderColor: getLineColour(index),
        fill: false,
        tension: 0.1,
      }));
    });

    const chartData = computed(() => {
      return {
        labels: labels.value,
        datasets: datasets.value,
      };
    });

    //Set chart configuration
    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return '£' + Number(value).toFixed(2);
            },
          },
        },
      },
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
          labels: {
            usePointStyle: false,
            boxWidth: 40,
            boxHeight: 1,
          },
        },
      },
    };

    //Function to format date groupings based on the selected date mode
    function formatDateGroup(transaction: Transaction) {
      const date = dayjs(transaction.date);
      if (dateMode.value === 'week') {
        return date.startOf('week').format(dateFormat.value);
      }
      return date.format(dateFormat.value);
    }

    //Cycle through colour pallette to get category's line colour
    function getLineColour(index: number) {
      const colourPallette = ['#0971B9', '#D57DD2', '#B4A017', '#2AB0C1', '#B6D85A', '#1E8037', '#56A679', '#5A82E0', '#F5598C', '#FF8C5E'];
      return colourPallette[index % colourPallette.length];
    }

    return {
      dateMode,
      dateModes,
      chartData,
      chartOptions,
    };
  },
});
</script>

<style scoped>
  .select-date-mode {
    padding: 1em 0;
  }
  .chart-container {
    margin: 0;
    position: relative;
    height: 80vh;
    width: 80vw;
    max-width: 1340px;
  }
</style>