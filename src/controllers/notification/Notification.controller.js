const Caisse = require("../../models/caisse/Caisse.model");
const Notification = require("../../models/notification/Notification.model");
exports.create = async (req, res) => {
    try {
        const item = new Notification(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const items = await Notification.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await Notification.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Notification introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Notification introuvable" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.delete = async (req, res) => {
    try {
        const item = await Notification.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Notification introuvable" });
        res.json({ message: "Caisse supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllByIdUser = async (req, res) => {
    try {
        const {id} = req.params;
        const items = await Notification.find({idUser: id}).sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toutMarquerCommeLu = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Notification.updateMany(
            {
                idUser: id,
                lu: false
            },
            {
                lu: true
            }
        );
        res.json({ message: `${result.nModified} notifications marquées comme lues` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.marquerCommeLu = async (req, res) => {
    try {
        let item = await Notification.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Notification introuvable" });
        item.lu = true;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
