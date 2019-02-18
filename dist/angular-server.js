"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const https = require("https");
const https_provider_1 = require("https-provider");
const path = require("path");
class AngularServer {
    constructor(relativePathToAssets) {
        this.expressApp = express();
        this.info = "";
        const completePathToAssets = path.join(__dirname, relativePathToAssets);
        this.expressApp.use(express.static(completePathToAssets));
        this.expressApp.get("/*", (req, res) => {
            res.sendFile(`${completePathToAssets}/index.html`);
        });
    }
    start(port) {
        if (port === 443) {
            try {
                this.options = new https_provider_1.HTTPSProvider("angular-server-certificate").provideHTTPSOptions();
                this.httpsServer = https.createServer(this.options, this.expressApp);
                this.httpsServer.listen(port);
                this.info = `HTTPS Server is listening or port ${port}`;
                this.expressApp.use("/*", require("redirect-https")({
                    body: "<!-- Hello Mr Developer! Please use HTTPS instead -->",
                }));
            }
            catch (error) {
                this.info = "certificates?";
            }
        }
        else {
            this.httpServer = http.createServer(this.expressApp);
            this.httpServer.listen(port);
            this.info = `HTTP Server is listening or port ${port}`;
        }
        return this.info;
    }
}
exports.AngularServer = AngularServer;
const angularServerPort = (process.env.PORT === undefined) ?
    Number(process.argv[2]) :
    Number(process.env.CHAT_SERVER_PORT);
const hdPath = (process.env.HD_PATH === undefined) ?
    "../dist/chat-frontend" :
    process.env.HD_PATH;
const angularServer = new AngularServer(hdPath);
// tslint:disable-next-line:no-console
console.log(angularServer.start(angularServerPort));
