import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { CoreService } from "../services/core/core.service";
import { map, catchError } from "rxjs/operators";
import * as moment from "moment";
import { NzNotificationModule, NzNotificationService } from "ng-zorro-antd/notification";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    // Number of how many Requests have been made
    private requestCount: number = 0;

    constructor(private auth: AuthService, private core: CoreService, private notification: NzNotificationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Set `requestPending` to true inside of Core Service
        this.core.requestPending = true;

        // Save request start moment
        const requestStart = moment();

        // Clone Request and attach headers
        const req = request.clone({
            url: this.auth.credentials ? `${this.auth.credentials.requestUrl}/softboxen/v1/${request.url}` : request.urlWithParams,
            headers: this.auth.credentials && this.auth.credentials.auth.enabled ? this.auth.credentials.requestHeaders : request.headers,
        });

        // Return Request and Handle Response
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // Set `requestPending` to false inside of Core Service
                    this.core.requestPending = false;

                    // Increment Request count by 1
                    this.requestCount++;

                    // Log success message in console
                    console.log(
                        `‣ ${req.method} %c/${req.urlWithParams.split("/")[req.urlWithParams.split("/").length - 1]}%c (${event.status} ${
                            event.statusText
                        }) ${moment().diff(requestStart)}ms`,
                        "font-weight: 700; text-decoration: underline;",
                        "font-weight: normal",
                    );
                }

                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // Set `requestPending` to false inside of Core Service
                this.core.requestPending = false;

                // Get request path from full URL
                const path = request.url.split("/")[request.url.split("/").length - 1];

                // Log error message in console
                console.log(
                    `‣ ${req.method} %c/${req.urlWithParams.split("/")[req.urlWithParams.split("/").length - 1]}%c (${error.status} ${
                        error.statusText
                    }) ${moment().diff(requestStart)}ms`,
                    "font-weight: 700; text-decoration: underline;",
                    "font-weight: normal",
                );

                // Different handling for client side requests
                if (error.error instanceof ErrorEvent) {
                    this.notification.create("error", "Error making request. (Client Side)", error.error.message);
                    return throwError(error.error.message);
                } else {
                    this.notification.create(
                        "error",
                        `Error making ${request.method} request.`,
                        `${request.method} request <span class="code">/${path}</span> failed with error code ${error.status}.`,
                        {
                            nzDuration: 0, // Doesn't disappear until user clicks it away
                        },
                    );
                    return throwError(`Response Status ${error.status}: ${error.message}`);
                }
            }),
        );
    }
}
