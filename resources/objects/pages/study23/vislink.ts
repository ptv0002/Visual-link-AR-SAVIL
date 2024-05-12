import { ipcRenderer } from 'electron';
import type IVislink from 'resources/objects/pages/study23/types';
import type { PeerRequests, ReferenceCounter, LinkRequestData, VislinkOptions, LinkRequestSearch, VLRequest, RequestMap, KeyAttribute } from 'resources/objects/pages/study23/types';
import { VislinkEvent } from 'resources/objects/pages/study23/types';

declare global {
    interface Window {
        vislink: Vislink;
        initVislink: typeof initVislink;
    }
}

/** Extracts all unique elements from a delimited list */
export function listToArray(list: string, delimiter: string | RegExp = /\s+/)
{
    if(!list) return [];
    return [...new Set(list.split(delimiter).map(v => v.trim()))];
}

/** Returns true if a delimited list contains the desired element */ 
export function listContains(list: string, id: string, delimiter: string | RegExp = /\s+/)
{
    return list.split(delimiter).map(v => v.trim()).includes(id);
}

export function isSelected(elem: Element) {
    return elem.classList.contains("selected");
}

// Get VL-ready DOM rect info
export function getElemRect(elem: Element)
{
    const rect = elem.getBoundingClientRect();
    return {
        x: Math.min(document.body.clientWidth + 10, Math.max(rect.x, -10)),
        y: Math.min(document.body.clientHeight + 10, Math.max(rect.y, -10)),
        width: rect.width,
        height: rect.height
    };
}

export class Vislink implements IVislink {
    name: string;
    idAttr: string;
    active: Set<string> = new Set<string>();
    requests: PeerRequests = {};
    outRequests: Record<string, ReferenceCounter> = {};
    requestedElements: Set<Element> = new Set<Element>();
    peerNames: Set<string> = new Set<string>();
    refreshTimer: number | null = null;
    defaultRequests: string[] = [];
    linkRequests: string[] = [];
    channel: string = "vlp";

    constructor(options: VislinkOptions) {
        this.name = options.name;
        this.idAttr = options.idAttr;
        
        Object.assign(this, options);
    }

    id(target: string | Element, space?: string | undefined) {
        return `${space || this.name}-${(typeof(target) !== "string" && target.getAttribute?.(this.idAttr)) || target}`;
    }
    link() {
        console.info("Broadcasting requests");
        var reqs: LinkRequestSearch = {};
        this.linkRequests.forEach(attr => {
            if(!this.outRequests.hasOwnProperty(attr)) return;
            reqs[attr] = Object.keys(this.outRequests[attr]);
        });

        ipcRenderer.send('p2pEmit', `${this.channel}Link`, {
            sender: this.name,
            searches: reqs
        } as LinkRequestData);
    }
    exitP2P() {
        ipcRenderer.send('p2pEmit', `${this.channel}Exit`, { sender: this.name } as VLRequest);
    }
    newPeer(name: string) {
        console.info(`Setting up new peer "${name}"`);
        this.peerNames.add(name);
        const reqs = this.requests[name] = {} as RequestMap;
        this.defaultRequests.forEach(r => reqs[r] = new Set());

        // Update relations for all elements
        this.forEachElement(this.sendOrUpdate);
        this.link();
    }

    removePeer(name: string) {
        console.info(`Removing peer "${name}"`);
        this.linkRequest({
            sender: name,
            searches: this._defaultSearch()
        });
        this.peerNames.delete(name);
        delete this.requests[name];
    }

    linkRequest(data: LinkRequestData) {
        this.requestedElements.clear();
        this.defaultRequests.forEach(r => this.requestHandler(data, r));
    }

    forEachElement<TArgs extends unknown[] = unknown[]>(func: (elem: Element, ...args: TArgs) => void, ...args: TArgs) {
        this.active.forEach(e => {
            const matches = this.findElements(e);
            matches.forEach(elem => {
                func(elem, ...args);
            });
        });
    }

    requestRefresh(timeout?: number | undefined) {
        if(this.refreshTimer !== null)
            clearTimeout(this.refreshTimer);
        this.refreshTimer = window.setTimeout(() => ipcRenderer.send('arRefresh'), timeout);
    }

