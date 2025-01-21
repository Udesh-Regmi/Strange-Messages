// src/model/User.ts

import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}
export interface Friends extends Document {
  username: string;
  friendsFrom: Date;
}


export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
  // friendList : Friends[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


/* const FriendListSchema: Schema<Friends> = new Schema(
//   {
// username: {
//       type: String,
//       required: true,     // Friend's username must be provided
//     },
//     friendsFrom: {
//       type: Date,
//       required: true,
//       default: Date.now, // Defaults to the current date if not provided
//     },
//   },
//   {
//     timestamps: true, // Automatically adds `createdAt` and `updatedAt`
//   }
 );*/

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      "Please use a valid Email Address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // Uncomment and use a regex for strong password validation if needed
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/, "Please use a strong password."]
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "VerifyCodeExpiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },    
  messages: [MessageSchema],
  
//   birthdayWishes: [BirthdayWishSchema],

  // friendList: [FriendListSchema],   

});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;