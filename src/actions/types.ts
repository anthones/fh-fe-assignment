import { addRoomAction, removeRoomAction, searchRoomsAction, updateRoomsAction } from "./rooms";
import { addAdultAction, removeAdultAction } from "./adults";
import {
  addChildAction,
  removeAllChildrenAction,
  removeChildAction,
  updateChildrenAgeAction,
} from "./children";

export enum ActionTypes {
  addRoom,
  addAdult,
  addChild,
  removeRoom,
  removeAdult,
  removeChild,
  updateRooms,
  searchRooms,
  removeAllChildren,
  updateChildrenAge,
}

export type Action =
  | addRoomAction
  | addAdultAction
  | addChildAction
  | removeRoomAction
  | removeAdultAction
  | removeChildAction
  | updateRoomsAction
  | searchRoomsAction
  | removeAllChildrenAction
  | updateChildrenAgeAction;
