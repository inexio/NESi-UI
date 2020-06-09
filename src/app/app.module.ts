import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";

import { NzMenuModule } from "ng-zorro-antd/menu";
import { DevicesComponent } from "./pages/devices/devices.component";
import { HomeComponent } from "./pages/home/home.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { SubrackComponent } from "./pages/subrack/subrack.component";
import { DeviceComponent } from "./pages/device/device.component";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzListModule } from "ng-zorro-antd/list";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { CodeCopyDirective } from "./core/directives/code-copy/code-copy.directive";
import { HidePasswordDirective } from "./core/directives/hide-password/hide-password.directive";
import { TerminalComponent } from "./pages/terminal/terminal.component";
import { CardComponent } from './pages/card/card.component';

@NgModule({
    declarations: [
        AppComponent,
        DevicesComponent,
        HomeComponent,
        SubrackComponent,
        DeviceComponent,
        CodeCopyDirective,
        HidePasswordDirective,
        TerminalComponent,
        CardComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        NzButtonModule,
        NzMenuModule,
        NzIconModule,
        NzDividerModule,
        NzModalModule,
        NzMessageModule,
        NzListModule,
        NzInputModule,
        NzBreadCrumbModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
