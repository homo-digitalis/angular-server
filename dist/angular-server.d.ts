export declare class AngularServer {
    private readonly expressApp;
    private info;
    private httpsServer;
    private options;
    constructor(relativePathToAssets: string);
    start(certificatesFileName: string): string;
}
