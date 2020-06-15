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
import { SubrackComponent } from "./pages/devices/subrack/subrack.component";
import { DeviceComponent } from "./pages/devices/device/device.component";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzListModule } from "ng-zorro-antd/list";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { CodeCopyDirective } from "./core/directives/code-copy/code-copy.directive";
import { HidePasswordDirective } from "./core/directives/hide-password/hide-password.directive";
import { TerminalComponent } from "./pages/devices/terminal/terminal.component";
import { CardComponent } from "./pages/devices/card/card.component";
import { NzAffixModule } from "ng-zorro-antd/affix";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { PortComponent } from "./pages/devices/port/port.component";
import { OntComponent } from "./pages/devices/ont/ont.component";
import { OntPortComponent } from "./pages/devices/ont-port/ont-port.component";
import { CpeComponent } from "./pages/devices/cpe/cpe.component";
import { CpePortComponent } from "./pages/devices/cpe-port/cpe-port.component";
import { VlanComponent } from "./pages/devices/vlan/vlan.component";
import { VlanConnectionComponent } from "./pages/devices/vlan-connection/vlan-connection.component";
import { PortProfileComponent } from "./pages/devices/port-profile/port-profile.component";
import { PortProfileConnectionComponent } from "./pages/devices/port-profile-connection/port-profile-connection.component";
import { DeviceListComponent } from "./pages/devices/device-list/device-list.component";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { PlaceholderWidthDirective } from "./core/directives/placeholder-width/placeholder-width.directive";

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
        PortComponent,
        OntComponent,
        OntPortComponent,
        CpeComponent,
        CpePortComponent,
        VlanComponent,
        VlanConnectionComponent,
        PortProfileComponent,
        PortProfileConnectionComponent,
        DeviceListComponent,
        PlaceholderWidthDirective,
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
        NzBreadCrumbModule,
        NzAffixModule,
        NzPageHeaderModule,
        NzSkeletonModule,
        NzToolTipModule,
        NzInputModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
