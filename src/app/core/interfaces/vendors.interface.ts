export interface Vendors {
    // Key is vendor name
    [key: string]: {
        // Key is model name, value is array of version names
        [key: string]: string[];
    };
}
