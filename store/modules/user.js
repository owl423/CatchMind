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
    getNickName (){
      return new Promise(function(resolve, reject){
        axios.get('/api/user_list')
        .then(function(data){
          resolve(data);
        })
        .catch(function(){
          reject('getNickNameError');
        });
      });
    },
    chkNickName ({state, rootState, commit, dispatch}, inputNickName) {
      dispatch('getNickName')
      .then(function(data){
        console.log('data: ', data);
      })
      .catch(function(error){
        console.log('error: ', error);
      });
      
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
