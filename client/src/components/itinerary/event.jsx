import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid #6D7779;
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? '#D47863' : 'white')};
    top: auto !important;
    left: auto !important;
    box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
`;

const Duration = styled.h5``;

const Content = styled.h4`
    font-style: italic;
    margin-top: 10px;
`;

export default class Event extends React.Component {
    render () {
        return ( 
            <Draggable draggableId={this.props.event.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >   
                        <Duration className="event-duration">{this.props.event.duration}</Duration>
                        <Content className="event-content">{this.props.event.content}</Content>
                    </Container>
                )}
            </Draggable>
        );
    }
}