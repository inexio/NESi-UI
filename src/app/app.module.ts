import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
import { CardVisualComponent } from "./core/components/card-visual/card-visual.component";
import { SubrackVisualComponent } from "./core/components/subrack-visual/subrack-visual.component";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { OntVisualComponent } from "./core/components/ont-visual/ont-visual.component";
import { PortVisualComponent } from "./core/components/port-visual/port-visual.component";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { CpeVisualComponent } from "./core/components/cpe-visual/cpe-visual.component";
import { OntPortVisualComponent } from "./core/components/ont-port-visual/ont-port-visual.component";
import { DeviceVisualComponent } from "./core/components/device-visual/device-visual.component";
import { HttpRequestInterceptor } from "./core/interceptors/http-request.interceptor";
import { CredentialsComponent } from "./pages/credentials/credentials.component";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { EditPropertyComponent } from "./core/components/edit-property/edit-property.component";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { SettingsComponent } from "./pages/settings/settings.component";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { TerminalComponent } from "./pages/devices/terminal/terminal.component";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "./pages/devices/create/create.component";
import { SubrackCreateComponent } from "./core/components/subrack-create/subrack-create.component";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzSliderModule } from "ng-zorro-antd/slider";
import { CardCreateComponent } from "./core/components/card-create/card-create.component";
import { CpeCreateComponent } from "./core/components/cpe-create/cpe-create.component";
import { OntPortCreateComponent } from "./core/components/ont-port-create/ont-port-create.component";
import { OntCreateComponent } from "./core/components/ont-create/ont-create.component";
import { PortCreateComponent } from "./core/components/port-create/port-create.component";
import { CpePortCreateComponent } from "./core/components/cpe-port-create/cpe-port-create.component";
import { UserComponent } from "./pages/devices/user/user.component";
import { CredentialsCreateComponent } from "./core/components/credentials-create/credentials-create.component";
import { UserCreateComponent } from "./core/components/user-create/user-create.component";
import { MgmtCardVisualComponent } from "./core/components/mgmt-card-visual/mgmt-card-visual.component";
import { MgmtPortVisualComponent } from "./core/components/mgmt-port-visual/mgmt-port-visual.component";
import { MgmtCardComponent } from './pages/devices/mgmt-card/mgmt-card.component';
import { MgmtPortComponent } from './pages/devices/mgmt-port/mgmt-port.component';

@NgModule({
    declarations: [
        AppComponent,
        DevicesComponent,
        HomeComponent,
        SubrackComponent,
        DeviceComponent,
        CodeCopyDirective,
        HidePasswordDirective,
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
        CardVisualComponent,
        SubrackVisualComponent,
        OntVisualComponent,
        PortVisualComponent,
        CpeVisualComponent,
        OntPortVisualComponent,
        DeviceVisualComponent,
        CredentialsComponent,
        EditPropertyComponent,
        SettingsComponent,
        TerminalComponent,
        CreateComponent,
        SubrackCreateComponent,
        CardCreateComponent,
        CpeCreateComponent,
        OntPortCreateComponent,
        OntCreateComponent,
        PortCreateComponent,
        CpePortCreateComponent,
        UserComponent,
        CredentialsCreateComponent,
        UserCreateComponent,
        MgmtCardVisualComponent,
        MgmtPortVisualComponent,
        MgmtCardComponent,
        MgmtPortComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
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
        NzBadgeModule,
        NzSpaceModule,
        NzPopoverModule,
        NzCheckboxModule,
        NzSelectModule,
        NzTypographyModule,
        NzSwitchModule,
        NzAvatarModule,
        NzNotificationModule,
        NzAlertModule,
        NzSliderModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: HttpRequestInterceptor,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
