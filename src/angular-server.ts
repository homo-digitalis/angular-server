import * as express from "express"
import * as http from "http"
import * as https from "https"
import { HTTPSProvider } from "https-provider"
import * as path from "path"

export class AngularServer {

    private readonly expressApp: any = express()
    private info: string = ""
    private httpServer: any
    private httpsServer: any
    private options: any

    public constructor(relativePathToAssets: string) {
        const completePathToAssets: string = path.join(__dirname, relativePathToAssets)
        this.expressApp.use(express.static(completePathToAssets))
        this.expressApp.get("/*", (req: express.Request, res: express.Response) => {
            res.sendFile(`${completePathToAssets}/index.html`)
        })

    }

    public start(port: number, certificatesFileName: string): string {

        if (port === 443) {
            try {
                this.options = new HTTPSProvider(certificatesFileName).provideHTTPSOptions()
                this.httpsServer = https.createServer(this.options, this.expressApp)
                this.httpsServer.listen(port)
                this.info = `HTTPS Server is listening or port ${port}`

                this.expressApp.use("/*", require("redirect-https")({
                    body: "<!-- Hello Mr Developer! Please use HTTPS instead -->",
                }))

            } catch (error) {
                this.info = `certificates? \n${error}`
            }

        } else if (port >= 3000 && port < 8500) {
            this.httpServer = http.createServer(this.expressApp)
            this.httpServer.listen(port)
            this.info = `HTTP Server is listening or port ${port}`
        } else {
            this.info = `strange port: ${port}`
        }

        return this.info
    }

}

const angularServerPort: number = 443

const hdPath: string = (process.env.HD_PATH === undefined) ?
    "../chat-frontend" :
    process.env.HD_PATH

const nameOfCertificatesFile: string = (process.env.NAMEOF_CERT_FILE === undefined) ?
    "angular-server-certificate" :
    process.env.NAMEOF_CERT_FILE

const angularServer: AngularServer = new AngularServer(hdPath)

// tslint:disable-next-line:no-console
console.log(angularServer.start(angularServerPort, nameOfCertificatesFile))
