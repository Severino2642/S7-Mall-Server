const mongoose = require("mongoose");

const prefixeId = "v_";

const venteSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idSource: {
            type: String,
        },
        idBoutique: {
            type: String,
            required: true
        },
        idClient: {
            type: String,
            required: true
        },
        designation: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection:"vente",
        timestamps:false
    }
);

venteSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Vente", venteSchema);
