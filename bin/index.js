#!/usr/bin/env node
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var version = require("../package.json").version;
var image_extensions = ['png', 'jpg', 'jpeg', 'svg'];
var ignorePath = ['node_modules', '.git', 'coverage',
    '.DS_Store', 'bin', '.vscode'];
var fs = fs_1.default.promises;
var doesFileNeedChange = function (newFilePath, content) {
    try {
        return content !== fs_1.default.readFileSync(newFilePath).toString();
    }
    catch (error) {
        return true;
    }
};
var exportAll = function (path, force) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, pathName, length, files, i, stat, exportFile, imageType, fileExtension, getImageVariableName, newFilePath, content, className, classContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readdir(path)];
            case 1:
                dir = _a.sent();
                pathName = path.split('/').pop();
                length = dir.length;
                files = [];
                if (ignorePath.includes(pathName !== null && pathName !== void 0 ? pathName : '')) {
                    return [2 /*return*/];
                }
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < length)) return [3 /*break*/, 7];
                return [4 /*yield*/, fs.stat(path + '/' + dir[i])];
            case 3:
                stat = _a.sent();
                if (!stat.isDirectory()) return [3 /*break*/, 5];
                return [4 /*yield*/, exportAll(path + '/' + dir[i], force)];
            case 4:
                exportFile = _a.sent();
                if (exportFile) {
                    files.push(exportFile);
                }
                _a.label = 5;
            case 5:
                imageType = dir[i].split('.').pop();
                if (imageType && image_extensions.includes(imageType)) {
                    console.log('exporting image ', pathName, dir[i], path + '/' + dir[i]);
                    files.push(path + '/' + dir[i]);
                }
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7:
                if (files.length == 0) {
                    // console.log("No files to export in ", path);
                    return [2 /*return*/];
                }
                fileExtension = '.dart';
                getImageVariableName = function (file) { var _a, _b; return (_b = (_a = file.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]) !== null && _b !== void 0 ? _b : ''; };
                newFilePath = "".concat(path, "/_").concat(pathName, "Files").concat(fileExtension);
                content = files.map(function (e) { return "static const String ".concat(camelCase(getImageVariableName(e)), " = \"").concat(e, "\";\n"); }).join('');
                className = capitalize(pathName !== null && pathName !== void 0 ? pathName : '');
                classContent = "\nclass Local".concat(className, " {\n").concat(content, "\n}");
                if (doesFileNeedChange(newFilePath, content) === false) {
                    // console.log("No change required");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, fs_1.default.writeFile(newFilePath, classContent, function (_) { return _; })];
            case 8:
                _a.sent();
                console.log('exported --> ', newFilePath);
                return [2 /*return*/, "./".concat(pathName, "/_").concat(pathName, "Files").concat(fileExtension)];
        }
    });
}); };
var statExport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _, __, path, args, force, watch;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = process.argv, _ = _a[0], __ = _a[1], path = _a[2], args = _a.slice(3);
                if (path === "-v" || path === "--version") {
                    return [2 /*return*/, console.log('Dart Export version ', version)];
                }
                if (!path)
                    return [2 /*return*/, console.log("No Path Provider")];
                force = (_b = args.find(function (e) { return e === "-f"; })) !== null && _b !== void 0 ? _b : '';
                watch = (_c = args.find(function (e) { return e === "-w"; })) !== null && _c !== void 0 ? _c : '';
                console.log("Exporting");
                console.log('export from: ', path);
                return [4 /*yield*/, exportAll(path, force)];
            case 1:
                _d.sent();
                if (watch) {
                    console.log('Watching Directory for changes');
                    fs_1.default.watch(path, { recursive: true, persistent: true }, function (event, file) {
                        // console.log("Event: ", event, ". File: ", file);
                        exportAll(path, force);
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
statExport();
function camelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1).replace(/[-_](.)/g, function (_, c) { return c.toUpperCase(); });
}
