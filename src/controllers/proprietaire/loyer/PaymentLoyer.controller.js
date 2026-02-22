const MouvementCaisse = require("../../../models/caisse/MouvementCaisse.model");
const PaymentLoyer = require("../../../models/proprietaire/loyer/PaymentLoyer.model");
const {ConstanteEtat} = require("../../../config/constante");
const BonDeCommande = require("../../../models/client/commande/BonDeCommande.model");
const Boutique = require("../../../models/proprietaire/Boutique.model");
const Notification = require("../../../models/notification/Notification.model");
exports.create = async (req, res) => {
    try {
        const item = new PaymentLoyer(req.body);
        await item.save();
        const boutique = await Boutique.findById(item.idBoutique);
        const notification = new Notification({
            idUser: item.idCentreCommercial,
            title: "Nouveau paiement de loyer",
            message: `Le locataire de la boutique ${boutique.nom} a effectué un paiement de loyer pour le mois de ${item.mois}. Veuillez vérifier et valider le paiement.`,
            lien: `owner/payment_loyer/details/${item._id}`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #dbeafe;color: #3b82f6;\">\n" +
                "                    <i class=\"fa fa-info-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const caisse = await PaymentLoyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!caisse) return res.status(404).json({ message: "Item introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const caisse = await PaymentLoyer.findByIdAndDelete(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await PaymentLoyer.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await PaymentLoyer.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
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
                $project: {
                    _id: 1,
                    idCentreCommercial:1,
                    idBoutique:1,
                    mois: 1,
                    annee: 1,
                    montant: 1,
                    status:1,
                    date: 1,
                    boutique:"$boutiqueInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdCentreCommercial = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await PaymentLoyer.aggregate([
            {
                $match: {
                    "idCentreCommercial": id
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
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
                $project: {
                    _id: 1,
                    idCentreCommercial:1,
                    idBoutique:1,
                    mois: 1,
                    annee: 1,
                    montant: 1,
                    status:1,
                    date: 1,
                    boutique:"$boutiqueInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdBoutique = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await PaymentLoyer.aggregate([
            {
                $match: {
                    idBoutique: id
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
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
                $project: {
                    _id: 1,
                    idCentreCommercial:1,
                    idBoutique:1,
                    mois: 1,
                    annee: 1,
                    montant: 1,
                    status:1,
                    date: 1,
                    boutique:"$boutiqueInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdProprietaire = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PaymentLoyer.aggregate([
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
                $match: {
                    "boutiqueInfo.idProprietaire": id
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $project: {
                    _id: 1,
                    idCentreCommercial:1,
                    idBoutique:1,
                    mois: 1,
                    annee: 1,
                    montant: 1,
                    status:1,
                    date: 1,
                    boutique:"$boutiqueInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.valider = async (req, res) => {
    try {
        const { id } = req.params;
        const status = ConstanteEtat.VALIDER;
        const item = await PaymentLoyer.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        item.status = status;
        await item.save();

        const boutique = await Boutique.findById(item.idBoutique);
        const notification = new Notification({
            idUser: boutique.idProprietaire,
            title: "Payment accepté",
            message: `Votre paiement de loyer du mois de ${item.mois} pour la boutique ${boutique.nom} a été accepté.`,
            lien: `owner/payment_loyer/details/${item._id}`,
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
        const item = await PaymentLoyer.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        item.status = status;
        await item.save();
        const boutique = await Boutique.findById(item.idBoutique);
        const notification = new Notification({
            idUser: boutique.idProprietaire,
            title: "Payment rejetée",
            message: `Votre paiement de loyer du mois de ${item.mois} pour la boutique ${boutique.nom} a été rejeté.`,
            lien: `owner/payment_loyer/details/${item._id}`,
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
