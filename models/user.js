import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//!hash password before save
userSchema.pre("save", async function (next) {
  //!if this password is already modified pass next middleware
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//!verify password for login
userSchema.methods.verifyPassword = async function (passwordForm) {  
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
