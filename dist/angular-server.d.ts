export declare class AngularServer {
    private readonly expressApp;
    private info;
    private httpServer;
    private httpsServer;
    private options;
    constructor(relativePathToAssets: string);
    start(port: number): string;
}
