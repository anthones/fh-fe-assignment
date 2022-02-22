import {
  Action,
  ActionTypes,
  removeChildAction,
  Room,
  updateChildrenAgeAction,
} from "../actions";

const INITIAL_STATE = [
  {
    roomId: 1,
    adults: 2,
    children: 0,
  } as Room,
];

const reduceAddAdult = (rooms, roomId) =>
  rooms.map(room =>
    room.roomId === roomId ? { ...room, adults: room.adults + 1 } : room
  );

const reduceRemoveAdult = (rooms, roomId) =>
  rooms.map(room =>
    room.roomId === roomId ? { ...room, adults: room.adults - 1 } : room
  );

const reduceAddChild = (rooms, payload) =>
  rooms.map(room =>
    room.roomId === payload
      ? {
          ...room,
          children: room.children + 1 || 1,
          childrenAges: {
            ...room.childrenAges,
            [room.children + 1 || 1]: undefined,
          },
        }
      : room
  );

const reduceRemoveChild = (rooms, { roomId, childId }) =>
  rooms.map(room => {
    if (room.roomId === roomId) {
      const { [childId]: _, ...childrenAges } = room.childrenAges;
      return {
        ...room,
        children: room.children - 1,
        childrenAges,
      };
    } else {
      return room;
    }
  });

const reduceRemoveAllChildren = (rooms, roomId) =>
  rooms.map(room => {
    if (room.roomId === roomId) {
      const { childrenAges, ...roomWithoutChildrensAges } = room;
      return {
        ...roomWithoutChildrensAges,
        children: 0,
      };
    } else {
      return room;
    }
  });

const reduceChildrenAge = (rooms, { roomId, childId, newAge }) =>
  rooms.map(room =>
    room.roomId === roomId
      ? {
          ...room,
          childrenAges: {
            ...room.childrenAges,
            [childId]: newAge,
          },
        }
      : room
  );

export const roomsReducer = (
  state = INITIAL_STATE,
  { type, payload }: Action
) => {
  switch (type) {
    case ActionTypes.addRoom:
      return [
        ...state,
        { roomId: state.length + 1, ...(payload as Partial<Room>) },
      ];
    case ActionTypes.removeRoom:
      return state.filter(({ roomId }) => roomId !== payload);
    case ActionTypes.addAdult:
      return reduceAddAdult(state, payload);
    case ActionTypes.removeAdult:
      return reduceRemoveAdult(state, payload);
    case ActionTypes.addChild:
      return reduceAddChild(state, payload);
    case ActionTypes.removeChild:
      return reduceRemoveChild(state, payload as removeChildAction["payload"]);
    case ActionTypes.removeAllChildren:
      return reduceRemoveAllChildren(state, payload);
    case ActionTypes.updateChildrenAge:
      return reduceChildrenAge(
        state,
        payload as updateChildrenAgeAction["payload"]
      );
    case ActionTypes.updateRooms:
      return payload;
    case ActionTypes.searchRooms:
    default:
      return state;
  }
};
