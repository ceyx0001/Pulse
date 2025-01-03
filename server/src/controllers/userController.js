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
exports.postUser = exports.getUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../lib/utils");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error getting users.") });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                cognitoId: cognitoId,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error getting user.") });
    }
});
exports.getUser = getUser;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, cognitoId, profilePictureUrl = "i1.jpg", teamId = 1, } = req.body;
        const newUser = yield prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId,
            },
        });
        res.status(201).json({ message: "User Created Successfully", newUser });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: (0, utils_1.parsePrismaError)(error, "Error creating user.") });
    }
});
exports.postUser = postUser;
