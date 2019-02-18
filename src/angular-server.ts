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

    public start(port: number): string {

        if (port === 443) {
            try {
                this.options = new HTTPSProvider("angular-server-certificate").provideHTTPSOptions()
                this.httpsServer = https.createServer(this.options, this.expressApp)
                this.httpsServer.listen(port)
                this.info = `HTTPS Server is listening or port ${port}`

                this.expressApp.use("/*", require("redirect-https")({
                    body: "<!-- Hello Mr Developer! Please use HTTPS instead -->",
                }))

            } catch (error) {
                this.info = "certificates?"
            }

        } else {
            this.httpServer = http.createServer(this.expressApp)
            this.httpServer.listen(port)
            this.info = `HTTP Server is listening or port ${port}`
        }

        return this.info
    }

}

const angularServerPort: number = (process.env.PORT === undefined) ?
    Number(process.argv[2]) :
    Number(process.env.CHAT_SERVER_PORT)

const hdPath: string = (process.env.HD_PATH === undefined) ?
    "../dist/chat-frontend" :
    process.env.HD_PATH

const angularServer: AngularServer = new AngularServer(hdPath)

// tslint:disable-next-line:no-console
console.log(angularServer.start(angularServerPort))
