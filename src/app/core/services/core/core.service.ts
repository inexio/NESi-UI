import { Injectable, ElementRef } from "@angular/core";
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";

@Injectable({
    providedIn: "root",
})
export class CoreService {
    /**
     * Element Reference to the wrapper element of the Devices page(s)
     */
    public devicesContentWrapper: ElementRef;

    /**
     * Boolean if any Http Request is currently pending
     */
    public requestPending: boolean = false;

    /**
     * Allow access to Electron `ipcRenderer` to communicate with main process
     */
    public ipcRenderer: typeof ipcRenderer;

    /**
     * Allow access to Electron `webFrame`
     */
    public webFrame: typeof webFrame;

    /**
     * Allow access to Electron `remote`
     */
    public remote: typeof remote;

    /**
     * Allow access to Node `childProcess`
     */
    public childProcess: typeof childProcess;

    /**
     * Allow access to Node filesystem
     */
    public fs: typeof fs;

    /**
     * Getter returning a boolean if whether the app is running on desktop or in the browser
     *
     * Special thanks to @maximegris/angular-electron
     */
    public get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    constructor() {}
}
