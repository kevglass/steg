namespace steg {

    export interface Resource {
        load(steg: Core, callback: (res: Resource) => void): void;

        getName(): string;
    }
}