const mongoose = require('mongoose');

const prefixeId = "notif_";

const notificationSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idUser: {
            type: String,
            required: true
        },
        title: {
            type: String,
        },
        message: {
            type: String,
            required: true
        },
        lien: {
            type: String,
        },
        badge: {
            type: String,
        },
        lu: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection:"notifications",
        timestamps:true
    }
);

notificationSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
