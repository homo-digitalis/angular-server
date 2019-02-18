import * as express from "express"
import * as https from "https"
import { HTTPSProvider } from "https-provider"
import * as path from "path"

export class AngularServer {

    private readonly expressApp: any = express()
    private info: string = ""
    private httpsServer: any
    private options: any

    public constructor(relativePathToAssets: string) {
        const completePathToAssets: string = path.join(__dirname, relativePathToAssets)
        this.expressApp.use(express.static(completePathToAssets))
        this.expressApp.get("/*", (req: express.Request, res: express.Response) => {
            res.sendFile(`${completePathToAssets}/index.html`)
        })

    }

    public start(certificatesFileName: string): string {

        try {
            this.options = new HTTPSProvider(certificatesFileName).provideHTTPSOptions()
            this.httpsServer = https.createServer(this.options, this.expressApp)
            this.httpsServer.listen(443)
            this.info = "HTTPS Server is listening or port 443"

            this.expressApp.use("/*", require("redirect-https")({
                body: "<!-- Hello Mr Developer! Please use HTTPS instead -->",
            }))

        } catch (error) {
            this.info = `certificates? \n${error}`
        }

        return this.info
    }

}

const hdPath: string = (process.env.HD_PATH === undefined) ?
    "../chat-frontend" :
    process.env.HD_PATH

const nameOfCertificatesFile: string = (process.env.NAMEOF_CERT_FILE === undefined) ?
    "angular-server-certificate" :
    process.env.NAMEOF_CERT_FILE

const angularServer: AngularServer = new AngularServer(hdPath)

// tslint:disable-next-line:no-console
console.log(angularServer.start(nameOfCertificatesFile))
