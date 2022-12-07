import React from "react";
import Column from "./column";
import '@atlaskit/css-reset';
import { DragDropContext } from "react-beautiful-dnd";

class Itinerary extends React.Component {
  onDragStart = () => {
    document.getElementById("itineraryColumn").style.transition = "background-color 0.2s ease";
  };

  onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(this.props.itineraryData.events).length
      : 0;
    document.getElementById("itineraryColumn").style.backgroundColor = `rgba(53, 72, 99, ${opacity})`;
  };

  onDragEnd = (result) => {
    document.getElementById("itineraryColumn").style.backgroundColor = "#354863";

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

    const newItineraryData = {
      ...this.props.itineraryData,
      columns: {
        ...this.props.itineraryData.columns,
        [newColumn.id]: newColumn,
      },
    };

    this.props.setItineraryData(newItineraryData);
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
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
