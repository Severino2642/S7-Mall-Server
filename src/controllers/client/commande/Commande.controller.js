const Stock = require("../../../models/proprietaire/stock/Stock.model");
const CommandeDetails = require("../../../models/client/commande/CommandeDetails.model");
const Commande = require("../../../models/client/commande/Commande.model");
const StockDetails = require("../../../models/proprietaire/stock/StockDetails.model");

exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Commande.aggregate([
            {
                $match: {
                    "_id": id
                }
            },
            {
                $lookup: {
                    from: "commande_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $addFields: {
                    montantTotal: {
                        $sum: {
                            $map: {
                                input: "$filles",
                                as: "fille",
                                in: {
                                    $multiply: ["$$fille.prixUnitaire", "$$fille.quantite"]
                                }
                            }
                        }
                    },
                    quantiteTotal: {
                        $sum: "$filles.quantite"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    idClient:1,
                    designation: 1,
                    status: 1,
                    date: 1,
                    montantTotal: 1,
                    quantiteTotal: 1,
                    filles: "$filles"
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdClient = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Commande.aggregate([
            {
                $match: {
                    "idClient": id
                }
            },
            {
                $lookup: {
                    from: "commande_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $addFields: {
                    montantTotal: {
                        $sum: {
                            $map: {
                                input: "$filles",
                                as: "fille",
                                in: {
                                    $multiply: ["$$fille.prixUnitaire", "$$fille.quantite"]
                                }
                            }
                        }
                    },
                    quantiteTotal: {
                        $sum: "$filles.quantite"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    idClient:1,
                    designation: 1,
                    status: 1,
                    date: 1,
                    montantTotal: 1,
                    quantiteTotal: 1,
                    filles: "$filles"
                }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFillesByIdMere = async (req, res) => {
    try {
        const { idMere } = req.params;

        const result = await CommandeDetails.aggregate([
            {
                $match: {
                    "idMere": idMere
                }
            },
            {
                $lookup: {
                    from: "produit",
                    localField: "idProduit",
                    foreignField: "_id",
                    as: "produitDetails"
                }
            },
            {
                $unwind: "$produitDetails"
            },
            {
                $project: {
                    _id: 1,
                    idMere: 1,
                    idProduit: 1,
                    quantite: 1,
                    prixUnitaire: 1,
                    produit: "$produitDetails"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
