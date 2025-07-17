import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
}

const ConversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This MUST match the name of your User model
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);