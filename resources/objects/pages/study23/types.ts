export type PeerId = string;
export type KeyAttribute = string;
export type RequestMap = Record<KeyAttribute, Set<string>>;
export type PeerRequests = Record<PeerId, RequestMap>;
export type ReferenceCounter = Record<string, number>;

export interface VLRequest {
    sender: PeerId;
}

export interface LinkRequestSearch {
    [key: KeyAttribute]: string[];
}

export interface LinkRequestData extends VLRequest {
    searches: LinkRequestSearch;
};

export default interface IVislink {
    name: string;
    idAttr: string;
    defaultRequests: KeyAttribute[];
    linkRequests: KeyAttribute[];
    id(target: string | Element, space?: string): string;
    link(): void;
    exitP2P(): void;
    newPeer(name: PeerId): void;
    removePeer(name: PeerId): void;
    linkRequest(data: LinkRequestData): void;
    sendOrUpdate(elem: Element, requests?: boolean): void;
    unregister(elem: Element, requests?: boolean): void;
};

export type VislinkOptions = Pick<IVislink, 'name' | 'idAttr'> & Partial<IVislink>;

export type VislinkEvent = (d: unknown, elem: Element) => void;

export interface ElementDescriptor<T = ElementData> {
    x: number;
    y: number;
    width?: number;
    height?: number;
    data?: T;
}

export interface ElementData {
    id: string;
    [key: string]: string;
}

export interface DataModule<T = ElementDescriptor[]> {
    name: string;
    image: string;
    data: T
}

declare global {
    interface Window {
        vlData: ElementDescriptor[];
        vlImg: string;
        vlHooks: Record<string, VislinkEvent>;
    }
}