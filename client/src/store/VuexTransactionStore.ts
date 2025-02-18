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

interface State {
  transactions: Transaction[];
}

const store = createStore<State>({
  state: {
    transactions: [],
  },
  mutations: {
    //Commit Transaction data to store state
    setTransactions(state, transactions: Transaction[]) {
      state.transactions = transactions;
    },
  },
  actions: {
    //Retrieve Transaction data from the server
    async getTransactions({ commit }) {
      try {
        //Fetch transactions from server and commit to store
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
  },
});

export default store;
