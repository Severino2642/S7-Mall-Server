const express = require('express');
const router = express.Router();
const commandeController = require('../../../controllers/client/commande/Commande.controller');

router.get('/details/:id', commandeController.getCplById);
router.get('/client/:id', commandeController.getCplByIdClient);
router.get('/filles/:idMere', commandeController.getFillesByIdMere);

module.exports = router;
