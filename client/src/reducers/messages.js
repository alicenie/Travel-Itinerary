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
      const content = response.data.fulfillmentMessages[0];
      let conversation = {
        who: "bot",
        content: content,
      };
      return conversation;
    } catch (error) {
      let conversation = {
        who: "bot",
        content: { text: { text: "Error just occured" } },
      };
      return conversation;
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
      console.log("extraReducers builder, action.payload: ", action.payload);
      state.messages = state.messages.concat(action.payload);
      console.log(state.messages);
    });
  },
});

export const getAllMessages = (state) => state.messages;
export const { addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
