import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { CoreService } from "../services/core/core.service";
import { map, catchError } from "rxjs/operators";
import { NzNotificationService } from "ng-zorro-antd/notification";

import Achorn from "achorn";
const achorn = new Achorn();

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    // Number of how many Requests have been made
    private requestCount: number = 0;

    constructor(private auth: AuthService, private core: CoreService, private notification: NzNotificationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Set `requestPending` to true inside of Core Service
        this.core.requestPending = true;

        // Get last part of request path
        const path = `/${request.url.split("/")[request.url.split("/").length - 1]}`;

        // Create achorn timer to track request duration
        const timer = achorn.timer({
            key: `${path}`,
            silent: true,
        });

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

                    // Log success message
                    timer.success(`${req.method} ${path} successful`);
                }

                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // Set `requestPending` to false inside of Core Service
                this.core.requestPending = false;

                // Log error message
                timer.error(`${req.method} ${path} failed`);
                // @ts-ignore
                achorn.error(error);

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
