<template>
  <HomePage v-if="transactionsLoaded"/>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref} from 'vue';
import { useStore } from 'vuex';
import HomePage from './components/HomePage.vue';

export default defineComponent({
  name: 'App',
  components: {
    HomePage,
  },
  setup() {
    const store = useStore();
    const transactionsLoaded = ref(false);

    onMounted(async() => {
      await store.dispatch('getTransactions');
      transactionsLoaded.value = true;
    });

    return {
      transactionsLoaded,
    };
  },
});
</script>

<style lang='scss'></style>
