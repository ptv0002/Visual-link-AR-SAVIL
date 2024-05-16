export type PeerId = string;
export type KeyAttribute = string;
export type RequestMap = Record<KeyAttribute, Set<string>>;
export type PeerRequests = Record<PeerId, RequestMap>;
export type ReferenceCounter = Record<string, number>;
export type TagIndex<T> = Record<KeyAttribute, Record<string, T>>;

export interface VLRequest {
    sender: PeerId;
}

export interface LinkRequestSearch {
    [key: KeyAttribute]: string[];
}

export interface LinkRequestData extends VLRequest {
    searches: LinkRequestSearch;
}

export interface TagRequestData extends VLRequest {
    tags: TagIndex<string[]>;
}

export default interface IVislink {
    name: string;
    /**  */
    idAttr: string;
    /** List of all attributes this view will subscribe to */
    subscribedAttributes: KeyAttribute[];
    /** List of attributes that this view will provide to the network */
    providedAttributes: KeyAttribute[];
    /** If true, tag resolution will be activated, which will search attribute values as tags rather than as ID components. */
    tagsEnabled: boolean;
    /** If true, selections in a view will also activate related elements in the same view. */
    multiselect: boolean;
    id(target: string | Element, space?: string): string;
    link(): void;
    exitP2P(): void;
    newPeer(name: PeerId): void;
    removePeer(name: PeerId): void;
    linkRequest(data: LinkRequestData): void;
    sendOrUpdate(elem: Element, requests?: boolean): void;
    unregister(elem: Element, requests?: boolean): void;
    buildTagIndex<T>(delegate: (elem: Element, curr: TagIndex<T>, attr: string, tag: string) => T): TagIndex<T>;
    broadcastTags(): void;
    ingestRemoteTags(data: TagRequestData): void;
}

export type VislinkOptions = Pick<IVislink, 'name' | 'idAttr'> &
    Partial<IVislink> & {
        /** @deprecated Use subscribedAttributes instead */
        defaultRequests?: KeyAttribute[];
    };

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
    data: T;
}

declare global {
    interface Window {
        vlData: ElementDescriptor[];
        vlImg: string;
        vlHooks: Record<string, VislinkEvent>;
    }
}
