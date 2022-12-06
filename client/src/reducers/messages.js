import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ route, message }) => {
    let conversations = [],
      params = { intent: "", fields: null };
    try {
      const response = await axios.post(
        `http://localhost:8080/api/agent/${route}`,
        { message }
      );

      console.log(response.data);
      for (let content of response.data.fulfillmentMessages) {
        conversations = conversations.concat({
          who: "bot",
          content: content,
        });
      }

      const intent = response.data.intent.displayName;
      const parameters = response.data.allRequiredParamsPresent
        ? response.data.parameters.fields
        : null;
      if (intent !== "Default Fallback Intent" && parameters)
        params = { intent: intent, fields: parameters };
    } catch (error) {
      let conversation = {
        who: "bot",
        content: { text: { text: "Error just occured" } },
      };
      conversations = [conversation];
    }
    console.log(params);
    return { conversations, params };
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    activities: [],
    date: "2022-11-22",
  },
  reducers: {
    addMessages: {
      reducer(state, action) {
        state.messages = state.messages.concat(action.payload);
      },
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      // console.log("extraReducers builder, action.payload: ", action.payload);
      const { conversations, params } = action.payload;
      conversations.forEach((conversation) => {
        state.messages = state.messages.concat(conversation);
      });
      if (params.intent == "AskDate") {
        // state = { ...state, date: params.fields.date };
        console.log("askdate ", state);
      } else if (params.intent == "AddActivity") {
        console.log("ask activity", state.activities);
        state.activities = state.activities.concat(params.fields);
      }
      console.log("extrabuilder, state", state.date);
    });
  },
});

export const getAllMessages = (state) => state.messages;
export const getActivities = (state) => state.activities;
export const getDate = (state) => state.date;
export const { addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
