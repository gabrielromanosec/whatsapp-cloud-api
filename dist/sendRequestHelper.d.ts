export interface SendMessageResult {
    messageId: string;
    phoneNumber: string;
    whatsappId: string;
}
export declare const sendRequestHelper: (fromPhoneNumberId: string, accessToken: string, version?: string) => <T>(data: T) => Promise<SendMessageResult>;
