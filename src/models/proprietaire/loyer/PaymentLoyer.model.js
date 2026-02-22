const mongoose = require('mongoose');

const prefixeId = "ploy_";

const paymentLoyerSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idCentreCommercial: {
            type: String,
            required: true
        },
        idBoutique: {
            type: String,
            required: true
        },
        mois: {
            type: String,
            enum: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            required: true
        },
        annee: {
            type: Number,
            required: true
        },
        montant: {
            type: Number,
            required: true,
            min: 0
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
        collection: "payment_loyer",
        timestamps: false
    }
);

paymentLoyerSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36);
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("PaymentLoyer", paymentLoyerSchema);
