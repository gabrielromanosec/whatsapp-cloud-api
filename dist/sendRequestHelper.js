"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestHelper = void 0;
const axios_1 = __importDefault(require("axios"));
const sendRequestHelper = (fromPhoneNumberId, accessToken, version = 'v14.0') => async (data) => {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { data: rawResult } = await (0, axios_1.default)({
            method: 'post',
            url: `https://graph.facebook.com/${version}/${fromPhoneNumberId}/messages`,
            data,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = rawResult;
        return {
            messageId: (_b = (_a = result.messages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id,
            phoneNumber: (_d = (_c = result.contacts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.input,
            whatsappId: (_f = (_e = result.contacts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.wa_id,
        };
    }
    catch (err) {
        if (err.response) {
            throw (_g = err === null || err === void 0 ? void 0 : err.response) === null || _g === void 0 ? void 0 : _g.data;
        }
        else if (err instanceof Error) {
            throw err.message;
        }
        else {
            throw err;
        }
    }
};
exports.sendRequestHelper = sendRequestHelper;
//# sourceMappingURL=sendRequestHelper.js.map