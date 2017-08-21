import axios from '../plugins/axios';

export default {
  state: {
    nickName: ''
  },
  getters: {
    nickName (state) {
      return state.nickName;
    }
  },
  mutations: {
    setNickName (state, name) {
      state.nickName = name;
    }
  },
  actions: {
    async getNickName (){
      let { data } = await axios.get('/api/user_list');
      return data;
    },
    async chkNickName ({state, rootState, commit, dispatch}, inputNickName) {
      let { data } = await axios.get(`/api/user_list?nickName=${inputNickName}`);
      return data;
    },
    async registNickName ({state, rootState, commit, dispatch}, nickName) {
      let {data} = await axios.post('/api/user_list', {nickName});
      if (data.success) {
        commit('setNickName', data.nickName);
        return true;
      } else {
        return false;
      }
    }
  }
};
