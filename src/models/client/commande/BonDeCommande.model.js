const mongoose = require('mongoose');

const prefixeId = "bcmd_";

const bonDeCommandeSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idClient: {
            type: String,
            required: true
        },
        idCommande: {
            type: String,
            required: true
        },
        idBoutique: {
            type: String,
            required: true
        },
        designation: {
            type: String
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
        collection:"bon_de_commande",
        timestamps:true
    }
);

bonDeCommandeSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('BonDeCommande', bonDeCommandeSchema);
