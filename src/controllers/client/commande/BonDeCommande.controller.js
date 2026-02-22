const BonDeCommandeDetails = require("../../../models/client/commande/BonDeCommandeDetails.model");
const BonDeCommande = require("../../../models/client/commande/BonDeCommande.model");
const {ConstanteEtat} = require("../../../config/constante");
const Notification = require("../../../models/notification/Notification.model");
const Boutique = require("../../../models/proprietaire/Boutique.model");
exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await BonDeCommande.aggregate([
            {
                $match: {
                    "_id": id
                }
            },
            {
                $lookup: {
                    from: "bon_de_commande_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $lookup: {
                    from: "client",
                    localField: "idClient",
                    foreignField: "_id",
                    as: "clientInfo"
                }
            },
            {
                $unwind: "$clientInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: "$boutiqueInfo"
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
                    idCommande: 1,
                    idBoutique: 1,
                    designation: 1,
                    status: 1,
                    date: 1,
                    montantTotal: 1,
                    quantiteTotal: 1,
                    filles: "$filles",
                    client: "$clientInfo",
                    boutique: "$boutiqueInfo"
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdBoutique = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await BonDeCommande.aggregate([
            {
                $match: {
                    "idBoutique": id
                }
            },
            {
                $lookup: {
                    from: "bon_de_commande_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $lookup: {
                    from: "client",
                    localField: "idClient",
                    foreignField: "_id",
                    as: "clientInfo"
                }
            },
            {
                $unwind: "$clientInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: "$boutiqueInfo"
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
                    idCommande: 1,
                    idBoutique: 1,
                    designation: 1,
                    status: 1,
                    date: 1,
                    montantTotal: 1,
                    quantiteTotal: 1,
                    filles: "$filles",
                    client: "$clientInfo",
                    boutique: "$boutiqueInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdCommande = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await BonDeCommande.aggregate([
            {
                $match: {
                    "idCommande": id
                }
            },
            {
                $lookup: {
                    from: "bon_de_commande_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $lookup: {
                    from: "client",
                    localField: "idClient",
                    foreignField: "_id",
                    as: "clientInfo"
                }
            },
            {
                $unwind: "$clientInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: "$boutiqueInfo"
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
                    idCommande: 1,
                    idBoutique: 1,
                    designation: 1,
                    status: 1,
                    date: 1,
                    montantTotal: 1,
                    quantiteTotal: 1,
                    filles: "$filles",
                    client: "$clientInfo",
                    boutique: "$boutiqueInfo"
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

        const result = await BonDeCommandeDetails.aggregate([
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

exports.valider = async (req, res) => {
    try {
        const { id } = req.params;
        const status = ConstanteEtat.VALIDER;
        const item = await BonDeCommande.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        item.status = status;
        await item.save();

        const boutique = await Boutique.findById(item.idBoutique);
        const notification = new Notification({
            idUser: item.idClient,
            title: "Commande accepté",
            message: `Votre commande pour la boutique ${boutique.nom} a été valider.`,
            lien: `client/market/bon_commande/details/${item._id}`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #dcfce7;color: #22c55e;\">\n" +
                "                    <i class=\"fa fa-check-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejeter = async (req, res) => {
    try {
        const { id } = req.params;
        const status = ConstanteEtat.REJETER;
        const item = await BonDeCommande.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        item.status = status;
        await item.save();
        const boutique = await Boutique.findById(item.idBoutique);
        const notification = new Notification({
            idUser: item.idClient,
            title: "Commande rejetée",
            message: `Votre commande pour la boutique ${boutique.nom} a été rejetée.`,
            lien: `client/market/bon_commande/details/${item._id}`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #fee2e2;color: #ef4444;\">\n" +
                "                    <i class=\"fa fa-times-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
