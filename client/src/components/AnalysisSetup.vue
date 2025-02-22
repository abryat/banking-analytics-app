<template>
  <main class="config-page">
    <section class="config-page__overview section-container">
      <h1>Configure Spending Analysis</h1>
      <hr>
      <p>Setup your analysis and click 'Analyse' to view your spending report.</p>
    </section>
    <section class="config-page__form-container section-container">
      <section class="config-page__form-container__form">
        <div class="config-page__form-container__form__date-range__instructions">
          <h2>Step 1: Select a date range</h2>
          <hr>
          <p>Start by choosing a date range for the analysis.</p>
          <p>Once you have selected a valid date range, additional options to filter by category, sub-category, and account will appear.</p>
        </div>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="large" status-icon>
          <el-form-item label="Start Date" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="Pick a start date"
              :disabled-date="disabledDates"
              format="DD/MM/YYYY"
              size="large"
            />
          </el-form-item>
          <el-form-item label="End Date" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="Pick an end date"
              :disabled-date="disabledDates"
              format="DD/MM/YYYY"
              size="large"
            />
          </el-form-item>
          <section v-if="dateRangeValid" class="config-page__form-container__form__optional-filters">
            <div class="config-page__form-container__form__optional-filters__instructions">
              <h2>Step 2: Select optional filters</h2>
              <hr>
              <p>Choose the categories, sub-categories, and accounts you would like to include in your analysis.</p>
              <p>If you prefer, you can skip the filters - all transactions within your chosen date range will be included by default.</p>
            </div>
            <el-form-item label="Categories" prop="selectedCategories">
              <el-select
                v-model="formData.selectedCategories"
                multiple
                filterable
                clearable
                collapse-tags
                placeholder="Select Categories"
              >
                <template #header>
                  <el-checkbox
                    v-model="checkAllCategories"
                    :indeterminate="indeterminateCategories"
                    @change="toggleCheckAllCategories"
                  >
                    All
                  </el-checkbox>
                </template>
                <el-option
                  v-for="(category, index) in categories"
                  :key="index"
                  :value="category"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Sub-categories" prop="selectedSubCategories">
              <el-select
                v-model="formData.selectedSubCategories"
                multiple
                filterable
                clearable
                collapse-tags
                placeholder="Select sub-category"
              >
                <template #header>
                  <el-checkbox
                    v-model="checkAllSubCategories"
                    :indeterminate="indeterminateSubCategories"
                    @change="toggleCheckAllSubCategories"
                  >
                    All
                  </el-checkbox>
                </template>
                <el-option
                  v-for="(subCategory, index) in subCategories"
                  :key="index"
                  :value="subCategory"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="Accounts" prop="selectedAccounts">
              <el-select
                v-model="formData.selectedAccounts"
                multiple
                filterable
                clearable
                collapse-tags
                placeholder="Select Accounts"
              >
                <template #header>
                  <el-checkbox
                    v-model="checkAllAccounts"
                    :indeterminate="indeterminateAccounts"
                    @change="toggleCheckAllAccounts"
                  >
                    All
                  </el-checkbox>
                </template>
                <el-option
                  v-for="(account, index) in accounts"
                  :key="index"
                  :value="account"
                />
              </el-select>
            </el-form-item>
          </section>
      </el-form>
      <div class="config-page__form-container__form__analyse-button">
        <el-button type="primary" :disabled="!dateRangeValid" @click="onAnalyse(formRef)">
          Analyse
        </el-button>
      </div>
    </section>
  </section>
  </main>
</template>

<script lang='ts'>
import { defineComponent, computed, ref, watch, reactive} from 'vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { Transaction, AnalysisConfig } from '../store/VuexTransactionStore';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules, CheckboxValueType } from 'element-plus';
import { ElMessage } from 'element-plus';
import { InternalRuleItem } from 'async-validator';

