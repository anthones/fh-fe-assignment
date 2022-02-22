import { ActionTypes } from "./types";

export interface addChildAction {
  type: ActionTypes.addChild;
  payload: number;
}

export interface removeChildAction {
  type: ActionTypes.removeChild;
  payload: { roomId: number; childId: string };
}

export interface removeAllChildrenAction {
  type: ActionTypes.removeAllChildren;
  payload: number ;
}

export interface updateChildrenAgeAction {
  type: ActionTypes.updateChildrenAge;
  payload: { roomId: number; childId: string; newAge: number };
}

export const addChild = (roomId: number): addChildAction => ({
  type: ActionTypes.addChild,
  payload: roomId,
});

export const removeChild = (roomId: number, childId?: string): removeChildAction => ({
  type: ActionTypes.removeChild,
  payload: {roomId, childId},
});

export const removeAllChildren = (roomId: number): removeAllChildrenAction => ({
  type: ActionTypes.removeAllChildren,
  payload: roomId,
});

export const updateChildrenAge = (
  roomId: number,
  childId: string,
  newAge: number
): updateChildrenAgeAction => ({
  type: ActionTypes.updateChildrenAge,
  payload: { roomId, childId, newAge },
});
