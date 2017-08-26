import answerCheck from './answerCheck';
import clearBoard from './clearBoard';
import disconnect from './disconnect';
import drawing from './drawing';
import entrance from './entrance';
import gameStart from './gameStart';
import sendMsg from './sendMsg';
import passTurn from './passTurn';

const socketEvent = {
  answerCheck,
  clearBoard,
  disconnect,
  drawing,
  entrance,
  gameStart,
  sendMsg,
  passTurn
};
export default socketEvent; 