const mongoose = require('mongoose');

const prefixeId = "flw_";

const followerSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idUser: {
            type: String,
            required: true
        },
        idFollower: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "followers",
        timestamps: false,
        _id: false
    }
);

followerSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36);
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Follower", followerSchema);
