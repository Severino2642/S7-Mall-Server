const CentreCommercial = require("../../models/centre_commercial/centreCommercial.model");
const Authentification = require("../../models/authentification/Authentification.model");
const Role = require("../../models/authentification/Role.model");
const mongoose = require("mongoose");
const Boutique = require("../../models/proprietaire/Boutique.model");
// Créer un centre commercial
exports.createCentre = async (req, res) => {
    try {
        const { identifiant, mdp, ...centreData } = req.body;

        if (!identifiant || !mdp) {
            return res.status(400).json({ erreura: "identifiant et mdp requis" });
        }

        if (identifiant && mdp) {
            const old_auth = await Authentification.find({ identifiant:identifiant });
            if (old_auth && old_auth.length > 0) {
                return res.status(400).json({ message: "Identifiant invalide" });
            }
        }

        // Création du centre commercial
        const centre = new CentreCommercial(centreData);
        await centre.save(); // hook 'pre save' du centre si existant

        // Création de l'authentification
        const role = await Role.findById("698712f076c4f14d630bb34a"); // rôle "centre commercial"
        const auth = new Authentification({
            idUser: centre._id,
            idRole: role._id, // rôle "centre commercial"
            identifiant,
            mdp // sera hashé automatiquement par le hook 'pre save'
        });
        await auth.save();

        res.status(201).json({
            centre: centre,
            authentification: auth
        });

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { identifiant, mdp, ...itemData } = req.body;
        let auth = await Authentification.findOne({ idUser: req.params.id });
        if (identifiant && auth.identifiant!==identifiant) {
            const old_auth = await Authentification.find({ identifiant:identifiant });
            if (old_auth && old_auth.length > 0) {
                return res.status(400).json({ message: "Identifiant invalide" });
            }
        }
        if (identifiant) {
            auth.identifiant = identifiant;
        }
        if (mdp && mdp.trim() !== "") {
            auth.mdp = mdp; // sera hashé automatiquement par le hook 'pre save'
        }
        await auth.save();

        const item = await CentreCommercial.findByIdAndUpdate(req.params.id, itemData, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// Lister tous les centres
exports.getCentres = async (req, res) => {
    const centres = await CentreCommercial.find();
    res.json(centres);
};

// Récupérer un centre par ID
exports.getCentreById = async (req, res) => {
    const centre = await CentreCommercial.findById(req.params.id);
    if (!centre) {
        return res.status(404).json({ message: "Centre non trouvé" });
    }
    res.json(centre);
};


exports.fermer = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CentreCommercial.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.isOuvert = false;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.ouvrir = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CentreCommercial.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.isOuvert = true;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await CentreCommercial.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "file",
                    let: { produitId: "$_id" },
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
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
                                idType: new mongoose.Types.ObjectId("699ad50b95739c29a87d14f9")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoCouverture"
                }
            },
            {
                $lookup: {
                    from: "followers",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "followerListe"
                }
            },
            {
                $project: {
                    _id: 1,
                    nom: 1,
                    adresse: 1,
                    date_creation: 1,
                    isOuvert: 1,
                    heure_ouverture: 1,
                    heure_fermeture: 1,
                    pdp: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    pdc: {
                        $arrayElemAt: ["$photoCouverture", 0]
                    },
                    followers: "$followerListe"
                }
            }
        ]);
        if (result.length==0){
            res.status(404).json({message:"Item introuvable"})
        }
        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
