/// <reference types="node" />
import { Application } from 'express';
import { Server } from 'http';
export interface ServerOptions {
    app?: Application;
    useMiddleware?: (app: Application) => void;
    port?: number;
    webhookPath?: string;
    webhookVerifyToken?: string;
}
export interface ExpressServer {
    server?: Server;
    app: Application;
}
export declare const startExpressServer: (options?: ServerOptions) => Promise<ExpressServer>;
