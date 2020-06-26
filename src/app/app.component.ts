import { Component } from "@angular/core";
import { AuthService } from "./core/services/auth/auth.service";
import { CoreService } from "./core/services/core/core.service";

import { buildInfo } from "../build";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    constructor(public core: CoreService, public auth: AuthService) {
        // Print App name
        console.log(
            "%c            __ _   _ \n           / _| | | |\n ___  ___ | |_| |_| |__   _____  __\n/ __|/ _ \\|  _| __| '_ \\ / _ \\ \\/ /\n\\__ \\ (_) | | | |_| |_) | (_) >  <\n|___/\\___/|_|  \\__|_.__/ \\___/_/\\_\\%c\n\n Do you know what you're doing? 👀\n",
            "font-weight: 700;",
            "font-weight: unset;",
        );

        // Print Repository link
        console.log("\n%cGitHub Repository:%c\nhttps://github.com/inexio/softbox-ui\n", "font-weight: 700;", "font-weight: unset;");

        // Print Support link
        console.log("\n%cIssues/Support:%c\nhttps://github.com/inexio/softbox-ui/issues\n", "font-weight: 700;", "font-weight: unset;");

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
                console.log("\n🔐 Found `credentials` item in localStorage\n", credentials);
            },
            error: (error) => {
                console.warn(error);
            },
        });
    }
}
