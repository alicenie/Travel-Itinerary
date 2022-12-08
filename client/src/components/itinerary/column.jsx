import React from "react";
import styled from "styled-components";
import Event from "./event";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  background-color: #354863;
  margin: 0px 0px;
  border: 0px solid #6d7779;
  border-radius: 0px 0px 10px 10px;
`;
const Title = styled.h2`
  padding-bottom: 10px;
  margin-top: 0px;
  padding-left: 15px;
  padding-top: 20px;
  margin-bottom: 5px;
  color: white;
  font-weight: 600;
  font-size: 20px;
`;
const Date = styled.h3`
  margin-top: 0;
  margin-left: 10px;
  margin-bottom: 0;
  padding: 10px;
  color: white;
  font-size: 16px;
`;
const EventList = styled.div`
  margin: 0px;
  margin-top: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDraggingOver ? "#A8CDDA" : "transparent"};
`;

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.events === this.props.events) {
      return false;
    }
    return true;
  }
  render() {
    return this.props.events.map((event, index) => (
      <Event key={event.id} event={event} index={index} />
    ));
  }
}

class DateText extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.title === this.props.title) {
      return false;
    }
    return true;
  }

  render() {
    let titleText = this.props.title;
    let hintStyle = null;
    if (this.props.title === "") {
      titleText = "No events scheduled. Chat with the chatbot to get started!";
      hintStyle = {
        color: "white",
        margin: 25,
        fontSize: 16,
        opacity: 0.9,
      };
    }
    return this.props.title === "" ? (
      <div>
        <br></br>
        <span style={hintStyle}>{titleText}</span>
      </div>
    ) : (
      <Date>{titleText}</Date>
    );
  }
}

export default class Column extends React.Component {
  render() {
    return (
      <div className="itinerary-container">
        <div className="title">
          <span>Travel Itinerary</span>
        </div>
        <Container id="itineraryColumn">
          {/* <div style={{textAlign: "center"}}><Title>Travel Itinerary</Title></div> */}
          <DateText title={this.props.column.title}></DateText>
          <Droppable droppableId={this.props.column.id}>
            {(provided, snapshot) => (
              <EventList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList events={this.props.events} />
                {provided.placeholder}
              </EventList>
            )}
          </Droppable>
        </Container>
      </div>
    );
  }
}
