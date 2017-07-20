import axios from '~plugins/axios';

export default {
  state: {
    roomName: '',
    roomList: [],
    roomUserList: []
  },
  getters: {
    roomName (state) {
      return state.roomName;
    },
    roomList (state) {
      return state.roomList;
    },
    roomUserList (state) {
      return state.roomUserList;
    }
  },
  mutations: {
    setRoomName (state, name) {
      state.roomName = name;
    },
    addRoomList (state, roomName) {
      state.roomList.push(roomName);
    },
    removeRoomList (state, roomName) {
      return state.roomList.indexOf(roomName) > -1 ? state.roomList.splice(state.roomList.indexOf(roomName), 1) : false; // eslint ignore:line
    },
    addRoomUserList (state, userName) {
      state.roomUserList.push(userName);
    },
    removeRoomUserList (state, userName) {
      return state.roomUserList.indexOf(userName) > -1 ? state.roomUserList.splice(state.roomUserList.indexOf(userName), 1) : false; // eslint ignore:line
    }
  },
  actions: {
    async getRoomList(){
      let {data} = await axios.get('/api/roomlist');
      return data;
    },
    chkRoomName({state, commit, dispatch, rootState}, inputRoomName){
      console.log('inputRoomName: ', inputRoomName);
    }
  }
};
