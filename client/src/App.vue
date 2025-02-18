<template>
  <TransactionTest />
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import TransactionTest from './components/TransactionTest.vue';

export default defineComponent({
  name: 'App',
  components: {
    TransactionTest,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch('getTransactions');
    });
  },
});
</script>

<style lang='scss'></style>