export default defineComponent({
  name: 'AnalysisSetup',
  setup() {
    const router = useRouter();
    const store = useStore();

    //Initialise form
    const formRef = ref<FormInstance>();

    const checkAllCategories = ref(false);
    const indeterminateCategories = ref(false);
    const checkAllSubCategories = ref(false);
    const indeterminateSubCategories = ref(false);
    const checkAllAccounts = ref(false);
    const indeterminateAccounts = ref(false);

    const formData = reactive<AnalysisConfig>({
      startDate: undefined,
      endDate: undefined,
      selectedCategories: [],
      selectedAccounts: [],
      selectedSubCategories: [],
    });

    //Form validation rules for required date range selectors
    const formRules = reactive<FormRules<AnalysisConfig>>({
      startDate: [
        {required: true, message: 'Please enter a start date', trigger: 'change'},
        {validator: validateDateRange, trigger: 'change'},
      ],
      endDate: [
        {required: true, message: 'Please enter an end date', trigger: 'change'},
        {validator: validateDateRange, trigger: 'change'},
      ],
    });

    //Compute maximum date range from all transactions
    const transactionDateRange = computed(() => store.getters.getTransactionDateRange);

    //Filter transactions based on date range selected
    const selectedTransactions = computed<Transaction[]>(() => {
      if (!formData.startDate || !formData.endDate) {
        return [];
      }
      return store.getters.getTransactionsByDate(formData.startDate, formData.endDate);
    });

    //Use date-filtered transactions to compute optional dropdown items
    const categories = computed(() => {
      return [...new Set(selectedTransactions.value.map((transaction: Transaction) => transaction.category))];
    });

    const subCategories = computed(() => {
      const filteredTransactions = selectedTransactions.value.filter((transaction) => formData.selectedCategories.includes(transaction.category));
      return [...new Set(filteredTransactions.map((transaction: Transaction) => transaction.subCategory))];
    });

    const accounts = computed(() => {
      return [...new Set(selectedTransactions.value.map((transaction: Transaction) => transaction.accountName))];
    });

    //Disable analyse button if date range is invalid
    const dateRangeValid = computed(() => {
      return formData.startDate && formData.endDate && dayjs(formData.startDate).isSameOrBefore(dayjs(formData.endDate), 'day');
    });

    //Handle individual selection and select all functionality in dropdown menus
    watch (formData.selectedCategories, (newSelectedCategories: string[]) => {
      if (newSelectedCategories.length === 0) {
        checkAllCategories.value = false;
        indeterminateCategories.value = false;
      } else if (newSelectedCategories.length === categories.value.length) {
        checkAllCategories.value = true;
        indeterminateCategories.value = false;
      } else {
        indeterminateCategories.value = true;
      }
    });

    watch (formData.selectedSubCategories, (newSelectedSubCategories: string[]) => {
      if (newSelectedSubCategories.length === 0) {
        checkAllSubCategories.value = false;
        indeterminateSubCategories.value = false;
      } else if (newSelectedSubCategories.length === subCategories.value.length) {
        checkAllSubCategories.value = true;
        indeterminateSubCategories.value = false;
      } else {
        indeterminateSubCategories.value = true;
      }
    });

    watch (formData.selectedAccounts, (newSelectedAccounts: string[]) => {
      if (newSelectedAccounts.length === 0) {
        checkAllAccounts.value = false;
        indeterminateAccounts.value = false;
      } else if (newSelectedAccounts.length === accounts.value.length) {
        checkAllAccounts.value = true;
        indeterminateAccounts.value = false;
      } else {
        indeterminateAccounts.value = true;
      }
    });

    //Reset filters if date range is changed
    watch([() => formData.startDate, () => formData.endDate], () => {
      formData.selectedCategories = [];
      formData.selectedSubCategories = [];
      formData.selectedAccounts = [];
      checkAllCategories.value = false;
      checkAllSubCategories.value = false;
      checkAllAccounts.value = false;
      indeterminateCategories.value = false;
      indeterminateSubCategories.value = false;
      indeterminateAccounts.value = false;
    });

    //Disable dates in the date range selector if they are outside the maximum transaction date range
    function disabledDates(date: string) {
      const calendarDate = dayjs(date).startOf('day');
      const startDate = dayjs(transactionDateRange.value.start).startOf('day');
      const endDate = dayjs(transactionDateRange.value.end).startOf('day');
      return calendarDate.isBefore(startDate) || calendarDate.isAfter(endDate);
    }

    //Validator to check that start date is before end date
    function validateDateRange(rule: InternalRuleItem, inputDate: Date, callback: (error?: string | Error) => void) {
      const isStartDate = rule.field === 'startDate';
      const start = isStartDate ? inputDate : formData.startDate;
      const end = isStartDate ? formData.endDate : inputDate;

      if (formData.startDate && formData.endDate) {
        if (dayjs(start).isSameOrBefore(dayjs(end), 'day')) {
          formRef.value?.clearValidate(isStartDate ? 'endDate' : 'startDate');
          callback();
        } else {
          callback(new Error('Start date must be before end date'));
        }
      }
      else {
        callback();
      }
    }

    //Update filters if 'All' is selected or deselected
    function toggleCheckAllCategories(isChecked: CheckboxValueType) {
      indeterminateCategories.value = false;
      if (isChecked) {
        formData.selectedCategories = categories.value;
      } else {
        formData.selectedCategories = [];
      }
    }

    function toggleCheckAllSubCategories(isChecked: CheckboxValueType) {
      indeterminateSubCategories.value = false;
      if (isChecked) {
        formData.selectedSubCategories = subCategories.value;
      } else {
        formData.selectedSubCategories = [];
      }
    }

    function toggleCheckAllAccounts(isChecked: CheckboxValueType) {
      indeterminateAccounts.value = false;
      if (isChecked) {
        formData.selectedAccounts = accounts.value;
      } else {
        formData.selectedAccounts = [];
      }
    }

    //On form validation/submission, commit the analysis config and route to the analysis page
    function onAnalyse(form: FormInstance | undefined) {
      if (!form) return;
      form.validate((valid) => {
        if (valid) {
          store.dispatch('updateAnalysisConfig', formData); //commit analysis config to store
          ElMessage({
            message: 'Analysis configuration saved. Generating Analysis...',
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            router.push('/analysis'); //route to analysis page
          }, 2000);
        } else {
          ElMessage.error('Please resolve the displayed errors and try again.');
        }
      });
    }

    return {
      formRef,
      formData,
      formRules,
      checkAllCategories,
      checkAllSubCategories,
      checkAllAccounts,
      indeterminateCategories,
      indeterminateSubCategories,
      indeterminateAccounts,

      transactionDateRange,
      selectedTransactions,
      categories,
      subCategories,
      accounts,
      dateRangeValid,

      disabledDates,
      toggleCheckAllCategories,
      toggleCheckAllSubCategories,
      toggleCheckAllAccounts,
      onAnalyse,
    };
  },
});
</script>

<style lang="scss" scoped>

.config-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 1em;
    padding: 1em;

    .section-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      max-width: 1200px;
      max-height: 800px;
      background-color: #ffffff;
      border-radius: 1em;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
      padding: 2em;
    }

    &__form-container {
      gap: 2em;

      &__form {

        &__date-range__instructions {
          margin-bottom: 1em;
        }

        &__optional-filters {
          margin-top: 2rem;

          &__instructions {
            margin-bottom: 1em;
          }
        }

        &__analyse-button {
          text-align: right;
        }

      }
    }
  }
</style>