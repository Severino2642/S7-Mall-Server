const mongoose = require('mongoose');

const prefixeId = "bcmdt_";

const bonDeCommandeDetailsSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idMere: {
            type: String,
            required: true
        },
        idProduit: {
            type: String,
            required: true
        },
        quantite: {
            type: Number,
            min:1,
            required: true
        },
        prixUnitaire: {
            type: Number,
            required: true
        }
    },
    {
        collection:"bon_de_commande_details",
        timestamps:true
    }
);

bonDeCommandeDetailsSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('BonDeCommandeDetails', bonDeCommandeDetailsSchema);
