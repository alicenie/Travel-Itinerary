import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessages,
  addMessages,
  getAllMessages,
  getActivities,
  getDate,
} from "../../reducers/messages";
import Message from "./Message";
import Search from "../map/Search";
import initGLMap from "../glmap/GLMap";

const Chatbot = () => {
  const dispatch = useDispatch();
  const messages = useSelector(getAllMessages).messages;
  const activities = useSelector(getActivities);
  const date = useSelector(getDate);

  const [input, setInput] = useState(""); // text in the input box
  const [isInputLocation, setIsInputLocation] = useState(false);

  useEffect(() => {
    eventQuery("welcomeToMyWebsite");
    console.log("useeffect");
  }, []);

  useEffect(() => {
    console.log(messages);
    console.log(messages[messages.length - 1]?.intent);
    if (
      messages[messages.length - 1]?.intent == "AskCity" ||
      messages[messages.length - 1]?.intent == "AddActivity - yes"
    )
      setIsInputLocation(true);
    else setIsInputLocation(false);

    if (messages[messages.length - 1]?.intent == "AddActivity - no - yes") {
      initGLMap();
    }
  }, [messages]);

  const textQuery = async (message) => {
    let conversation = {
      who: "user",
      content: {
        text: { text: message },
      },
      intent: null,
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
    dispatch(fetchMessages({ route: "event", message: event }));
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

  const handleSelect = (address) => {
    setInput(address);
    textQuery(address);
    setInput("");
  };

  return (
    <div>
      <h3>Chatbot</h3>
      <div
        style={{
          height: 700,
          width: 500,
          border: "3px solid black",
          borderRadius: "7px",
        }}
      >
        <div style={{ height: 644, width: "100%", overflow: "auto" }}>
          {messages.length > 0
            ? messages.map((msg) => {
                return <Message who={msg.who} text={msg.content.text.text} />;
              })
            : null}
        </div>
        {isInputLocation ? (
          <Search
            onSelect={(address) => handleSelect(address)}
            onChange={setInput}
            address={input}
          />
        ) : (
          <div>
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
        )}
      </div>
    </div>
  );
};

export default Chatbot;
