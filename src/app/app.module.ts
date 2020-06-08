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

@NgModule({
    declarations: [AppComponent, DevicesComponent, HomeComponent, SubrackComponent, DeviceComponent],
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
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
