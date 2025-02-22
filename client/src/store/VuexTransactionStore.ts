import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import dayjs from 'dayjs';

export interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  category: string;
  subCategory: string;
  accountName: string;
  balance: number;
  value: number;
}

export interface AnalysisConfig {
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedCategories: string[];
  selectedSubCategories: string[];
  selectedAccounts: string[];
}

export interface State {
  transactions: Transaction[];
  analysisConfig: AnalysisConfig;
}

const store = new Vuex.Store<State>({
  state: {
    transactions: [],
    analysisConfig: {} as AnalysisConfig,
  },
  mutations: {
    //Commit Transaction data to store state
    setTransactions(state: State, transactions: Transaction[]) {
      state.transactions = transactions;
    },

    //Commit analysis configuration to state
    setAnalysisConfig(state: State, analysisConfig: AnalysisConfig) {
      state.analysisConfig = analysisConfig;
    },
  },
  actions: {
    //Demo data API: Retrieve Transaction data from the server
    async getTransactions({state, commit}) {
      if (state.transactions.length > 0) {
        return;
      }
      try {
        //Fetch transactions from server and commit to state
        const response = await axios.get(
          'http://localhost:3000/api/demoTransactions',
        );
        commit('setTransactions', response.data);
      }
      catch (error) {
        //returns an empty list of transactions on failed API call
        console.error('Error fetching transactions:', error);
        commit('setTransactions', []);
      }
    },

    //Store changes to the analysis configuration
    updateAnalysisConfig({ commit }, analysisConfig: AnalysisConfig) {
      commit('setAnalysisConfig', analysisConfig);
    },

    //MySQL API: Retrieve Transaction data from the server
    /*
    async getTransactions({ state, commit }) {
      if (state.transactions.length > 0) {
        return;
      }

      try {
        //Fetch transactions from server and commit to state
        const response = await axios.get(
          'http://localhost:3000/api/transactions',
        );
        commit('setTransactions', response.data);
      }
      catch (error) {
        //returns an empty list of transactions on failed API call
        console.error('Error fetching transactions:', error);
        commit('setTransactions', []);
      }
    },
    */
  },
  getters: {
    //Return the start and end of date range across all transactions
    getTransactionDateRange: (state: State) => {
      const sortedTransactions = state.transactions.sort((a: Transaction, b: Transaction) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      });
      const start = sortedTransactions[0].date;
      const end = sortedTransactions[sortedTransactions.length - 1].date;
      return {
        start: start,
        end: end,
      };
    },

    //Select transactions within a specified date range
    getTransactionsByDate: (state: State) => (start: string, end: string) => {
      return state.transactions.filter((transaction) => {
        const transactionDate = dayjs(transaction.date);
        return transactionDate.isAfter(dayjs(start)) && transactionDate.isBefore(dayjs(end));
      });
    },

    //return the stored analysis configuration
    getAnalysisConfig(state: State) {
      return state.analysisConfig;
    },

    //filter transactions by the parameters in  the stored analysis configuration
    getAnalysisTransactions(state: State, getters) {
      const analysisConfig = state.analysisConfig;
      const allTransactions = getters.getTransactionsByDate(analysisConfig.startDate, analysisConfig.endDate);

      return allTransactions.filter((transaction: Transaction) => {
        const filterCategories = analysisConfig.selectedCategories.length === 0 || analysisConfig.selectedCategories.includes(transaction.category);
        const filterSubCategories = analysisConfig.selectedSubCategories.length === 0 || analysisConfig.selectedSubCategories.includes(transaction.subCategory);
        const filterAccounts = analysisConfig.selectedAccounts.length === 0 || analysisConfig.selectedAccounts.includes(transaction.accountName);
        return filterCategories && filterSubCategories && filterAccounts;
      });
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export default store;
