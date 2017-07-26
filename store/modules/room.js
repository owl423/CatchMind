import axios from '~plugins/axios';

export default {
  state: {
    roomName: '',
    roomList: [],
    roomUserList: [],
    isRoomCreate: null,
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
    },
    isRoomCreate (state) {
      return state.isRoomCreate;
    }
  },
  mutations: {
    setRoomName (state, name) {
      state.roomName = name;
    },
    setRoomList (state, roomList) {
      state.roomList = roomList;
    },
    setRoomUserList (state, roomUserList){
      state.roomUserList = roomUserList;
    },
    setIsRoomCreate(state, bool){
      state.isRoomCreate = bool;
    }
  },
  // 서버와 통신
  actions: {
    // 방 리스트 전체를 가져온다.
    async getRoomList({commit}){
      let {data} = await axios.get('/api/roomList');
      commit('setRoomList', data);
      return data;
    },
    async getRoom({commit}, roomName){
      console.log('`/api/roomList/${roomName}`: ', `/api/roomList/${roomName}`);
      let {data} = await axios.get(`/api/roomList/${roomName}`);
      console.log('get room data: ', data);
    },
    // 방 이름 중복 확인
    async chkRoomName({state, commit, dispatch, rootState}, inputRoomName){
      let {data} = await axios.get(`/api/roomList?roomName=${inputRoomName}`);
      return data;
    },
    // 방 정보 등록
    async registRoomName({state, commit, dispatch, rootState}, roomObj){
      let {data} = await axios.post('/api/roomList', roomObj);
      commit('setIsRoomCreate', data.success);
      return data;
    },
    async registRoomUser({state, commit, dispatch, rootState}, userObj){
      let {data} = await axios.put(`/api/roomList/${state.roomName}`, userObj);
      console.log('data: ', data);
    }
  }
};
