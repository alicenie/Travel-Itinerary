import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ route, message }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/agent/${route}`,
        { message }
      );
      let conversations = [];
      for (let content of response.data.fulfillmentMessages) {
        conversations = conversations.concat({
          who: "bot",
          content: content,
        });
      }
      return conversations;
    } catch (error) {
      let conversation = {
        who: "bot",
        content: { text: { text: "Error just occured" } },
      };
      return [conversation];
    }
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState: { messages: [] },
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
      action.payload.forEach((conversation) => {
        state.messages = state.messages.concat(conversation);
      });
    });
  },
});

export const getAllMessages = (state) => state.messages;
export const { addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
