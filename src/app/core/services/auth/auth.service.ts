import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Credentials } from "../../interfaces/credentials.interface";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { delay, map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    /**
     * Credentials object retrieved from LocalStorage
     */
    public credentials: Credentials;

    constructor(private http: HttpClient) {}

    /**
     * Check localStorage for `credentials` object
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

                    subscriber.next(parsed);
                    subscriber.complete();
                } catch (error) {
                    subscriber.error("Error parsing `credentials` item from localStorage");
                    subscriber.complete();
                }
            } else {
                subscriber.error("🔒 No `credentials` item found in localStorage");
                subscriber.complete();
            }
        });
    }

    /**
     * Make an example request to check given Credentials
     * @param credentials Credentils object to perform test request with
     */
    public checkCredentials(credentials: Credentials): Observable<Credentials> {
        return this.http
            .get<any>(`${credentials.protocol}://${credentials.host}:${credentials.port}/softboxen/v1/boxen`, {
                headers: new HttpHeaders().append(
                    "Authorization",
                    `Basic ${btoa(`${credentials.auth.username}:${credentials.auth.password}`)}`,
                ),
            })
            .pipe(
                delay(3000),
                map(() => {
                    return credentials;
                }),
            );
    }

    /**
     * Store given Credentials object inside of localStorage
     * @param credentials Credentials object to store in localStorage
     */
    public storeCredentials(credentials: Credentials): void {
        localStorage.setItem("credentials", JSON.stringify(credentials));
        this.getStoredCredentials().subscribe();
    }

    /**
     * Remove stored credentials from localStorage and AuthService
     */
    public removeCredentials(): void {
        localStorage.removeItem("credentials");
        this.credentials = null;
    }
}
