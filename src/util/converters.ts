import { Room } from "../actions";

export const initialState2Rooms = (initial: string): Partial<Room>[] =>
  initial.split("|").map((room, i) => {
    const tmp: Partial<Room> = { roomId: ++i };

    if (room.includes(":")) {
      const [adults, children] = room.split(":");
      tmp.adults = parseInt(adults, 10);

      if (children.includes(",")) {
        const arrayOfChildren = children.split(",");
        tmp.children = arrayOfChildren.length;
        tmp.childrenAges = arrayOfChildren.reduce(
          (prev, age, i) => ({ ...prev, [`${++i}`]: age }),
          {}
        );
      } else if (children.length > 0) {
        tmp.children = 1;
        tmp.childrenAges = { [`1`]: parseInt(children, 10) };
      }
    } else {
      tmp.adults = parseInt(room, 10);
    }

    return tmp;
  });

export const rooms2Output = (rooms: Room[]): string =>
  rooms.reduce((prev, curr, i) => {
    const tmpChildren = curr.childrenAges
      ? Object.values(curr.childrenAges)
      : [];
    const tmp = `${curr.adults}${
      tmpChildren.length > 0 ? `:${tmpChildren.join(",")}` : ""
    }`;
    return !prev ? tmp : `${prev}|${tmp}`;
  }, "");
