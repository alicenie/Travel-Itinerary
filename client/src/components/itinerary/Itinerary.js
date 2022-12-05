import React from "react";
import Column from "./column";
// import '@atlaskit/css-reset';
import { DragDropContext } from "react-beautiful-dnd";

class Itinerary extends React.Component {
  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = this.props.itineraryData.columns[source.droppableId];
    const newEventIds = Array.from(column.eventIds);
    newEventIds.splice(source.index, 1);
    newEventIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      eventIds: newEventIds,
    };

    const newState = {
      ...this.props.itineraryData,
    };
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.props.itineraryData.columnOrder.map((columnId) => {
          const column = this.props.itineraryData.columns[columnId];
          const events = column.eventIds.map(
            (eventId) => this.props.itineraryData.events[eventId]
          );

          return <Column key={column.id} column={column} events={events} />;
        })}
      </DragDropContext>
    );
  }
}

export default Itinerary;
