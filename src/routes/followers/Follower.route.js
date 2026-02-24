const express = require("express");
const router = express.Router();

const controller = require("../../controllers/followers/Follower.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.delete("/follow-relation/:idUser/:idFollower", controller.deleteByUserIdAndFollowedId);

module.exports = router;
