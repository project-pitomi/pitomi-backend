import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    bookmarks: { type: [Number], required: true, default: [] },
  },
  {
    collection: "user",
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashed_password = await bcrypt.hash(this.password, saltRounds);
  this.password = hashed_password;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
