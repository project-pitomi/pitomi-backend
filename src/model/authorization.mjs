import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export default (secret) => {
  const authorizationSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Types.ObjectId, required: true },
      token: { type: String },
      expired_at: { type: Date },
    },
    {
      collection: "authorization",
      timestamps: {
        createdAt: "created_at",
      },
    }
  );

  authorizationSchema.pre("save", async function () {
    if (this.token) return;
    const secretIn = secret;
    const secretSign = secret;
    this.token = jwt.sign(
      { user_id: this.user_id, secret: secretIn },
      secretSign
    );
  });

  authorizationSchema.index({ user_id: 1, token: 1 });

  return mongoose.model("Authorization", authorizationSchema);
};
