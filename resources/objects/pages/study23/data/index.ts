import type { DataModule } from "..";

export function setDataModule(name: string) {
    const m = window.dataModules?.[name];
    if(!m) return;
    window.vlData = m.data;
    window.vlImg = m.image;
}
if(window) {
    window.setDataModule = setDataModule;
    if(!window.dataModules)
        window.dataModules = {};
}

declare global {
    interface Window {
        setDataModule: typeof setDataModule;
        dataModules: Record<string, DataModule>;
    }
}