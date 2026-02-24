const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification/Notification.controller');

router.post('/', notificationController.create);
router.get('/', notificationController.getAll);
router.get('/:id', notificationController.getById);
router.put('/:id', notificationController.update);
router.delete('/:id', notificationController.delete);
router.get('/marquerLu/:id', notificationController.marquerCommeLu);
router.get('/user/:id', notificationController.getAllByIdUser);
router.get('/user/marquerLu/:id', notificationController.toutMarquerCommeLu);

module.exports = router;
