import { Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { AppConfig } from "../environments/environment";
import { AuthService } from "./core/services/auth/auth.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    constructor(public electronService: ElectronService, private auth: AuthService) {
        console.log("AppConfig", AppConfig);

        if (electronService.isElectron) {
            console.log(process.env);
            console.log("Mode electron");
            console.log("Electron ipcRenderer", electronService.ipcRenderer);
            console.log("NodeJS childProcess", electronService.childProcess);
        } else {
            console.log("Mode web");
        }

        this.auth.getStoredCredentials().subscribe({
            next: (credentials) => {
                console.log("🔒 Found stored Credentials");
                this.auth.credentials = credentials;
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}
