import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";

const url = 'example.com'

export interface Room {
  roomId: number;
  adults: number;
  children: number;
  childrenAges?: {
    [key: string]: number;
  };
}

export interface removeRoomAction {
  type: ActionTypes.removeRoom;
  payload: number;
}

export interface addRoomAction {
  type: ActionTypes.addRoom;
  payload: Partial<Room>;
}

export interface updateRoomsAction {
  type: ActionTypes.updateRooms;
  payload: Partial<Room>[];
}

export interface searchRoomsAction {
  type: ActionTypes.searchRooms;
  payload: string;
}

export const removeRoom = (id: number): removeRoomAction => ({
  type: ActionTypes.removeRoom,
  payload: id,
});

export const addRoom = (): addRoomAction => ({
  type: ActionTypes.addRoom,
  payload: {
    adults: 0,
    children: 0,
  },
});

export const updateRooms = (newRooms: Partial<Room>[]): updateRoomsAction => ({
  type: ActionTypes.updateRooms,
  payload: newRooms
})

export const searchRooms = (output: string) => {
  return async (dispatch: Dispatch) => {
    const response = await axios.post<string>(url, output)

    dispatch<searchRoomsAction>({
      type: ActionTypes.searchRooms,
      payload: response.data
    })
  }
}