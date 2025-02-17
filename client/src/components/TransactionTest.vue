<template>
  <div>
    <h1>Transactions</h1>
    <ul>
      <li v-for="transaction in jointTransactions" :key="transaction.id">
        {{ transaction.accountName }} - {{ transaction.value }}
      </li>
    </ul>
    <h1>{{ jointTransactions.length }} Transactions</h1>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const jointTransactions = computed(
      () => store.getters.getJointTransactions
    );

    return {
      jointTransactions,
    };
  },
};
</script>

<style scoped></style>
