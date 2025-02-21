<template>
  <main class="home-page">
    <section class="home-page__welcome">
      <h1>Spending Analysis</h1>
      <h2>Keep track of your spending</h2>
      <hr>
      <h3>Build customised reports to better understand your spending habits and trends over time</h3>
      <div class="home-page__welcome__button-container">
        <router-link to="/setup">
        <el-button type="primary" size="large">
          Get started
        </el-button>
      </router-link>
      </div>
    </section>
  </main>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HomePage',
  setup() {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.home-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 1em;

    &__welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      border-radius: 1em;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
      padding: 2em;
      text-align: center;
      gap: 1rem;
    }
  }
</style>