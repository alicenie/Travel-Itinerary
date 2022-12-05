const Message = (props) => {
  return (
    <div>
      <p>{props.who}</p>
      <p>{props.text}</p>
      <br></br>
    </div>
  );
};

export default Message;
