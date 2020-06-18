import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const req = request.clone({
            url: `${this.auth.credentials.requestUrl}/softboxen/v1/${request.url}`,
            headers: this.auth.credentials.requestHeaders,
        });
        return next.handle(req);
    }
}
