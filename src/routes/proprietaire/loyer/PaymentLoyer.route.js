const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/proprietaire/loyer/PaymentLoyer.controller");

router.post("/", controller.create);
router.get("/:id", controller.getById);
router.get("/details/:id", controller.getCplById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/centre/:id", controller.getCplByIdCentreCommercial);
router.get("/proprietaire/:id", controller.getCplByIdProprietaire);
router.get("/boutique/:id", controller.getCplByIdBoutique);
router.get("/valider/:id", controller.valider);
router.get("/rejeter/:id", controller.rejeter);

module.exports = router;
