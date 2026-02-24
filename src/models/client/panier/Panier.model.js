const mongoose = require('mongoose');

const prefixeId = "panier_";

const panierSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idClient: {
            type: String,
            required: true
        },
        idProduit: {
            type: String,
            required: true
        },
        quantite: {
            type: Number,
            default: 1,
            min: 1
        },
        remarque: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection:"paniers",
        timestamps:true
    }
);

panierSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('Panier', panierSchema);
