const mogoonse = require('mongoose');

const prefixeId = "mng_";

const managerSchema = new mogoonse.Schema(
    {
        _id: {
            type: String
        },
        idBoutique: {
            type: String,
        },
        nom: {
            type: String,
        },
        prenom: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
        },
        email: {
            type: String,
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
        collection:"manager",
        timestamps:false
    }
);

managerSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mogoonse.model("Manager", managerSchema);
