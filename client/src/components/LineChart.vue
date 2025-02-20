<template>
    <div>
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
    <div>
        <Line :data="chartData" />
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, ref, toRefs} from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js';
import { Transaction } from  '../store/VuexTransactionStore';
import moment from 'moment';

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
        const dateA = moment(a, dateFormat.value);
        const dateB = moment(b, dateFormat.value);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      });
    });

    //Map grouped transactions to unique date labels, creating the chart datasets for each category
    const datasets = computed(() => {
      return Object.keys(groupedTransactions.value).map((categoryKey: string) => ({
        label: categoryKey,
        data: labels.value.map((dateKey) => groupedTransactions.value[categoryKey][dateKey] || 0),
        borderColor: '#000',
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

    //Function to format date groupings based on the selected date mode
    function formatDateGroup(transaction: Transaction) {
      const date = moment(transaction.date);
      if (dateMode.value === 'week') {
        date.startOf('week').format(dateFormat.value);
      }
      return date.format(dateFormat.value);
    }

    return {
      dateMode,
      dateModes,
      chartData,
    };
  },
});
</script>
