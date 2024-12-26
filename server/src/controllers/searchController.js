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
exports.search = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../lib/utils");
const prisma = new client_1.PrismaClient();
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const [tasksResult, projectsResult, usersResult] = yield Promise.allSettled([
            prisma.task.findMany({
                where: {
                    OR: [
                        { title: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
            }),
            prisma.project.findMany({
                where: {
                    OR: [
                        { name: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
            }),
            prisma.user.findMany({
                where: {
                    OR: [{ username: { contains: query } }],
                },
            }),
        ]);
        const response = {};
        if (tasksResult.status === 'fulfilled') {
            response.tasks = tasksResult.value;
        }
        else {
            console.error('Task search error:', tasksResult.reason);
            response.taskError = (0, utils_1.parsePrismaError)(tasksResult.reason, "Error searching tasks.");
        }
        if (projectsResult.status === 'fulfilled') {
            response.projects = projectsResult.value;
        }
        else {
            console.error('Project search error:', projectsResult.reason);
            response.projectError = (0, utils_1.parsePrismaError)(projectsResult.reason, "Error searching projects.");
        }
        if (usersResult.status === 'fulfilled') {
            response.users = usersResult.value;
        }
        else {
            console.error('User search error:', usersResult.reason);
            response.userError = (0, utils_1.parsePrismaError)(usersResult.reason, "Error searching users.");
        }
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: "An unexpected error occurred during search." });
    }
});
exports.search = search;
