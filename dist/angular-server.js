"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
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
    start(certificatesFileName) {
        try {
            this.options = new https_provider_1.HTTPSProvider(certificatesFileName).provideHTTPSOptions();
            this.httpsServer = https.createServer(this.options, this.expressApp);
            this.httpsServer.listen(443);
            this.info = "HTTPS Server is listening or port 443";
            this.expressApp.use("/*", require("redirect-https")({
                body: "<!-- Hello Mr Developer! Please use HTTPS instead -->",
            }));
        }
        catch (error) {
            this.info = `certificates? \n${error}`;
        }
        return this.info;
    }
}
exports.AngularServer = AngularServer;
const hdPath = (process.env.HD_PATH === undefined) ?
    "../chat-frontend" :
    process.env.HD_PATH;
const nameOfCertificatesFile = "angular-server-certificate";
const angularServer = new AngularServer(hdPath);
// tslint:disable-next-line:no-console
console.log(angularServer.start(nameOfCertificatesFile));