    requestHandler(data: LinkRequestData, attr: KeyAttribute) {
        // If we do not have a request list for this sender, set them up as a new peer.
        if (!this.requests.hasOwnProperty(data.sender))
            this.newPeer(data.sender);
    
        // Add/update every request, tracking all that we've seen before
        const reqList = new Set(this.requests[data.sender][attr]);
        data.searches[attr]?.forEach(v => {
            this.requests[data.sender][attr].add(v);
            reqList.delete(v);
    
            // Get all elements containing the requested key on the requested attribute
            const elems = document.querySelectorAll(`[${attr}~="${v}"]`);
    
            // Register the entities with visual link system if they exist here,
            // but do not cascade requests for their relations.
            elems.forEach(elem => { this.requestedElements.add(elem); this.sendOrUpdate(elem, false); });
        });
    
        // Remove from reqList all requests from other senders
        // so they don't get removed if this sender has stopped requesting them
        Object.keys(this.requests).forEach(sender => {
            if (sender === data.sender) return;
            this.requests[sender][attr]?.forEach(v => reqList.delete(v));
        })
    
        // Remaining entities were previously requested by this sender
        // but omitted this time, so we should remove them.
        reqList.forEach(v => {
            this.requests[data.sender][attr].delete(v);
    
            // Get all elements containing the requested key on the requested attribute
            const elems = document.querySelectorAll(`[${attr}~="${v}"]`);
            elems.forEach(elem => {
                // Skip any nodes that are manually activated
                if(isSelected(elem)) return;
                this.unregister(elem, false);
            })
        });
    
        this.requestRefresh();
    }

    sendOrUpdate(elem: Element, requests = true) {
        if(!elem) return;

        const id = elem.getAttribute(this.idAttr);
        if(!id) return;
        const active = this.active.has(id);

        // Construct list of relations
        const relations = this.getExpandedElementRelations(elem);

        // Register/update entity
        ipcRenderer.send('sendObjectCustom', active ? 'objectUpdate' : 'object', this.id(id), {
            relations: relations
        }, getElemRect(elem));

        elem.classList?.add("vl-active");
        this.active.add(id);

        // Do not generate P2P requests if this is an update or if requests are disabled
        if(active || !requests) return;

        // Increment outgoing request trackers
        this.linkRequests.forEach(attr => {
            if(!this.outRequests.hasOwnProperty(attr)) this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr) ?? "").forEach(r => {
                req[r] ? req[r]++ : (req[r] = 1);
            });
        });

        console.log("added", this.outRequests);

        this.link();
    }

    addActiveSelected(elem: Element) {
        const id = elem.getAttribute(this.idAttr);
        if(!id || !this.active.has(id)) return;

        // Increment outgoing request trackers
        this.linkRequests.forEach(attr => {
            if(!this.outRequests.hasOwnProperty(attr)) this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr) ?? "").forEach(r => {
                req[r] ? req[r]++ : (req[r] = 1);
            });
        });

        console.log("added-select", this.outRequests);

        this.link();
    }

    removeActiveSelected(elem: Element) {
        const id = elem.getAttribute(this.idAttr);
        if(!id || !this.active.has(id)) return;

        this.linkRequests.forEach(attr => {
            if(!this.outRequests.hasOwnProperty(attr)) this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr)!).forEach(r => {
                if(req[r] && --req[r] <= 0) delete req[r];
            });
        });

        console.log("removed-select", this.outRequests);

        this.link();
    }

    unregister(elem: Element, requests = true) {
        ipcRenderer.send('closeObjectCustom', this.id(elem));

        elem.classList?.remove("vl-active");
        this.active.delete(elem.getAttribute(this.idAttr)!);

        if(elem.hasAttribute("data-special-select")) {
            elem.removeAttribute("data-special-select");
            this.removeActiveSelected(elem);
        }

        if(!requests) return;

        this.linkRequests.forEach(attr => {
            if(!this.outRequests.hasOwnProperty(attr)) this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr)!).forEach(r => {
                if(req[r] && --req[r] <= 0) delete req[r];
            });
        });

        if(elem.hasAttribute("data-special-select")) {
            elem.removeAttribute("data-special-select");
            this.removeActiveSelected(elem);
        } else {
            this.requestCleanup();
        }

        console.log("removed", this.outRequests);
    }
    
    findElements(id: string) {
        return document.querySelectorAll(`[${this.idAttr}~="${id}"]`);
    }

    // Get related object IDs for each peer
    getRelations(entityName: string)
    {
        return [...this.peerNames].map(v => `${v}-${entityName}`);
    }

    listToRelations(list: string)
    {
        const elems = listToArray(list);
        return elems.reduce((prev, curr) => [...prev, ...this.getRelations(curr)], [] as string[]);
    }

    getExpandedElementRelations(elem: Element) {
        return this.defaultRequests.reduce((prev, curr) => {
            const attr = elem.getAttribute(curr);
            return [...prev, ...(attr && this.listToRelations(attr) || [])]
        }, [] as string[]);
    }

    // Rebuild request counters from DOM
    requestCleanup() {
        const newReqs: Record<string, ReferenceCounter> = {};
        const elems = document.querySelectorAll(`[${this.idAttr}]`);
        // Add to reference counter for each selected element
        elems.forEach(elem => {
            // Skip unselected elements
            if(!elem.classList.contains("selected")) return;
            // For every attribute we send out requests for...
            this.linkRequests.forEach(attr => {
                // If we don't have a counter for this attribute, make one
                if(!newReqs[attr]) newReqs[attr] = {};
                const counter = newReqs[attr];
                // Add to the reference counter for each value this element is associated with on this attribute
                listToArray(elem.getAttribute(attr)!).forEach(r => {
                    counter[r] ? counter[r]++ : (counter[r] = 1);
                });
            });
        });
        this.outRequests = newReqs;
        this.link();
    }

    _defaultSearch() {
        return this.linkRequests.reduce((prev, curr) => {
            prev[curr] = [];
            return prev;
        }, {} as LinkRequestSearch)
    }
}

