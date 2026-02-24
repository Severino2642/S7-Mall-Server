const mongoose = require('mongoose');

const prefixeId = "cmd_";

const commandeSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idClient: {
            type: String,
            required: true
        },
        designation: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection:"commande",
        timestamps:true
    }
);

commandeSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('Commande', commandeSchema);
