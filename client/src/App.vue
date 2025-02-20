<template>
   <router-view></router-view>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'App',
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
