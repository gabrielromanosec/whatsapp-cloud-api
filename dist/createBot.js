"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = void 0;
const isURL_1 = __importDefault(require("validator/lib/isURL"));
const pubsub_js_1 = __importDefault(require("pubsub-js"));
const sendRequestHelper_1 = require("./sendRequestHelper");
const startExpressServer_1 = require("./startExpressServer");
const payloadBase = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
};
const createBot = (fromPhoneNumberId, accessToken, opts) => {
    let expressServer;
    const sendRequest = (0, sendRequestHelper_1.sendRequestHelper)(fromPhoneNumberId, accessToken, opts === null || opts === void 0 ? void 0 : opts.version);
    const getMediaPayload = (urlOrObjectId, options) => ({
        ...((0, isURL_1.default)(urlOrObjectId) ? { link: urlOrObjectId } : { id: urlOrObjectId }),
        caption: options === null || options === void 0 ? void 0 : options.caption,
        filename: options === null || options === void 0 ? void 0 : options.filename,
    });
    return {
        startExpressServer: async (options) => {
            if (!expressServer) {
                expressServer = await (0, startExpressServer_1.startExpressServer)(options);
            }
            return expressServer;
        },
        on: (event, cb) => {
            pubsub_js_1.default.subscribe(event, (_, data) => cb(data));
        },
        sendText: (to, text, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'text',
            text: {
                body: text,
                preview_url: options === null || options === void 0 ? void 0 : options.preview_url,
            },
        }),
        sendMessage(to, text, options) {
            return this.sendText(to, text, options);
        },
        sendImage: (to, urlOrObjectId, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'image',
            image: getMediaPayload(urlOrObjectId, options),
        }),
        sendDocument: (to, urlOrObjectId, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'document',
            document: getMediaPayload(urlOrObjectId, options),
        }),
        sendAudio: (to, urlOrObjectId) => sendRequest({
            ...payloadBase,
            to,
            type: 'audio',
            audio: getMediaPayload(urlOrObjectId),
        }),
        sendVideo: (to, urlOrObjectId, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'video',
            video: getMediaPayload(urlOrObjectId, options),
        }),
        sendSticker: (to, urlOrObjectId) => sendRequest({
            ...payloadBase,
            to,
            type: 'sticker',
            sticker: getMediaPayload(urlOrObjectId),
        }),
        sendLocation: (to, latitude, longitude, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'location',
            location: {
                latitude,
                longitude,
                name: options === null || options === void 0 ? void 0 : options.name,
                address: options === null || options === void 0 ? void 0 : options.address,
            },
        }),
        sendTemplate: (to, name, languageCode, components) => sendRequest({
            ...payloadBase,
            to,
            type: 'template',
            template: {
                name,
                language: {
                    code: languageCode,
                },
                components,
            },
        }),
        sendContacts: (to, contacts) => sendRequest({
            ...payloadBase,
            to,
            type: 'contacts',
            contacts,
        }),
        sendReplyButtons: (to, bodyText, buttons, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'interactive',
            interactive: {
                body: {
                    text: bodyText,
                },
                ...((options === null || options === void 0 ? void 0 : options.footerText)
                    ? {
                        footer: { text: options === null || options === void 0 ? void 0 : options.footerText },
                    }
                    : {}),
                header: options === null || options === void 0 ? void 0 : options.header,
                type: 'button',
                action: {
                    buttons: Object.entries(buttons).map(([key, value]) => ({
                        type: 'reply',
                        reply: {
                            title: value,
                            id: key,
                        },
                    })),
                },
            },
        }),
        sendList: (to, buttonName, bodyText, sections, options) => sendRequest({
            ...payloadBase,
            to,
            type: 'interactive',
            interactive: {
                body: {
                    text: bodyText,
                },
                ...((options === null || options === void 0 ? void 0 : options.footerText)
                    ? {
                        footer: { text: options === null || options === void 0 ? void 0 : options.footerText },
                    }
                    : {}),
                header: options === null || options === void 0 ? void 0 : options.header,
                type: 'list',
                action: {
                    button: buttonName,
                    sections: Object.entries(sections).map(([key, value]) => ({
                        title: key,
                        rows: value,
                    })),
                },
            },
        }),
    };
};
exports.createBot = createBot;
//# sourceMappingURL=createBot.js.map