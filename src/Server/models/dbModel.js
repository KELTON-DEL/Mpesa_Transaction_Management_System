const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      default: ""
    },

    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("Customers", userSchema);

module.exports = User;