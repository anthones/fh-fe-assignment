import { ActionTypes } from "./types";

export interface addAdultAction {
  type: ActionTypes.addAdult;
  payload: number;
}

export interface removeAdultAction {
  type: ActionTypes.removeAdult;
  payload: number;
}

export const addAdult = (roomId: number): addAdultAction => ({
  type: ActionTypes.addAdult,
  payload: roomId,
});

export const removeAdult = (roomId: number): removeAdultAction => {
  console.log('huh')
  return {
    type: ActionTypes.removeAdult,
    payload: roomId,
  }
};
