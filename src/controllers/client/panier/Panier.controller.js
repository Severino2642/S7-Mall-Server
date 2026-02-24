const Caisse = require("../../../models/caisse/Caisse.model");
const Panier = require("../../../models/client/panier/Panier.model");
const mongoose = require("mongoose");
const {PanierService} = require("../../../services/panier/Panier.service");

exports.create = async (req, res) => {
    try {
        let old_panier = await Panier.findOne({idClient: req.body.idClient, idProduit: req.body.idProduit});
        if(old_panier){
            old_panier.quantite += req.body.quantite;
            await old_panier.save();
            return res.status(200).json(old_panier);
        }
        const caisse = new Panier(req.body);
        await caisse.save();
        res.status(201).json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const caisse = await Panier.find();
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const caisse = await Panier.findById(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Caisse introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const caisse = await Panier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!caisse) return res.status(404).json({ message: "Panier introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const caisse = await Panier.findByIdAndDelete(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Panier introuvable" });
        res.json({ message: "Caisse supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCPLByIdClient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Panier.aggregate([
            {
                $match: {
                    "idClient": id
                }
            },
            {
                $lookup: {
                    from: "produit",
                    localField: "idProduit",
                    foreignField: "_id",
                    as: "produitInfo"
                }
            },
            {
                $unwind: "$produitInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "produitInfo.idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: "$boutiqueInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "boutiqueInfo.idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "produit_variante",
                    localField: "idProduit",
                    foreignField: "idProduit",
                    as: "produitVariantes"
                }
            },
            {
                $lookup: {
                    from: "file",
                    let: { produitId: "$idProduit" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
                                idType: new mongoose.Types.ObjectId("69907176993485024f2c116d")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoPrincipale"
                }
            },
            {
                $lookup: {
                    from: "file",
                    localField: "idProduit",
                    foreignField: "idProprietaire",
                    as: "toutesLesPhotos"
                }
            },
            {
                $project: {
                    _id: 1,
                    idClient:1,
                    idProduit:1,
                    quantite: 1,
                    remarque: 1,
                    date: 1,
                    produit: {
                        $mergeObjects: [
                            "$produitInfo",
                            {
                                boutique:"$boutiqueInfo",
                                centreCommercial:"$centreInfo",
                                variantes: "$produitVariantes",
                                photo: { $arrayElemAt: ["$photoPrincipale", 0] },
                                autrePhoto: "$toutesLesPhotos"
                            }
                        ]
                    },
                }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.commander = async (req, res) => {
    try {
        const { listIdPanier } = req.body;
        console.log("listIdPanier:", listIdPanier);
        const result = await Panier.aggregate([
            { $match: { _id: { $in: listIdPanier } } },
            {
                $lookup: {
                    from: "produit",
                    localField: "idProduit",
                    foreignField: "_id",
                    as: "produitInfo"
                }
            },
            {
                $unwind: "$produitInfo"
            },
            {
                $project: {
                    _id: 1,
                    idClient:1,
                    idProduit:1,
                    quantite: 1,
                    remarque: 1,
                    date: 1,
                    prixUnitaire: "$produitInfo.prix",
                    idBoutique:"$produitInfo.idBoutique"
                }
            }
        ]);
        let commande = await PanierService.genererCommande(result);
        await Panier.deleteMany({ _id: { $in: listIdPanier } });
        res.json(commande);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
