import { Component, OnInit } from "@angular/core";
import { Credentials } from "../../core/interfaces/credentials.interface";
import { RequestState } from "../../core/interfaces/request-state.type";
import { AuthService } from "../../core/services/auth/auth.service";
import { trigger, transition, query, style, stagger, animate } from "@angular/animations";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-credentials",
    templateUrl: "./credentials.component.html",
    styleUrls: ["./credentials.component.css"],
    animations: [
        trigger("fadeInOut", [
            transition(":enter", [
                style({ opacity: 0, transform: "translateY(100px)" }),
                animate("150ms 50ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
            ]),
            transition(":leave", [
                style({ opacity: 1, transform: "translateY(0)" }),
                animate("150ms ease-out", style({ opacity: 0, transform: "translateY(100px)" })),
            ]),
        ]),
    ],
})
export class CredentialsComponent {
    /**
     * Object containing credentials values
     */
    public credentialsForm: Credentials = {
        protocol: "https",
        host: "",
        port: "",
        auth: {
            enabled: false,
            type: "basic",
            username: "",
            password: "",
        },
    };

    /**
     * Boolean if the password input is censored
     */
    public passwordVisible: boolean = false;

    /**
     * State of the credentials check request
     */
    public checkRequest: RequestState = "idle";

    /**
     * Number showing the current step
     */
    public step: number = 0;

    constructor(public auth: AuthService) {}

    /**
     * Check given Credentials
     */
    public checkCredentials(): void {
        this.step = 3;
        this.checkRequest = "pending";
        this.auth.checkCredentials(this.credentialsForm).subscribe({
            next: (credentials) => {
                if (credentials) {
                    this.checkRequest = "success";

                    setTimeout(() => {
                        this.auth.storeCredentials(credentials);
                    }, 3000);
                } else {
                    this.checkRequest = "error";
                }
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.checkRequest = "error";
            },
        });
    }
}
