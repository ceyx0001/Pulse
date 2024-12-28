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
exports.deleteTask = exports.getUserTasks = exports.updateTaskStatus = exports.postTask = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../lib/utils");
const prisma = new client_1.PrismaClient();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.query;
        const tasks = yield prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error getting tasks.") });
    }
});
exports.getTasks = getTasks;
const postTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId, } = req.body;
    try {
        const newTask = yield prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId,
            },
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error creating task.") });
    }
});
exports.postTask = postTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const { taskId } = req.params;
        const updatedTask = yield prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            },
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error updating task status.") });
    }
});
exports.updateTaskStatus = updateTaskStatus;
const getUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const tasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { authorUserId: Number(userId) },
                    { assignedUserId: Number(userId) },
                ],
            },
            include: {
                author: true,
                assignee: true,
            },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error getting user tasks.") });
    }
});
exports.getUserTasks = getUserTasks;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, userId } = req.params;
        const task = yield prisma.task.findUnique({
            where: {
                id: Number(taskId),
            },
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        if (task.authorUserId !== Number(userId)) {
            res.status(403).json({ error: "Not authorized to delete this task" });
            return;
        }
        yield prisma.task.delete({
            where: {
                id: Number(taskId),
            },
        });
        res.status(204).send();
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error deleting task.") });
    }
});
exports.deleteTask = deleteTask;
