import { createStore } from 'vuex';
import axios from 'axios';

interface Transaction {
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

interface State {
  transactions: Transaction[];
}

const store = createStore<State>({
  state: {
    transactions: [],
  },
  mutations: {
    setTransactions(state, transactions: Transaction[]) {
      state.transactions = transactions;
    },
  },
  actions: {
    async getTransactions({ commit }) {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/transactions',
        );
        commit('setTransactions', response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },
  },
  getters: {
    getJointTransactions: (state) => {
      return state.transactions.filter(
        (transaction) => transaction.accountName === 'JOINT',
      );
    },
  },
});

export default store;
