import React from "react";
import { connect } from "react-redux";
import {
  Room,
  addRoom,
  addAdult,
  addChild,
  removeRoom,
  updateRooms,
  searchRooms,
  removeAdult,
  removeChild,
  updateChildrenAge,
  removeAllChildren,
} from "../../actions";
import { StoreState } from "../../reducers";
import {
  MAX_ADULTS_PER_ROOM,
  MAX_CHILDREN_PER_ROOM,
  MAX_ROOM_NUMBER,
  MAX_ROOM_OCCUPANCY,
  MIN_ADULTS_PER_ROOM,
} from "../../util/constants";
import { initialState2Rooms, rooms2Output } from "../../util/converters";
// import "./WhoIsStaying.scss";

interface WhoIsStayingStateProps {
  rooms?: Room[];
}

interface WhoIsStayingOwnProps {
  initialRooms?: string;
}

interface WhoIsStayingDispatchProps {
  addRoom: typeof addRoom;
  addAdult: typeof addAdult;
  addChild: typeof addChild;
  removeRoom: typeof removeRoom;
  removeAdult: typeof removeAdult;
  updateRooms: typeof updateRooms;
  removeChild: typeof removeChild
  searchRooms: (output: string) => void;
  removeAllChildren: typeof removeAllChildren;
  updateChildrenAge: typeof updateChildrenAge;
}

interface WhoIsStayingState {
  maxAdultsError: boolean;
  minAdultsError: boolean;
  maxRoomError: boolean;
  maxRoomOccupancyError: boolean;
  maxChildrenError: boolean;
}

type WhoIsStayingProps = WhoIsStayingStateProps &
  WhoIsStayingOwnProps &
  WhoIsStayingDispatchProps;

class _WhoIsStaying extends React.PureComponent<
  WhoIsStayingProps,
  WhoIsStayingState
