"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.postComment = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../lib/utils");
const prisma = new client_1.PrismaClient();
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { comment, commentId, taskId, userId } = req.body;
        const newComment = yield prisma.comment.create({
            data: {
                id: commentId,
                text: comment,
                taskId: taskId,
                userId: userId,
            },
        });
        res.status(201).json(newComment);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error creating comment.") });
    }
});
exports.postComment = postComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, taskId } = req.params;
        yield prisma.comment.delete({
            where: {
                id_taskId: {
                    id: Number(commentId),
                    taskId: Number(taskId)
                },
            },
        });
        res.status(204).send();
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error deleting comment.") });
    }
});
exports.deleteComment = deleteComment;
