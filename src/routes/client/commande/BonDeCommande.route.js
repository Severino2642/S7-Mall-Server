const express = require('express');
const router = express.Router();
const bonDeCommandeController = require('../../../controllers/client/commande/BonDeCommande.controller');

router.get('/details/:id', bonDeCommandeController.getCplById);
router.get('/boutique/:id', bonDeCommandeController.getCplByIdBoutique);
router.get('/commande/:id', bonDeCommandeController.getCplByIdCommande);
router.get('/filles/:idMere', bonDeCommandeController.getFillesByIdMere);
router.get('/valider/:id', bonDeCommandeController.valider);
router.get('/rejeter/:id', bonDeCommandeController.rejeter);

module.exports = router;
