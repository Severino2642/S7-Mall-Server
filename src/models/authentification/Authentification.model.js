const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authentificationSchema = new mongoose.Schema(
    {
        idUser: {
            type: String,
            required: true
        },

        idRole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        },

        identifiant: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        mdp: {
            type: String,
            required: true
        }
    },
    {
        collection: "authentification",
        timestamps: false
    }
);

// changement: utiliser un middleware async sans paramètre "next" — appeler next() provoquait "next is not a function" quand Mongoose traite le hook comme basé sur les promesses
authentificationSchema.pre("save", async function() {
    if (this.isModified("mdp")) {
        const salt = await bcrypt.genSalt(10);
        this.mdp = await bcrypt.hash(this.mdp, salt);
    }
});

module.exports = mongoose.model("Authentification", authentificationSchema);
