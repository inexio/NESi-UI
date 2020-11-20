import { Component } from "@angular/core";
import { AuthService } from "./core/services/auth/auth.service";
import { CoreService } from "./core/services/core/core.service";

import { buildInfo } from "../build";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    constructor(public core: CoreService, public auth: AuthService) {
        // Print Repository link
        console.log("\n%cGitHub Repository:%c\nhttps://github.com/inexio/nesi-ui\n", "font-weight: 700;", "font-weight: unset;");

        // Print Support link
        console.log("\n%cIssues/Support:%c\nhttps://github.com/inexio/nesi-ui/issues\n", "font-weight: 700;", "font-weight: unset;");

        // Print basic App information
        console.log(
            `\n%cApp Information:%c\n ‣  Running ${core.isElectron ? "on Desktop" : "in Browser"}\n ‣  Version: ${
                buildInfo.version
            } (package.json)\n ‣  Commit Hash: ${buildInfo.hash}\n ‣  Build Note: ${buildInfo.message}\n`,
            "font-weight: 700;",
            "font-weight: unset;",
        );

        // Get Credentials from localStorage
        this.auth.getStoredCredentials().subscribe({
            next: (credentials) => {
                this.auth.credentials = credentials;
                // @ts-ignore
                achorn.success("Found `credentials` item in localStorage");
                // @ts-ignore
                achorn.info(credentials);
            },
            error: (error) => {
                // @ts-ignore
                achorn.warn(error);
            },
        });
    }
}
