import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Credentials } from "../../interfaces/credentials.interface";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    /**
     * Credentials object retrieved from LocalStorage
     */
    public credentials: Credentials;

    /**
     * Checks for Credentials object stored inside localStorage
     */
    public getStoredCredentials(): Observable<Credentials> {
        return new Observable((subscriber) => {
            let credentials: string = localStorage.getItem("credentials");

            if (credentials) {
                try {
                    const parsed: Credentials = JSON.parse(credentials);

                    this.credentials = parsed;
                    this.credentials.requestUrl = `${parsed.protocol}://${parsed.host}:${parsed.port}`;
                    this.credentials.requestHeaders = new HttpHeaders().append(
                        "Authorization",
                        `Basic ${btoa(`${parsed.auth.username}:${parsed.auth.password}`)}`,
                    );

                    console.log("🔐 Found `credentials` item in localStorage");
                    subscriber.next(parsed);
                    subscriber.complete();
                } catch (error) {
                    console.error("Error parsing `credentials` item from localStorage");
                    subscriber.error(error);
                    subscriber.complete();
                }
            } else {
                console.warn("🔒 No `credentials` item found in localStorage");
                subscriber.error();
                subscriber.complete();
            }
        });
    }
}
