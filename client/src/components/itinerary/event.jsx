import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import dragIndicator from '../../shared/images/drag-indicator.png';

const Container = styled.div`
    border: 1px solid #6D7779;
    border-radius: 5px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    margin-bottom: 4px;
    margin-top: 4px;
    background-color: ${props => (props.isDragging ? '#FEE6AF' : 'white')};
    top: auto !important;
    left: auto !important;
    box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
    height: ${props => {
        let duration = window.localStorage.getItem("duration "+props.eventId) ? 
         props.duration.split(" ")[0] : window.localStorage.getItem("duration "+props.eventId);
        if (duration < 1) {
            window.localStorage.setItem("duration "+props.eventId, duration);
            return 80;
        } else {
            window.localStorage.setItem("duration "+props.eventId, duration);
            return duration * 80;
        }
    }}px;
    display: flex;
`;

const SideIndicator = styled.img`
    margin-top: 15px;
    margin-left: 5px;
    height: 20px;
`;

const Duration = styled.input`
    font-size: 14px;
    padding: 5px;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 5px;
    background: transparent;
    border: 1px dashed gray;
    border-radius: 3px;
    width: 60px;
`;

const Confirm = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
`;

const Content = styled.h4`
    font-style: italic;
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 10px;
`;



const Event = (props) => {
    return ( 
        <Draggable draggableId={props.event.id} index={props.index}>
            {(provided, snapshot) => (
                <Container
                    id={"eventContainer-"+props.event.id}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                    duration={props.event.duration}
                    eventId={props.event.id}
                >   
                    <div>
                        <SideIndicator src={dragIndicator} duration={props.event.duration} eventId={props.event.id}></SideIndicator>
                    </div>
                    <div>
                        <Duration id={"event-duration"+props.event.id} type="text" defaultValue={props.event.duration} duration={props.event.duration} eventId={props.event.id}></Duration>
                        <Confirm isDragging={snapshot.isDragging} onClick={() => {
                            window.localStorage.setItem("duration"+props.event.id, document.getElementById("event-duration"+props.event.id).value.split(" ")[0]);
                            let duration = window.localStorage.getItem("duration"+props.event.id) < 1 ? 1 : window.localStorage.getItem("duration"+props.event.id);
                            document.getElementById("eventContainer-"+props.event.id).style.height = duration * 80 + "px";
                        }}>✔️</Confirm>
                        <Content className="event-content" isDragging={snapshot.isDragging}>{props.event.content}</Content>
                    </div>
                    </Container>
            )}
        </Draggable>
    );
}
// export default class Event extends React.Component {
//     state = {
//         duration: this.props.event.duration
//     };

//     render () {
        
//     }
// }

export default Event;