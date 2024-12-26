"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrismaError = void 0;
const parsePrismaError = (error, message) => {
    const lines = error.message.split("\n").map((line) => line.trim());
    return {
        message: (message ? message + " " : "") + lines[1] || "Unknown error",
        location: lines.find((line) => line.includes(".js:") || line.includes(".ts:")),
        codeContext: lines
            .filter((line) => line.includes("→") ||
            line.includes("data:") ||
            line.startsWith("+") ||
            /^\d+/.test(line))
            .map((line) => line.replace("→", "")),
        invalidFields: lines
            .filter((line) => line.includes("undefined") || line.includes("null"))
            .map((line) => line.trim()),
        reason: lines[lines.length - 1],
    };
};
exports.parsePrismaError = parsePrismaError;
