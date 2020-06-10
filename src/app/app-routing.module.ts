import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DevicesComponent } from "./pages/devices/devices.component";
import { DeviceComponent } from "./pages/devices/device/device.component";
import { SubrackComponent } from "./pages/devices/subrack/subrack.component";
import { HomeComponent } from "./pages/home/home.component";
import { TerminalComponent } from "./pages/devices/terminal/terminal.component";
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

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: HomeComponent,
    },
    {
        path: "devices",
        component: DevicesComponent,
        children: [
            {
                path: ":id",
                component: DeviceComponent,
            },
            {
                path: ":id/terminal",
                component: TerminalComponent,
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
                path: ":id/port/:port",
                component: PortComponent,
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
        path: "**",
        redirectTo: "/",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
