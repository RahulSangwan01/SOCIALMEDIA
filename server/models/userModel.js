// import mongoose, { Schema } from "mongoose";

// //schema
// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: [true, "First Name is Required!"],
//     },
//     lastName: {
//       type: String,
//       required: [true, "Last Name is Required!"],
//     },
//     email: {
//       type: String,
//       required: [true, " Email is Required!"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is Required!"],
//       minlength: [6, "Password length should be greater than 6 character"],
//       select: true,
//     },
//     location: { type: String },
//     profileUrl: { type: String },
//     profession: { type: String },
//     friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
//     views: [{ type: String }],
//     verified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// const Users = mongoose.model("Users", userSchema);

// export default Users;


import mongoose, { Schema } from 'mongoose';

// Schema definition
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is Required!'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is Required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required!'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required!'],
      minlength: [6, 'Password length should be greater than 6 characters'],
      select: true, // Ensures password isn't returned unless explicitly selected
    },
    location: { type: String },
    profileUrl: { type: String }, // Avatar or profile image URL
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Users' }], // Correctly references Users
    views: [{ type: String }], // Could track profile views
    verified: { type: Boolean, default: false }, // Email or account verification status
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Model creation
const Users = mongoose.model('Users', userSchema);

export default Users;
