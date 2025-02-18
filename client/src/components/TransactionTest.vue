<template>
  <div>
    <el-button type='primary'>Click Me</el-button>
    <h1>Transactions</h1>
    <ul>
      <li v-for='transaction in jointTransactions' :key='transaction.id'>
        {{ transaction.accountName }} - {{ transaction.value }}
      </li>
    </ul>
    <h1>{{ jointTransactions.length }} Transactions</h1>
    <ChartComponentTest />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import ChartComponentTest from './ChartTest.vue';

export default defineComponent({
  name: 'TransactionTest',
  components: {
    ChartComponentTest,
  },
  setup() {
    const store = useStore();
    const jointTransactions = computed(
      () => store.getters.getJointTransactions,
    );

    return {
      jointTransactions,
    };
  },
});
</script>

<style scoped></style>
