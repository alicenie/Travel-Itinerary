import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid #6D7779;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? '#D47863' : 'white')};
    top: auto !important;
    left: auto !important;
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
                        {this.props.event.content}
                    </Container>
                )}
            </Draggable>
        );
    }
}