const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/proprietaire/manager/Manager.controller");

router.post("/", controller.create);
router.get("/:id", controller.getById);
router.get("/details/:id", controller.getCPLById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/proprietaire/:id", controller.getAllByIdProprietaire);
router.get("/changerStatus/:id", controller.changerStatus);
router.get("/boutique/:id", controller.getAllByIdBoutique);

module.exports = router;
