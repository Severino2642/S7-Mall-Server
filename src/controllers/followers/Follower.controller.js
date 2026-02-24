const Item = require("../../models/followers/Follower.model");

exports.create = async (req, res) => {
    try {
        const role = await Item.create(req.body);
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const roles = await Item.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findById = async (req, res) => {
    try {
        const role = await Item.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        delete req.body._id; // sécurité

        const role = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }

        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const role = await Item.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }
        res.json({ message: "Item supprimé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteByUserIdAndFollowedId = async (req, res) => {
    try {
        const { idUser, idFollower } = req.params;
        const role = await Item.findOneAndDelete({ idUser, idFollower });
        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }
        res.json({ message: "Item supprimé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
