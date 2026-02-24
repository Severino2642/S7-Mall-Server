const mongoose = require('mongoose');

const prefixeId = "cmdt_";

const commandeDetailsSchema = new mongoose.Schema(
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
        collection:"commande_details",
        timestamps:true
    }
);

commandeDetailsSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model('CommandeDetails', commandeDetailsSchema);
