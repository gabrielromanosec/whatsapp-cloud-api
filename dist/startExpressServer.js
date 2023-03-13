"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpressServer = void 0;
const express_1 = __importDefault(require("express"));
const pubsub_js_1 = __importDefault(require("pubsub-js"));
const pubSub_1 = require("./utils/pubSub");
const startExpressServer = (options) => new Promise((resolve) => {
    const app = (options === null || options === void 0 ? void 0 : options.app) || (0, express_1.default)();
    app.use(express_1.default.json());
    if (options === null || options === void 0 ? void 0 : options.useMiddleware) {
        options.useMiddleware(app);
    }
    const webhookPath = (options === null || options === void 0 ? void 0 : options.webhookPath) || '/webhook/whatsapp';
    if (options === null || options === void 0 ? void 0 : options.webhookVerifyToken) {
        app.get(webhookPath, (req, res) => {
            if (!req.query) {
                res.sendStatus(403);
                return;
            }
            const mode = req.query['hub.mode'];
            const verifyToken = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];
            if (!mode || !verifyToken || !challenge) {
                res.sendStatus(403);
                return;
            }
            if (mode === 'subscribe' && verifyToken === options.webhookVerifyToken) {
                console.log('✔️ Webhook verified');
                res.setHeader('content-type', 'text/plain');
                res.send(challenge);
                return;
            }
            res.sendStatus(403);
        });
    }
    app.post(webhookPath, async (req, res) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!req.body.object || !((_d = (_c = (_b = (_a = req.body.entry) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.changes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value)) {
            res.sendStatus(400);
            return;
        }
        if ((_k = (_j = (_h = (_g = (_f = (_e = req.body) === null || _e === void 0 ? void 0 : _e.entry) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.changes) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.value) === null || _k === void 0 ? void 0 : _k.statuses) {
            res.sendStatus(202);
            return;
        }
        const { from, id, timestamp, type, ...rest } = req.body.entry[0].changes[0].value.messages[0];
        let event;
        let data;
        switch (type) {
            case 'text':
                event = pubSub_1.PubSubEvents.text;
                data = { text: (_l = rest.text) === null || _l === void 0 ? void 0 : _l.body };
                break;
            case 'image':
            case 'document':
            case 'audio':
            case 'video':
            case 'sticker':
            case 'location':
            case 'contacts':
                event = pubSub_1.PubSubEvents[type];
                data = rest[type];
                break;
            case 'interactive':
                event = rest.interactive.type;
                data = {
                    ...(rest.interactive.list_reply || rest.interactive.button_reply),
                };
                break;
            default:
                break;
        }
        if (rest.context) {
            data = {
                ...data,
                context: rest.context,
            };
        }
        const name = (_q = (_p = (_o = (_m = req.body.entry[0].changes[0].value.contacts) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.profile) === null || _p === void 0 ? void 0 : _p.name) !== null && _q !== void 0 ? _q : undefined;
        if (event && data) {
            const payload = {
                from,
                name,
                id,
                timestamp,
                type: event,
                data,
            };
            ['message', event].forEach((e) => pubsub_js_1.default.publish(e, payload));
        }
        res.sendStatus(200);
    });
    if (options === null || options === void 0 ? void 0 : options.app) {
        resolve({ app });
        return;
    }
    const port = (options === null || options === void 0 ? void 0 : options.port) || 3000;
    const server = app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}...`);
        resolve({ server, app });
    });
});
exports.startExpressServer = startExpressServer;
//# sourceMappingURL=startExpressServer.js.map