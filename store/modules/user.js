import axios from '~plugins/axios';

export default {
  state: {
    nickName: ''
  },
  mutations: {
    setNickName (state, name) {
      state.nickName = name;
    }
  },
  getters: {
    nickName (state) {
      return state.nickName;
    }
  },
  actions: {
    async chkNickName ({state, rootState, commit, dispatch}, inputNickName) {
      let {data} = await axios.get('/api/nickname');
      let chkDuplicate = false;
      data.forEach((nickName) => {
        if (nickName === inputNickName) {
          chkDuplicate = true;
        }
      }, this);
      return chkDuplicate;
    },
    async registNickName ({state, rootState, commit, dispatch}, nickName) {
      let {data} = await axios.post('/api/nickname', {nickName});
      if (data.success) {
        commit('setNickName', data.nickName);
        return true;
      } else {
        return false;
      }
    }
  }
};
