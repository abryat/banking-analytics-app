import { createStore } from 'vuex';
import axios from 'axios';

export interface Transaction {
  id: number;
  date: Date;
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

interface State {
  transactions: Transaction[];
  analysisConfig: AnalysisConfig;
}

const store = createStore<State>({
  state: {
    transactions: [],
    analysisConfig: {} as AnalysisConfig,
  },
  mutations: {
    //Commit Transaction data to store state
    setTransactions(state, transactions: Transaction[]) {
      state.transactions = transactions;
    },

    //Commit analysis configuration to state
    setAnalysisConfig(state, analysisConfig: AnalysisConfig) {
      state.analysisConfig = analysisConfig;
    },
  },
  actions: {
    //Retrieve Transaction data from the server
    async getTransactions({ commit }) {
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

    //Store changes to the analysis configuration
    updateAnalysisConfig({ commit }, analysisConfig) {
      commit('setAnalysisConfig', analysisConfig);
    },
  },
  getters: {
    //Return the start and end of date range across all transactions
    getTransactionDateRange: (state) => {
      const sortedTxns = state.transactions.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
      const start = sortedTxns[0].date;
      const end = sortedTxns[sortedTxns.length - 1].date;
      return {
        start: start,
        end: end,
      };
    },

    //Select transactions within a specified date range
    getTransactionsByDate: (state) => (start: Date, end: Date) => {
      return state.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= start && transactionDate <= end;
      });
    },

    //return the stored analysis configuration
    getAnalysisConfig(state) {
      return state.analysisConfig;
    },

    //filter transactions by the parameters in  the stored analysis configuration
    getAnalysisTransactions(state, getters) {
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
});

export default store;
