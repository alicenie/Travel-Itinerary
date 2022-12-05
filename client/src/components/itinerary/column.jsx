import React from 'react';
import styled from 'styled-components';
import Event from './event';
import { Droppable } from 'react-beautiful-dnd';

const Container = styled.div`
    margin: 8px;
    border: 1px solid #6D7779;
    border-radius: 2px;
`;
const Title = styled.h3`
    padding: 8px;
`;
const EventList = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver ? '#87DCF0' : 'white')};
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

export default class Column extends React.Component {
    render() {
        return (
            <Container>
                <Title>{this.props.column.title}</Title>
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
        );
    }
}