import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import store from '../../src/store/VuexTransactionStore';

//Define mock axios adapater and data for testing the Transactions Vuex Store
const mockAxios = new axiosMock(axios);
const mockTransactions =  [
  {id: 1, date: '2024-08-05', type: 'DPC', description: 'Vets4Pets', category: 'Pets', subCategory: 'Vet', accountName: 'JOINT', balance: 3000, value: 50 },
  {id: 2, date: '2024-08-06', type: 'D/D', description: 'City Council', category: 'Bill', subCategory: 'CouncilTax', accountName: 'JOINT', balance: 2900, value: 100 },
  {id: 3, date: '2024-08-07', type: 'POS', description: 'Lush Cosmetics', category: 'Shopping', subCategory: 'InStore', accountName: 'JOINT', balance: 2870, value: 30 },
];

describe('Vuex Transactions Store', () => {

  //Reset mock store before each tests to ensure they are independent
  beforeEach(() => {
    mockAxios.reset();
  });

  describe('Mutations', () => {
    //Test that the setTransactions mutation commits mockTransactions to the transactions state
    it('setTransactions correctly updates state', () => {
      store.commit('setTransactions', mockTransactions);
      expect(store.state.transactions).toEqual(mockTransactions);
    });
  });


  describe('Getters', () => {
    //Test that getTransactionDateRange returns the earliest and latest date amongst Transactions
    it('getTransactionDateRange returns correct start and end dates', () => {
      const {start, end} = store.getters.getTransactionDateRange;
      expect(start).toEqual(mockTransactions[0].date);
      expect(end).toEqual(mockTransactions[2].date);
    });
  });

  describe('Actions', () => {
    //Test that a successful API call for getTransactions correctly sets the transactions state
    it('getTransactions correctly sets transactions on successful API call', async () => {
      mockAxios.onGet('http://localhost:3000/api/transactions').reply(200, mockTransactions);
      await store.dispatch('getTransactions');
      expect(store.state.transactions).toEqual(mockTransactions);
    });

    //Test that a failed API call for getTransactions sets an empty array to the transactions state
    it('returns empty transactions on failed API call', async () => {
      mockAxios.onGet('http://localhost:3000/api/transactions').reply(500);
      await store.dispatch('getTransactions');
      expect(store.state.transactions).toEqual([]);
    });
  });
});