> {
  constructor(props: WhoIsStayingProps) {
    super(props);
    this.state = {
      maxAdultsError: false,
      minAdultsError: false,
      maxRoomError: false,
      maxRoomOccupancyError: false,
      maxChildrenError: false,
    };
  }

  componentDidMount() {
    if (this.props.initialRooms) {
      this.props.updateRooms(initialState2Rooms(this.props.initialRooms));
    }
  }
  componentDidUpdate(prevProps: WhoIsStayingProps) {
    if (this.props.initialRooms !== prevProps.initialRooms) {
      this.props.updateRooms(initialState2Rooms(this.props.initialRooms));
    }
  }

  private renderAdults = (roomId: number, adults: number, children: number) => (
    <div>
      <span>Adults</span>
      <button
        disabled={adults === MIN_ADULTS_PER_ROOM || this.state.minAdultsError}
        onClick={() => {
          this.state.maxAdultsError && this.setState({ maxAdultsError: false });
          this.state.maxRoomOccupancyError && this.setState({maxRoomOccupancyError: false})
          this.removeAdult(roomId, adults);
        }}
      >
        -
      </button>
      <span>{adults}</span>
      <button
        disabled={(adults === MAX_ADULTS_PER_ROOM || adults + children === MAX_ROOM_OCCUPANCY) || this.state.maxAdultsError || this.state.maxRoomOccupancyError}
        onClick={() => {
          this.addAdult(roomId, adults, children);
        }}
      >
        +
      </button>
    </div>
  );

  private renderChildren = (
    roomId: number,
    adults: number,
    children: number,
    childrenAges: Room["childrenAges"]
  ) => (
    <div>
      <span>Children</span>
      <button
        onClick={() => {
          this.props.removeAllChildren(roomId);
        }}
      >
        -
      </button>
      <span>{children || 0}</span>
      <button
        disabled={(adults === MAX_ADULTS_PER_ROOM || adults + children === MAX_ROOM_OCCUPANCY) ||
          this.state.maxChildrenError || this.state.maxRoomOccupancyError
        }
        onClick={() => {
          this.addChild(roomId, adults, children);
        }}
      >
        +
      </button>
      {this.childrenMapper(roomId, children, childrenAges)}
    </div>
  );

  private childrenMapper = (
    roomId: number,
    children: number,
    childrenAges: Room["childrenAges"]
  ) => {
    return (
      children > 0 &&
      Object.entries(childrenAges).map(child => {
        const [childId, childAge] = child;
        return (
          <div key={childId}>
            <span>{`Child ${childId} age`}</span>
            <select
              name="Age"
              onChange={event =>
                this.props.updateChildrenAge(
                  roomId,
                  childId,
                  parseInt(event.target.value, 10)
                )
              }
              value={childAge}
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <option key={i} value={`${++i}`}>
                    {i++}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                this.props.removeChild(roomId, childId);
              }}
            >
              X
            </button>
          </div>
        );
      })
    );
  };

  private addRoom = () => {
    if (this.props.rooms.length >= MAX_ROOM_NUMBER) {
      return this.setState({ maxRoomError: true });
    } else {
      this.setState({ maxRoomError: false });
    }
    this.props.addRoom();
  };

  private addAdult = (roomId: number, adults: number, children: number) => {
    const { maxAdultsError, maxRoomOccupancyError } = this.state;

    this.setState({minAdultsError: false});

    if (adults === MAX_ADULTS_PER_ROOM) {
      this.setState({ maxAdultsError: true });
      return;
    } else if (maxAdultsError && adults <= MAX_ADULTS_PER_ROOM) {
      this.setState({ maxAdultsError: false });
    }

    if (adults + children === MAX_ROOM_OCCUPANCY) {
      this.setState({ maxRoomOccupancyError: true });
      return;
    } else if (maxRoomOccupancyError && adults + children <= MAX_ROOM_OCCUPANCY) {
      this.setState({ maxRoomOccupancyError: false });
    }

    this.props.addAdult(roomId);
  };

  private removeAdult = (roomId: number, adults: number) => {
    const {minAdultsError} = this.state;

    if (adults === MIN_ADULTS_PER_ROOM) {
      this.setState({ minAdultsError: true });
      return;
    } else if (minAdultsError && adults <= MIN_ADULTS_PER_ROOM) {
      this.setState({ minAdultsError: false });
    }

    this.props.removeAdult(roomId);
  };

  private addChild = (roomId: number, adults: number, children: number) => {
    const { maxChildrenError, maxRoomOccupancyError } = this.state;

    if (children === MAX_CHILDREN_PER_ROOM) {
      this.setState({ maxChildrenError: true });
    } else if (maxChildrenError) {
      this.setState({ maxChildrenError: false });
    }

    if (adults + children === MAX_ROOM_OCCUPANCY) {
      this.setState({ maxRoomOccupancyError: true });
    } else if (maxRoomOccupancyError) {
      this.setState({ maxRoomOccupancyError: false });
    }

    this.props.addChild(roomId);
  };

  private roomMapper = () =>
    this.props.rooms.map(
      ({ roomId, adults, children, childrenAges }, index, arr) => (
        <div key={roomId}>
          <h4>{`Room ${roomId}`}</h4>
          <button
            onClick={() => {
              this.props.removeRoom(roomId);
            }}
          >
            X
          </button>
          {this.renderAdults(roomId, adults, children)}
          {this.renderChildren(roomId, adults, children, childrenAges)}
          {++index === arr.length && (
            <button
              disabled={this.props.rooms.length === MAX_ROOM_NUMBER || this.state.maxRoomError}
              onClick={() => {
                this.addRoom();
              }}
            >
              Add Room
            </button>
          )}
        </div>
      )
    );

  render(): JSX.Element {
    return (
      <>
        <h1>Who Is Staying</h1>
        <button
          onClick={() => {
            this.props.updateRooms(initialState2Rooms(this.props.initialRooms));
          }}
        >
          X
        </button>
        {this.roomMapper()}
        {!this.props.rooms.length && (
          <button
            disabled={this.props.rooms.length === MAX_ROOM_NUMBER || this.state.maxRoomError}
            onClick={this.props.addRoom}
          >
            Add Room
          </button>
        )}
        <button
          disabled={Object.values(this.state).some(error => !!error)}
          onClick={() => {
            this.props.searchRooms(rooms2Output(this.props.rooms));
          }}
        >
          Search
        </button>
      </>
    );
  }
}

function mapStateToProps({ rooms }: StoreState) {
  return { rooms };
}

const mapDispatchToProps = {
  addRoom,
  addAdult,
  addChild,
  removeRoom,
  updateRooms,
  searchRooms,
  removeAdult,
  removeChild,
  removeAllChildren,
  updateChildrenAge,
};

export const WhoIsStaying = connect(
  mapStateToProps,
  mapDispatchToProps
)(_WhoIsStaying);
