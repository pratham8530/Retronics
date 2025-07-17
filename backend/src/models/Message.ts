import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  text: string;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("Message", MessageSchema);