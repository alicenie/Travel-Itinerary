import "./chatbot_style.css";

const Message = (props) => {
  return (
    <div className={`message-card-container-${props.who}`}>
      <div className={`message-card-${props.who}`}>
        <span>{props.text}</span>
      </div>
    </div>
  );
};

export default Message;
