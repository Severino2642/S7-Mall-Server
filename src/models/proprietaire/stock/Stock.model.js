const mongoose = require("mongoose");

const prefixeId = "stk_";

const stockSchema = new mongoose.Schema(
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
        idTypeMvtStock: {
            type: String,
            values: ['Entrer', 'Sortie'],
            required: true
        },
        designation: {
            type: String,
            required: true,
            trim: true
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
        collection:"stock",
        timestamps:false
    }
);

stockSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Stock", stockSchema);
