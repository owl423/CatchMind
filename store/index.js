import Vuex from 'vuex';
import room from './room.js';
import user from './user.js';
const store = () => new Vuex.Store({
  modules: {
    room,
    user
  }
});

export default store;
