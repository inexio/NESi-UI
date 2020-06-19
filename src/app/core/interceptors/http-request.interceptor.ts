import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { CoreService } from "../services/core/core.service";
import { map, delay } from "rxjs/operators";
import * as moment from "moment";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    // Number of how many Requests have been made
    private requestCount: number = 0;

    constructor(private auth: AuthService, private core: CoreService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Set `requestPending` to true inside of Core Service
        this.core.requestPending = true;

        // Save request start moment
        const requestStart = moment();

        // Clone Request and attach headers
        const req = request.clone({
            url: `${this.auth.credentials.requestUrl}/softboxen/v1/${request.url}`,
            headers: this.auth.credentials.requestHeaders,
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
                    if (event.status.toString().startsWith("1") || event.status.toString().startsWith("2")) {
                        console.log(
                            `✅ | #${this.requestCount} %c${req.method}%c | \`/${
                                req.urlWithParams.split("/")[req.urlWithParams.split("/").length - 1]
                            }\` (${event.status}) ${moment().diff(requestStart)}ms`,
                            "font-weight: 700;",
                            "font-weight: normal",
                        );
                    }

                    if (event.status.toString().startsWith("3")) {
                        console.warn(
                            `⚡ | #${this.requestCount} %c${req.method}%c | \`/${
                                req.urlWithParams.split("/")[req.urlWithParams.split("/").length - 1]
                            }\` (${event.status}) ${moment().diff(requestStart)}ms`,
                            "font-weight: 700;",
                            "font-weight: normal",
                        );
                    }

                    if (event.status.toString().startsWith("4") || event.status.toString().startsWith("5")) {
                        console.error(
                            `🚨 | #${this.requestCount} %c${req.method}%c | \`/${
                                req.urlWithParams.split("/")[req.urlWithParams.split("/").length - 1]
                            }\` (${event.status}) ${moment().diff(requestStart)}ms`,
                            "font-weight: 700;",
                            "font-weight: normal",
                        );
                    }
                }

                return event;
            }),
        );
    }
}
