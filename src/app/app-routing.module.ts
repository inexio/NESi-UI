import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DevicesComponent } from "./pages/devices/devices.component";
import { DeviceComponent } from "./pages/device/device.component";
import { SubrackComponent } from "./pages/subrack/subrack.component";
import { HomeComponent } from "./pages/home/home.component";
import { TerminalComponent } from "./pages/terminal/terminal.component";
import { CardComponent } from "./pages/card/card.component";

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
