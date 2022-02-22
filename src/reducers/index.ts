import { combineReducers } from "redux";
import { roomsReducer } from "./rooms";
import { Room } from "../actions";

export interface StoreState {
  rooms: Room[],
}

export const reducers = combineReducers<StoreState>({
  rooms: roomsReducer,
} as any);
