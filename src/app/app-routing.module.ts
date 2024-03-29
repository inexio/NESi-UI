import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DevicesComponent } from "./pages/devices/devices.component";
import { DeviceComponent } from "./pages/devices/device/device.component";
import { SubrackComponent } from "./pages/devices/subrack/subrack.component";
import { CardComponent } from "./pages/devices/card/card.component";
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
import { SettingsComponent } from "./pages/settings/settings.component";
import { TerminalComponent } from "./pages/devices/terminal/terminal.component";
import { CreateComponent } from "./pages/devices/create/create.component";
import { UserComponent } from "./pages/devices/user/user.component";
import { MgmtCardComponent } from "./pages/devices/mgmt-card/mgmt-card.component";
import { MgmtPortVisualComponent } from "./core/components/mgmt-port-visual/mgmt-port-visual.component";
import { MgmtPortComponent } from "./pages/devices/mgmt-port/mgmt-port.component";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/devices",
    },
    {
        path: "devices",
        component: DevicesComponent,
        children: [
            {
                path: "",
                component: DeviceListComponent,
            },
            {
                path: "create",
                component: CreateComponent,
            },
            {
                path: ":id/terminal",
                component: TerminalComponent,
            },
            {
                path: ":id",
                component: DeviceComponent,
            },
            {
                path: ":id/user/:user",
                component: UserComponent,
            },
            {
                path: ":id/subrack/:subrack",
                component: SubrackComponent,
            },
            {
                path: ":id/card/:card",
                component: CardComponent,
            },
            {
                path: ":id/mgmt-card/:card",
                component: MgmtCardComponent,
            },
            {
                path: ":id/port/:port",
                component: PortComponent,
            },
            {
                path: ":id/mgmt-port/:port",
                component: MgmtPortComponent,
            },
            {
                path: ":id/ont/:ont",
                component: OntComponent,
            },
            {
                path: ":id/ont-port/:ontPort",
                component: OntPortComponent,
            },
            {
                path: ":id/cpe/:cpe",
                component: CpeComponent,
            },
            {
                path: ":id/cpe-port/:cpePort",
                component: CpePortComponent,
            },
            {
                path: ":id/vlan/:vlan",
                component: VlanComponent,
            },
            {
                path: ":id/vlan-connection/:vlanConnection",
                component: VlanConnectionComponent,
            },
            {
                path: ":id/port-profile/:portProfile",
                component: PortProfileComponent,
            },
            {
                path: ":id/port-profile-connection/:portProfileConnection",
                component: PortProfileConnectionComponent,
            },
        ],
    },

    {
        path: "settings",
        component: SettingsComponent,
    },
    {
        path: "**",
        redirectTo: "/devices",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
