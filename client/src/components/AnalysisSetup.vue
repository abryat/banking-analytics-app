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
          <ul>
            <li>Start by choosing a date range for the analysis.</li>
            <li>Step 2 will become available once you have selected a valid date range.</li>
          </ul>
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
          <section class="config-page__form-container__form__optional-filters" :class="{'--disabled': !dateRangeValid}">
            <div class="config-page__form-container__form__optional-filters__instructions">
              <h2>Step 2: Select optional filters</h2>
              <hr>
              <ul>
                <li>Choose the categories, sub-categories, and accounts you would like to include in your analysis.</li>
                <li>If you prefer, you can skip the filters - all transactions within your chosen date range will be included by default.</li>
                <li><b>Note: </b>Changing the date range will update the available filter options. Any options that are unavailable for the new date range will be automatically removed.</li>
              </ul>
            </div>
            <el-form-item label="Categories" prop="selectedCategories">
              <el-select
                v-model="formData.selectedCategories"
                multiple
                filterable
                clearable
                collapse-tags
                placeholder="Select Categories"
                :disabled="!dateRangeValid"
              >
                <template #header>
                  <el-checkbox
                    v-model="optionalFilterState.categories.checkAll"
                    :indeterminate="optionalFilterState.categories.indeterminate"
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
                :disabled="!dateRangeValid"
              >
                <template #header>
                  <el-checkbox
                    v-model="optionalFilterState.subCategories.checkAll"
                    :indeterminate="optionalFilterState.subCategories.indeterminate"
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
                :disabled="!dateRangeValid"
              >
                <template #header>
                  <el-checkbox
                    v-model="optionalFilterState.accounts.checkAll"
                    :indeterminate="optionalFilterState.accounts.indeterminate"
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
import { defineComponent, computed, ref, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { Transaction, AnalysisConfig } from '../store/VuexTransactionStore';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { InternalRuleItem } from 'async-validator';

interface CheckAllState {
  checkAll: boolean;
  indeterminate: boolean;
}

interface OptionalFilterState {
  categories: CheckAllState;
  subCategories: CheckAllState;
  accounts: CheckAllState;
}

export default defineComponent({
  name: 'AnalysisSetup',
  setup() {
    const router = useRouter();
    const store = useStore();

    //Initialise form
    const formRef = ref<FormInstance>();

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

    //Store the flags for checkAll/indeterminate of each filter option type in an object
    const optionalFilterState = computed<OptionalFilterState>(() => {
      return {
        categories: setOptionalFilterState(formData.selectedCategories, categories.value),
        subCategories: setOptionalFilterState(formData.selectedSubCategories, subCategories.value),
        accounts: setOptionalFilterState(formData.selectedAccounts, accounts.value),
      };
    });

    //Check if the selected filters exist in the options available for the new date range.
    //Preserve the available selected options and remove the unavailable
    watch((categories), () => {
      formData.selectedCategories = formData.selectedCategories.filter(category => {
        return categories.value.includes(category);
      });
    });

    watch((subCategories), () => {
      formData.selectedSubCategories = formData.selectedSubCategories.filter(subCategory => {
        return subCategories.value.includes(subCategory);
      });
    });

    watch((accounts), () => {
      formData.selectedAccounts = formData.selectedAccounts.filter(account => {
        return accounts.value.includes(account);
      });
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

    //Update selected filters options if 'All' is selected or deselected
    function toggleCheckAllCategories() {
      if (optionalFilterState.value.categories.checkAll) {
        formData.selectedCategories = categories.value;
      } else {
        formData.selectedCategories = [];
      }
    }

    function toggleCheckAllSubCategories() {
      if (optionalFilterState.value.subCategories.checkAll) {
        formData.selectedSubCategories = subCategories.value;
      } else {
        formData.selectedSubCategories = [];
      }
    }

    function toggleCheckAllAccounts() {
      if (optionalFilterState.value.accounts.checkAll) {
        formData.selectedAccounts = accounts.value;
      } else {
        formData.selectedAccounts = [];
      }
    }

    //Set the checkAll and indeterminate flags for the filter option dropdown menu
    function setOptionalFilterState(selected: string[], options: string[]) {
      const checkAll = selected.length > 0 && selected.length === options.length;
      const indeterminate = selected.length > 0 && selected.length < options.length;
      return {checkAll, indeterminate};
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
      optionalFilterState,

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

          &.--disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
          }

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

  ul {
    padding-left: 1em;
    li {
      margin-bottom: 0.2em;
    }
  }
</style>