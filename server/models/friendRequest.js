// import mongoose, { Schema } from "mongoose";

// const requestSchema = Schema(
//   {
//     requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
//     requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
//     requestStatus: { type: String, default: "Pending" },
//   },
//   { timestamps: true }
// );

// const FriendRequest = mongoose.model("FriendRequest", requestSchema);

// export default FriendRequest;


import mongoose, { Schema } from 'mongoose';

// Schema for Friend Request
const requestSchema = new Schema(
  {
    requestTo: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    requestFrom: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    requestStatus: { 
      type: String, 
      default: 'Pending', 
      enum: ['Pending', 'Accepted', 'Declined'] 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Model creation
const FriendRequest = mongoose.model('FriendRequest', requestSchema);

export default FriendRequest;
