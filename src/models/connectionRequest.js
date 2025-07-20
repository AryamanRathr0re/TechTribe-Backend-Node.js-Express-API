const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      required: true,

      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
  {
    timestamps: true,
  }
);
/// connection Req.find() these queries will be very fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if my from and to userID are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send Connection Request to yourself");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
