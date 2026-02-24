const express = require("express");
const router = express.Router();
const itemController = require("../../../controllers/client/panier/Panier.controller");

router.post("/", itemController.create);
router.get("/", itemController.getAll);
router.get("/:id", itemController.getById);
router.put("/:id", itemController.update);
router.delete("/:id", itemController.delete);
router.get("/client/:id",itemController.getAllCPLByIdClient);
router.post("/commander",itemController.commander);
module.exports = router;
