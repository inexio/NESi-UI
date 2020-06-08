import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DevicesComponent } from "./pages/devices/devices.component";
import { DeviceComponent } from "./pages/device/device.component";
import { SubrackComponent } from "./pages/subrack/subrack.component";
import { HomeComponent } from "./pages/home/home.component";

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
                path: ":id/:subrack",
                component: SubrackComponent,
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
