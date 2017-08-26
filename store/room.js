import axios from '../plugins/axios';

export default {
  state: {
    roomName: '',
    roomList: [],
    roomUserList: [],
    writerNickName: '',
    masterNickName: '',
    isRoomCreate: null,
    socket: null
  },
  getters: {
    roomName: state => state.roomName,
    roomList: state => state.roomList,
    roomUserList: state => state.roomUserList,
    isRoomCreate: state => state.isRoomCreate,
    socket: state => state.socket,
    writerNickName: state => state.writerNickName,
    masterNickName: state => state.masterNickName
  },
  mutations: {
    setRoomName (state, name) {
      state.roomName = name;
    },
    setRoomList (state, roomList) {
      state.roomList = roomList;
    },
    setRoomUserList (state, roomUserList) {
      state.roomUserList = roomUserList;
    },
    setIsRoomCreate (state, bool) {
      state.isRoomCreate = bool;
    },
    setSocket (state, socket) {
      state.socket = socket;
    },
    setWriterNickName (state, writerNickName) {
      state.writerNickName = writerNickName;
    },
    setMasterNickName (state, masterNickName) {
      state.masterNickName = masterNickName;
    }
  },
  // 서버와 통신
  actions: {
    // 방 리스트 전체를 가져온다.
    async getRoomList({commit}){
      let {data} = await axios.get('/api/roomList');
      console.log('data: ', data);
      commit('setRoomList', data);
      return data;
    },
    async getRoom({commit}, roomName){
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