export default function initVislink(name: string, idAttr: string, linkRequests: string[], channel = "vlp", options: Partial<VislinkOptions> = {}) {
    const vl = window.vislink = new Vislink({
        name: name,
        idAttr: idAttr,
        linkRequests: linkRequests,
        ...options
    });
    vl.channel = channel;

    const joinEvent = `${channel}Join`;
    const linkEvent = `${channel}Link`;
    const exitEvent = `${channel}Exit`;

    // electron stuff here
    ipcRenderer.send('p2pHook', linkEvent);
    ipcRenderer.send('p2pHook', joinEvent);
    ipcRenderer.send('p2pHook', exitEvent);

    ipcRenderer.on(joinEvent, (e, { sender }, peerId) => {
        if(sender === "default")
            console.warn(`Received join request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        console.info(`${joinEvent} : Got join event from ${sender}`);
        vl.newPeer(sender);
    });

    ipcRenderer.on(exitEvent, (e, { sender }, peerId) => {
        if(sender === "default")
            console.warn(`Received exit request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        console.info(`${exitEvent} : Got exit event from ${sender}`);
        vl.removePeer(sender);
    });

    ipcRenderer.on(linkEvent, (e, data, peerId) => {
        if(data.sender === "default")
            console.warn(`Received link request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        console.info(`${linkEvent} : Got link event from ${data.sender}`, data);
        vl.linkRequest(data);
    });

    window.addEventListener('unload', () => {
        vl.exitP2P();
    });

    // Wait a moment before sending a join signal out
    setTimeout(() => ipcRenderer.send('p2pEmit', joinEvent, { sender: vl.name }), 1000);

    return vl;
}
window.initVislink = initVislink;

export const vSelect: VislinkEvent = function(d, elem)
{
    console.log("select", d, elem);

    // If this element is active but was only just selected, broadcast that we are now selecting this element.
    const id = elem.getAttribute(window.vislink.idAttr);
    if(id && window.vislink.active.has(id)) {
        window.vislink.addActiveSelected(elem);
        elem.setAttribute("data-special-select", "true");
    }
}

export const vDeselect: VislinkEvent = function(d, elem)
{
    console.log("deselect", d, elem);

    // This element was selected while already active (i.e., because another view requested it)
    // We need to make sure it gets cleaned up properly
    if(elem.hasAttribute("data-special-select")) {
        window.vislink.removeActiveSelected(elem);
        elem.removeAttribute("data-special-select");
    }
}

export const vEnter: VislinkEvent = function(d, elem)
{
    console.log("enter", d, elem);

    // If element is not selected or active, register it
    const id = elem.getAttribute(window.vislink.idAttr);
    if(!id || window.vislink.active.has(id)) return;

    window.vislink.sendOrUpdate(elem);
}

export const vLeave: VislinkEvent = function(d, elem)
{
    console.log("leave", d, elem);

    // If element is deselected and not being requested, unregister it
    if(isSelected(elem)) return;
    if(window.vislink.requestedElements.has(elem)) return;

    window.vislink.unregister(elem);
}

window.vlHooks = {vSelect, vDeselect, vEnter, vLeave};