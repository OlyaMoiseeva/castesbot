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
        while (_) try {
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
exports.__esModule = true;
var assert_1 = require("assert");
var functions = require('firebase-functions');
// import TelegramBot from 'node-telegram-bot-api'
var TelegramBot = require('node-telegram-bot-api');
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
// const token = '5780792588:AAFEoBVcHFueb6M2AAfCXIB59nfSy2yrVko'
var bot = new TelegramBot(functions.config().telegrambot.key, { polling: true });
var serviceAccount = require('./castesbot-firebase-adminsdk-hnt76-b2852e49a7');
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount)
});
var db = (0, firestore_1.getFirestore)();
var casteSelector = [
    [
        {
            text: 'Хрюки',
            callback_data: 'casteSelector&hryu'
        }
    ],
    [
        {
            text: 'Вуфчики',
            callback_data: 'casteSelector&wouf'
        }
    ],
    [
        {
            text: 'Мышачи',
            callback_data: 'casteSelector&pi'
        }
    ],
    [
        {
            text: 'Мяки',
            callback_data: 'casteSelector&myak'
        }
    ]
];
var products = {
    1: {
        text: 'Котлеты из мышей',
        callback_data: 'products&fromPi'
    },
    2: {
        text: 'Котлеты из лягушек',
        callback_data: 'products&fromKva'
    },
    3: {
        text: 'Котлеты из мяков',
        callback_data: 'products&fromMyak'
    },
    4: {
        text: 'Котлеты из вуфелов',
        callback_data: 'products&fromWouf'
    },
    5: {
        text: 'Какие-то таблетки',
        callback_data: 'products&unknownPills'
    },
    6: {
        text: 'Какое-то зелье',
        callback_data: 'products&unknownDrink'
    },
    7: {
        text: 'Кошачья мята',
        callback_data: 'products&catGrace'
    },
    8: {
        text: 'Хорошие таблетки',
        callback_data: 'products&goodPills'
    },
    9: {
        text: 'Зелье опыта',
        callback_data: 'products&experienceDrink'
    },
    10: {
        text: 'Таинственная книга',
        callback_data: 'products&book'
    }
};
function getCaption(code) {
    var captions = {
        hryu: {
            nom: 'хрюк',
            acc: 'хрюга'
        },
        pi: {
            nom: 'мышач',
            acc: 'мышача'
        },
        wouf: {
            nom: 'вуфчик',
            acc: 'вуфела'
        },
        myak: {
            nom: 'мяк',
            acc: 'мяка'
        }
    };
    return captions[code];
}
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userRef, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, assert_1.ok)(userId);
                    userRef = db.collection('users').doc(userId === null || userId === void 0 ? void 0 : userId.toString());
                    return [4 /*yield*/, userRef.get()];
                case 1:
                    doc = _a.sent();
                    if (doc.exists) {
                        return [2 /*return*/, doc.data()];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function getChat(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var chatRef, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, assert_1.ok)(chatId);
                    chatRef = db.collection('chats').doc(chatId === null || chatId === void 0 ? void 0 : chatId.toString());
                    return [4 /*yield*/, chatRef.get()];
                case 1:
                    doc = _a.sent();
                    if (doc.exists) {
                        return [2 /*return*/, doc.data()];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function addChat(chatId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var chatsRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatsRef = db.collection('chats').doc(chatId === null || chatId === void 0 ? void 0 : chatId.toString());
                    return [4 /*yield*/, chatsRef.set(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addUser(userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var chatsRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatsRef = db.collection('users').doc(userId === null || userId === void 0 ? void 0 : userId.toString());
                    return [4 /*yield*/, chatsRef.set(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateUser(userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userRef = db.collection('users').doc(userId === null || userId === void 0 ? void 0 : userId.toString());
                    return [4 /*yield*/, userRef.update(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateChat(chatId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var chatRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatRef = db.collection('chats').doc(chatId === null || chatId === void 0 ? void 0 : chatId.toString());
                    return [4 /*yield*/, chatRef.update(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function getInfoText(character) {
    return "\u0418\u043C\u044F: ".concat(character.name, " \n\u0423\u0440\u043E\u0432\u0435\u043D\u044C: ").concat(character.level, " \n\u041E\u043F\u044B\u0442:").concat(character.experience, "/").concat(character.level * 10, " \n\u0417\u0434\u043E\u0440\u043E\u0432\u044C\u0435: ").concat(character.health, " \n\u0417\u0432\u0435\u0440\u0438\u043D\u044B\u0435 \u0431\u0430\u043B\u043B\u044B: ").concat(character.money);
}
function onMessage(msg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var chatId, userId, chat, user, data, img, command, menu, text, name_1, market, userReplyTo, health, experience, level;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    chatId = msg.chat.id;
                    userId = (_a = msg === null || msg === void 0 ? void 0 : msg.from) === null || _a === void 0 ? void 0 : _a.id;
                    return [4 /*yield*/, getChat(chatId)];
                case 1:
                    chat = _l.sent();
                    return [4 /*yield*/, getUser(userId)];
                case 2:
                    user = _l.sent();
                    if (!!chat) return [3 /*break*/, 4];
                    return [4 /*yield*/, addChat(chatId, {
                            id: chatId
                        })];
                case 3:
                    chat = _l.sent();
                    _l.label = 4;
                case 4:
                    console.log('chat', chat);
                    if (!(!user && msg.from && userId)) return [3 /*break*/, 7];
                    data = {
                        id: msg.from.id,
                        name: msg.from.first_name,
                        surname: msg.from.last_name,
                        userName: msg.from.username,
                        isBot: msg.from.is_bot,
                        languageCode: msg.from.language_code,
                        chatId: chatId
                    };
                    return [4 /*yield*/, addUser(userId, data)];
                case 5:
                    _l.sent();
                    return [4 /*yield*/, getUser(userId)];
                case 6:
                    user = _l.sent();
                    _l.label = 7;
                case 7:
                    if (!(chat === null || chat === void 0 ? void 0 : chat.casteCode)) {
                        bot.sendMessage(chatId, 'Выбери звериную касту чата', {
                            reply_markup: {
                                inline_keyboard: casteSelector
                            }
                        });
                        return [2 /*return*/];
                    }
                    if (!(chat.casteCode && !(user === null || user === void 0 ? void 0 : user.character) && userId)) return [3 /*break*/, 9];
                    img = "./img/".concat(chat.casteCode, "/").concat(getRandomInt(1, 19), ".jpeg");
                    return [4 /*yield*/, updateUser(userId, {
                            character: {
                                health: 100,
                                level: 0,
                                img: img,
                                money: 0,
                                experience: 0,
                                name: "\u041A\u0430\u043A\u043E\u0439-\u0442\u043E ".concat(getCaption(chat.casteCode).nom)
                            }
                        })];
                case 8:
                    _l.sent();
                    bot.sendPhoto(chatId, img, { caption: "\u041B\u043E\u0432\u0438 \u0441\u0432\u043E\u0435\u0433\u043E ".concat(getCaption(chat.casteCode).acc, " \n\u0414\u0430\u0439 \u0435\u043C\u0443 \u0438\u043C\u044F \u043F\u0440\u0438 \u043F\u043E\u043C\u043E\u0449\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u044B: \n\u0438\u043C\u044F <\u0438\u043C\u044F \u0442\u0432\u043E\u0435\u0433\u043E ").concat(getCaption(chat.casteCode).acc, ">") });
                    return [2 /*return*/];
                case 9:
                    command = (_b = msg === null || msg === void 0 ? void 0 : msg.text) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase();
                    if (!((_c = user === null || user === void 0 ? void 0 : user.character) === null || _c === void 0 ? void 0 : _c.img)) return [3 /*break*/, 12];
                    if (command === 'инфо') {
                        bot.sendPhoto(chatId, (_d = user === null || user === void 0 ? void 0 : user.character) === null || _d === void 0 ? void 0 : _d.img, { caption: getInfoText(user === null || user === void 0 ? void 0 : user.character) });
                    }
                    if (command === 'меню') {
                        menu = [
                            [{
                                    text: 'На рынок',
                                    callback_data: 'на рынок'
                                }],
                            [{
                                    text: 'Найти работу',
                                    callback_data: 'найти работу'
                                }]
                        ];
                        bot.sendMessage(chatId, 'че', {
                            reply_markup: {
                                inline_keyboard: menu
                            }
                        });
                    }
                    if (!((command === null || command === void 0 ? void 0 : command.includes('имя')) && (msg === null || msg === void 0 ? void 0 : msg.text) && userId && ((_e = user === null || user === void 0 ? void 0 : user.character) === null || _e === void 0 ? void 0 : _e.name) === "\u041A\u0430\u043A\u043E\u0439-\u0442\u043E ".concat(getCaption(chat.casteCode).nom))) return [3 /*break*/, 11];
                    text = msg.text[0] + msg.text.substring(1);
                    name_1 = (_f = msg === null || msg === void 0 ? void 0 : msg.text) === null || _f === void 0 ? void 0 : _f.split('имя ')[1];
                    if (!name_1) return [3 /*break*/, 11];
                    return [4 /*yield*/, updateUser(userId, {
                            'character.name': name_1
                        })];
                case 10:
                    _l.sent();
                    bot.sendMessage(chatId, "\u0421\u0443\u043F\u0435\u0440, \u0442\u0435\u043F\u0435\u0440\u044C \u0442\u0432\u043E\u0435\u0433\u043E ".concat(getCaption(chat.casteCode).acc, " \u0437\u043E\u0432\u0443\u0442 ").concat(name_1));
                    _l.label = 11;
                case 11:
                    if (command === 'на рынок') {
                        market = [
                            [products[getRandomInt(1, 8)]],
                            [products[getRandomInt(1, 8)]],
                            [products[getRandomInt(1, 9)]],
                            [products[getRandomInt(1, 11)]],
                        ];
                        bot.sendMessage(chatId, 'На рынке сегодня', {
                            reply_markup: {
                                inline_keyboard: market
                            }
                        });
                    }
                    _l.label = 12;
                case 12:
                    if (!((msg === null || msg === void 0 ? void 0 : msg.reply_to_message) && userId)) return [3 /*break*/, 17];
                    return [4 /*yield*/, getUser((_h = (_g = msg === null || msg === void 0 ? void 0 : msg.reply_to_message) === null || _g === void 0 ? void 0 : _g.from) === null || _h === void 0 ? void 0 : _h.id)];
                case 13:
                    userReplyTo = _l.sent();
                    if (!(command === 'дыдыщ' && (user === null || user === void 0 ? void 0 : user.character))) return [3 /*break*/, 17];
                    if (!(userReplyTo === null || userReplyTo === void 0 ? void 0 : userReplyTo.character)) return [3 /*break*/, 16];
                    health = userReplyTo.character.health - 10 > 0
                        ? userReplyTo.character.health - 10
                        : 0;
                    return [4 /*yield*/, updateUser(userReplyTo.id, {
                            'character.health': health
                        })];
                case 14:
                    _l.sent();
                    experience = user.character.experience += 1 === user.character.level * 10
                        ? 0
                        : user.character.experience += 1;
                    level = experience
                        ? user.character.level
                        : user.character.level += 1;
                    console.log(level, userId);
                    return [4 /*yield*/, updateUser(userId, {
                            'character.experience': experience,
                            'character.level': level
                        })];
                case 15:
                    _l.sent();
                    bot.sendMessage(chatId, "\u041A\u0430\u0436\u0435\u0442\u0441\u044F ".concat(userReplyTo.character.name, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u0430\u0441\u043B\u0443\u0433\u0430\u043C"));
                    return [3 /*break*/, 17];
                case 16:
                    bot.sendMessage(chatId, "\u0423 ".concat((_k = (_j = msg === null || msg === void 0 ? void 0 : msg.reply_to_message) === null || _j === void 0 ? void 0 : _j.from) === null || _k === void 0 ? void 0 : _k.first_name, " \u0435\u0449\u0435 \u043D\u0435\u0442 \u0437\u0432\u0435\u0440\u044E\u0433\u0438"));
                    _l.label = 17;
                case 17: return [2 /*return*/];
            }
        });
    });
}
bot.on('message', onMessage);
exports.bot = functions.https.onRequest(function (req, res) {
    bot.handleUpdate(req.body, res);
});
exports.echoBot = functions.https.onRequest(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                functions.logger.log('Incoming message', request.body);
                return [4 /*yield*/, onMessage(request.body)];
            case 1:
                result = _a.sent();
                functions.logger.log('Result', result);
                return [2 /*return*/, response.sendStatus(200)];
        }
    });
}); });
bot.on('callback_query', function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, chat, dataArr, type, data, button;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                chatId = (_a = query === null || query === void 0 ? void 0 : query.message) === null || _a === void 0 ? void 0 : _a.chat.id;
                console.log(query, (_b = query === null || query === void 0 ? void 0 : query.message) === null || _b === void 0 ? void 0 : _b.reply_markup);
                return [4 /*yield*/, getChat(chatId)];
            case 1:
                chat = _d.sent();
                if (!query.data) return [3 /*break*/, 5];
                dataArr = (_c = query.data) === null || _c === void 0 ? void 0 : _c.split('&');
                type = dataArr[0];
                data = dataArr[1];
                if (!(type === 'casteSelector' && chatId)) return [3 /*break*/, 4];
                button = casteSelector.find(function (element) { return element[0].callback_data === query.data; });
                if (!(button && !(chat === null || chat === void 0 ? void 0 : chat.casteCode))) return [3 /*break*/, 3];
                return [4 /*yield*/, updateChat(chatId, {
                        title: button[0].text,
                        casteCode: data
                    })];
            case 2:
                _d.sent();
                bot.sendMessage(chatId, "\u0423\u0440\u0430, \u0442\u0435\u043F\u0435\u0440\u044C \u0442\u0443\u0442 \u0436\u0438\u0432\u0443\u0442 ".concat(button[0].text, "!!"));
                return [3 /*break*/, 4];
            case 3:
                bot.sendMessage(chatId, 'Каста уже выбрана(');
                _d.label = 4;
            case 4:
                if (type === 'products' && chatId) {
                    bot.sendMessage(chatId, 'Нет звериных балов(');
                }
                _d.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.on('polling_error', function (error) { return console.log(error); });
