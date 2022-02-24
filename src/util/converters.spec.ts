import { Room } from "../actions";
import { initialState2Rooms, rooms2Output } from "./converters";

const outputString = "1:4,6|3";
const rooms = [
  {
    roomId: 1,
    adults: 1,
    children: 2,
    childrenAges: {
      1: "4",
      2: "6",
    },
  },
  {
    roomId: 2,
    adults: 3,
  },
];

describe("initialState2Rooms", () => {
  test("should convert output string to StoreState", () => {
    expect(initialState2Rooms(outputString)).toEqual(rooms);
  });
});

describe("rooms2Output", () => {
  test("should convert StoreState to output string", () => {
    expect(rooms2Output(rooms as Room[])).toEqual(outputString);
  });
});
