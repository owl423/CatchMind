import Vuex from 'vuex';
import room from './modules/room.js';
import user from './modules/user.js';
const store = () => new Vuex.Store({
  modules: {
    room,
    user
  }
});

export default store;
