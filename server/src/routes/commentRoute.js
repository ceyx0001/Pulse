"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
router.post("/", commentController_1.postComment);
router.delete("/:commentId/task/:taskId/", commentController_1.deleteComment);
exports.default = router;
