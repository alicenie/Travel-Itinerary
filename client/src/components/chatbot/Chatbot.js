import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessages,
  addMessages,
  updateLatLng,
  getAllMessages,
  getActivities,
} from "../../reducers/messages";
import Message from "./Message";
import Search from "../map/Search";
import initGLMap from "../glmap/GLMap";
import "./chatbot_style.css";
import send_active_icon from "./send_active.svg";
import send_disabled_icon from "./send_disabled.svg";

const Chatbot = () => {
  const dispatch = useDispatch();
  const messages = useSelector(getAllMessages).messages;
  const activities = useSelector(getActivities);
  const messageEl = useRef(null);

  const [input, setInput] = useState(""); // text in the input box
  const [isInputLocation, setIsInputLocation] = useState(false);
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [route, setRoute] = useState([]);

  useEffect(() => {
    eventQuery("welcomeToMyWebsite");

    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    console.log(messages);
    if (
      messages[messages.length - 1]?.intent == "AskCity" ||
      messages[messages.length - 1]?.intent == "AddActivity - yes"
    )
      setIsInputLocation(true);
    else setIsInputLocation(false);

    if (messages[messages.length - 1]?.intent == "AddActivity - no - yes") {
      console.log(route);
      initGLMap(route);
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
    if (input == "" && e.key == "Enter") {
      return alert("you need to type somthing first");
    }

    // press Enter key or click Send button -> send message
    if (e.key == "Enter" || e.key == undefined) {
      textQuery(input);
      setInput("");
    }
  };

  const handleSelect = (address) => {
    setAddress(address);
    textQuery(address);
  };

  useEffect(() => {
    console.log("useEffect, activities");
    console.log(activities);
    console.log(address);
    console.log(latLng);
    dispatch(updateLatLng({ idx: activities.length - 1, latLng }));
    setAddress("");

    const newRoute = activities.map((d) => {
      if (d.latLng)
        return {
          lat: d.latLng.lat,
          lng: d.latLng.lng,
        };
    });
    setRoute(newRoute);
  }, [activities]);

  return (
    <div className="chatbot-container">
      <div className="title">
        <span>Chatbot</span>
      </div>

      <div className="chat-container">
        <div className="messages-container" ref={messageEl}>
          {messages.length > 0
            ? messages.map((msg) => {
                return <Message who={msg.who} text={msg.content.text.text} />;
              })
            : null}
        </div>
        <div className="input-container">
          {isInputLocation ? (
            <Search
              onSelect={(address) => handleSelect(address)}
              onChange={setAddress}
              getLatLng={setLatLng}
              address={address}
            />
          ) : (
            <div>
              <input
                className="input"
                placeholder="Send a message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={handleSendMsg}
                type="text"
                value={input}
              />
              <button
                className="send-btn"
                onClick={handleSendMsg}
                disabled={input == ""}
              >
                <img
                  src={input == "" ? send_disabled_icon : send_active_icon}
                ></img>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
