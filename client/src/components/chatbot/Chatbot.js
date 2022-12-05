import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessages,
  addMessages,
  getAllMessages,
} from "../../reducers/messages";

const Chatbot = () => {
  const dispatch = useDispatch();
  const messages = useSelector(getAllMessages);

  const [input, setInput] = useState(""); // text in the input box

  useEffect(() => {
    eventQuery("welcomeToMyWebsite");
    console.log("useeffect");
  }, []);

  const textQuery = async (message) => {
    let conversation = {
      who: "user",
      content: {
        text: { text: message },
      },
    };
    dispatch(addMessages(conversation));
    dispatch(fetchMessages({ route: "text-input", message: message }));

    // // without reducer
    // try {
    //   const response = await Axios.post(
    //     "http://localhost:8080/api/agent/text-input",
    //     { message }
    //   );
    //   const content = response.data.fulfillmentMessages[0];
    //   let conversation = {
    //     who: "bot",
    //     content: content,
    //   };
    //   console.log(conversation);
    //   //   dispatch(saveMessage(conversation));
    // } catch (error) {
    //   let conversation = {
    //     who: "bot",
    //     content: { text: { text: "Error just occured" } },
    //   };
    //   console.log(conversation);
    //   //   dispatch(saveMessage(conversation));
    //   console.log(error);
    // }
  };

  const eventQuery = async (event) => {
    console.log(event);
    try {
      const response = await Axios.post(
        "http://localhost:8080/api/agent/event",
        { event }
      );
      const content = response.data.fulfillmentMessages[0];
      let conversation = {
        who: "bot",
        content: content,
      };
      console.log(conversation);
      //   dispatch(saveMessage(conversation));
    } catch (error) {
      let conversation = {
        who: "bot",
        content: { text: { text: "Error just occured" } },
      };
      console.log(conversation);
      //   dispatch(saveMessage(conversation));
      console.log(error);
    }
  };

  const handleSendMsg = (e) => {
    if (input == "") {
      return alert("you need to type somthing first");
    }

    // press Enter key or click Send button -> send message
    if (e.key == "Enter" || e.key == undefined) {
      textQuery(input);
      setInput("");
    }
  };

  const renderMessages = (messages) => {
    console.log(messages);
  };

  return (
    <div>
      <h3>Chatbot</h3>
      <div
        style={{
          height: 700,
          width: 700,
          border: "3px solid black",
          borderRadius: "7px",
        }}
      >
        <div style={{ height: 644, width: "100%", overflow: "auto" }}>
          {renderMessages(messages)}
        </div>
        <input
          style={{
            margin: 0,
            width: "100%",
            height: 50,
            borderRadius: "4px",
            padding: "5px",
            fontSize: "1rem",
          }}
          placeholder="Send a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleSendMsg}
          type="text"
          value={input}
        />
        <button onClick={handleSendMsg}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
