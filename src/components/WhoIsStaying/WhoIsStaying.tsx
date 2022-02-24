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
import {
  MAX_ROOM_NUMBER,
  MAX_CHILDREN_AGE,
  MAX_ROOM_OCCUPANCY,
  MAX_ADULTS_PER_ROOM,
  MIN_ADULTS_PER_ROOM,
  MAX_CHILDREN_PER_ROOM,
} from "../../util/constants";
import { StoreState } from "../../reducers";
import { initialState2Rooms, rooms2Output } from "../../util/converters";
import "./WhoIsStaying.css";

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
  removeChild: typeof removeChild;
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
    <div className="adults">
      <span className="adults-title">Adults</span>
      <div className="adults-counter">
        <button
          className="operation-button"
          disabled={adults === MIN_ADULTS_PER_ROOM || this.state.minAdultsError}
          onClick={() => {
            this.state.maxAdultsError &&
              this.setState({ maxAdultsError: false });
            this.state.maxRoomOccupancyError &&
              this.setState({ maxRoomOccupancyError: false });
            this.removeAdult(roomId, adults);
          }}
        >
          -
        </button>
        <span className="adults-input">{adults}</span>
        <button
          className="operation-button"
          disabled={
            adults === MAX_ADULTS_PER_ROOM ||
            adults + children === MAX_ROOM_OCCUPANCY ||
            this.state.maxAdultsError ||
            this.state.maxRoomOccupancyError
          }
          onClick={() => {
            this.addAdult(roomId, adults, children);
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  private renderChildren = (
    roomId: number,
    adults: number,
    children: number,
    childrenAges: Room["childrenAges"]
  ) => (
    <div className="children">
      <span className="children-title">Children</span>
      <div className="children-counter">
        <button
          className="operation-button"
          onClick={() => {
            this.props.removeAllChildren(roomId);
          }}
        >
          -
        </button>
        <span className="children-input ">{children || 0}</span>
        <button
          className="operation-button"
          disabled={
            adults === MAX_ADULTS_PER_ROOM ||
            adults + children === MAX_ROOM_OCCUPANCY ||
            this.state.maxChildrenError ||
            this.state.maxRoomOccupancyError
          }
          onClick={() => {
            this.addChild(roomId, adults, children);
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  private childrenMapper = (
    roomId: number,
    childrenAges: Room["childrenAges"]
  ) => (
    <div className="individual-children">
      <div className="individual-children-inner">
        {Object.entries(childrenAges).map(child => {
          const [childId, childAge] = child;
          return (
            <div key={childId} className="individual-child">
              <label className="individual-child-wrapper">
                <div className="child-title">{`Child ${childId} age`}</div>
                <div className="child-select">
                  <div className="select-wrapper">
                    <select
                      className="select-child-age"
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
                      {Array(MAX_CHILDREN_AGE)
                        .fill(0)
                        .map((_, i) => (
                          <option key={i} value={`${++i}`}>
                            {i++}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    className="remove-child-button"
                    onClick={() => {
                      this.props.removeChild(roomId, childId);
                    }}
                  >
                    X
                  </button>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

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

    this.setState({ minAdultsError: false });

    if (adults === MAX_ADULTS_PER_ROOM) {
      this.setState({ maxAdultsError: true });
      return;
    } else if (maxAdultsError && adults <= MAX_ADULTS_PER_ROOM) {
      this.setState({ maxAdultsError: false });
    }

    if (adults + children === MAX_ROOM_OCCUPANCY) {
      this.setState({ maxRoomOccupancyError: true });
      return;
    } else if (
      maxRoomOccupancyError &&
      adults + children <= MAX_ROOM_OCCUPANCY
    ) {
      this.setState({ maxRoomOccupancyError: false });
    }

    this.props.addAdult(roomId);
  };

  private removeAdult = (roomId: number, adults: number) => {
    const { minAdultsError } = this.state;

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
        <div className="room" key={roomId}>
          <div className="room-header">
            <h4 className="room-title">{`Room ${roomId}`}</h4>
            {roomId > 1 && (
              <span
                className="remove-room-button"
                onClick={() => {
                  this.props.removeRoom(roomId);
                }}
              >
                Remove Room
              </span>
            )}
          </div>
          {this.renderAdults(roomId, adults, children)}
          {this.renderChildren(roomId, adults, children, childrenAges)}
          {children > 0 && this.childrenMapper(roomId, childrenAges)}
          {++index === arr.length && (
            <button
              className="add-room-button"
              disabled={
                this.props.rooms.length === MAX_ROOM_NUMBER ||
                this.state.maxRoomError
              }
              onClick={() => {
                this.addRoom();
              }}
            >
              + Add Room
            </button>
          )}
        </div>
      )
    );

  render(): JSX.Element {
    const { rooms, initialRooms, updateRooms, searchRooms, addRoom } =
      this.props;

    return (
      <div
        className="modal"
        style={{
          ...(window.innerWidth < 620 && { height: window.innerHeight }),
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <span className="title">Who Is Staying</span>
            <span
              className="reset"
              onClick={() => {
                updateRooms(initialState2Rooms(initialRooms));
              }}
            >
              X
            </span>
          </div>
          <div className="modal-main">
            <div className="modal-main-inner">
              {this.roomMapper()}
              {!rooms.length && (
                <div className="add-room-wrap">
                  <button
                    className="add-room-button"
                    disabled={
                      rooms.length === MAX_ROOM_NUMBER ||
                      this.state.maxRoomError
                    }
                    onClick={addRoom}
                  >
                    + Add Room
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="modal-cta">
            <button
              className="cta-button"
              disabled={Object.values(this.state).some(error => !!error)}
              onClick={() => {
                searchRooms(rooms2Output(rooms));
              }}
            >
              {`${String.fromCodePoint(0x1f50d)} Search ${
                rooms.length
              } rooms ${String.fromCodePoint(0x2022)} ${rooms.reduce(
                (prev, { adults, children = 0 }) =>
                  adults + children + (prev || 0),
                0
              )} guests`}
            </button>
          </div>
        </div>
      </div>
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
