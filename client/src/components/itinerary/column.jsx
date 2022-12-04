import React from 'react';
import styled from 'styled-components';
import Event from './event';
import { Droppable } from 'react-beautiful-dnd';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;
const Title = styled.h3`
    padding: 8px;
`;
const EventList = styled.div`
    padding: 8px;
`;

export default class Column extends React.Component {
    render() {
        return (
            <Container>
                <Title>{this.props.column.title}</Title>
                <Droppable droppableId={this.props.column.id}>
                    {provided => (
                        <EventList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.events.map((event, index) => (
                                <Event key={event.id} event={event} index={index} />
                            ))}
                            {provided.placeholder}
                        </EventList>
                    )}
                </Droppable>
            </Container>
        );
    }
}