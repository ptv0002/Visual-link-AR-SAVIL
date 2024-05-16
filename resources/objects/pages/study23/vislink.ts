import { ipcRenderer } from 'electron';
import type IVislink from 'resources/objects/pages/study23/types';
import type {
    PeerRequests,
    ReferenceCounter,
    LinkRequestData,
    VislinkOptions,
    LinkRequestSearch,
    VLRequest,
    RequestMap,
    KeyAttribute,
    TagIndex,
    TagRequestData,
} from 'resources/objects/pages/study23/types';
import { VislinkEvent } from 'resources/objects/pages/study23/types';

declare global {
    interface Window {
        vislink: Vislink;
        initVislink: typeof initVislink;
    }
}

/** Extracts all unique elements from a delimited list */
export function listToArray(list: string, delimiter: string | RegExp = /\s+/) {
    if (!list) return [];
    return [...new Set(list.split(delimiter).map((v) => v.trim()))];
}

/** Returns true if a delimited list contains the desired element */
export function listContains(
    list: string,
    id: string,
    delimiter: string | RegExp = /\s+/
) {
    return list
        .split(delimiter)
        .map((v) => v.trim())
        .includes(id);
}

export function isSelected(elem: Element) {
    return elem.classList.contains('selected');
}

// Get VL-ready DOM rect info
export function getElemRect(elem: Element) {
    const rect = elem.getBoundingClientRect();
    return {
        x: Math.min(document.body.clientWidth + 10, Math.max(rect.x, -10)),
        y: Math.min(document.body.clientHeight + 10, Math.max(rect.y, -10)),
        width: rect.width,
        height: rect.height,
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
    subscribedAttributes: string[] = [];
    providedAttributes: string[] = [];
    channel: string = 'vlp';
    tagsEnabled: boolean = true;
    multiselect: boolean = true;
    tagIndex: TagIndex<Set<Element>> = {};
    remotesByTag: Record<string, TagIndex<string[]>> = {};
    msMap: Record<string, Set<Element>> = {};
    multiselections: Set<Element> = new Set<Element>();

    constructor(options: VislinkOptions) {
        this.name = options.name;
        this.idAttr = options.idAttr;

        Object.assign(this, options);

        if(this.tagsEnabled) {
            this.tagIndex = this.buildTagIndex((e, c, a, t) => {
                if(!c[a][t]) c[a][t] = new Set<Element>;
                return c[a][t].add(e);
            });
        }
    }

    id(target: string | Element, space?: string | undefined) {
        return `${space || this.name}-${
            (typeof target !== 'string' &&
                target.getAttribute?.(this.idAttr)) ||
            target
        }`.replace(/\s+/g, '_');
    }

    localId(target: string | Element) {
        return ((typeof target !== 'string' &&
        target.getAttribute?.(this.idAttr)) ||
        target.toString()).replace(/\s+/g, '_');
    }

    link() {
        console.info('Broadcasting requests');
        var reqs: LinkRequestSearch = {};
        this.providedAttributes.forEach((attr) => {
            if (!this.outRequests.hasOwnProperty(attr)) return;
            reqs[attr] = Object.keys(this.outRequests[attr]);
        });

        ipcRenderer.send('p2pEmit', `${this.channel}Link`, {
            sender: this.name,
            searches: reqs,
        } as LinkRequestData);
    }
    exitP2P() {
        ipcRenderer.send('p2pEmit', `${this.channel}Exit`, {
            sender: this.name,
        } as VLRequest);
    }
    newPeer(name: string) {
        console.info(`Setting up new peer "${name}"`);
        this.peerNames.add(name);
        const reqs = (this.requests[name] = {} as RequestMap);
        this.subscribedAttributes.forEach((r) => (reqs[r] = new Set()));

        // Update relations for all elements
        this.forEachElement(this.sendOrUpdate);
        this.link();
        if(this.tagsEnabled) {
            this.broadcastTags();
        }
    }

    removePeer(name: string) {
        console.info(`Removing peer "${name}"`);
        this.linkRequest({
            sender: name,
            searches: this._defaultSearch(),
        });
        this.peerNames.delete(name);
        delete this.requests[name];
    }

    linkRequest(data: LinkRequestData) {
        this.requestedElements.clear();
        this.subscribedAttributes.forEach((r) => this.requestHandler(data, r));
    }

    forEachElement<TArgs extends unknown[] = unknown[]>(
        func: (elem: Element, ...args: TArgs) => void,
        ...args: TArgs
    ) {
        this.active.forEach((e) => {
            const matches = this.findElements(e);
            matches.forEach((elem) => {
                func(elem, ...args);
            });
        });
    }

    requestRefresh(timeout?: number | undefined) {
        if (this.refreshTimer !== null) clearTimeout(this.refreshTimer);
        this.refreshTimer = window.setTimeout(
            () => ipcRenderer.send('arRefresh'),
            timeout
        );
    }

    requestHandler(data: LinkRequestData, attr: KeyAttribute) {
        // If we do not have a request list for this sender, set them up as a new peer.
        if (!this.requests.hasOwnProperty(data.sender))
            this.newPeer(data.sender);

        // Add/update every request, tracking all that we've seen before
        const reqList = new Set(this.requests[data.sender][attr]);
        data.searches[attr]?.forEach((v) => {
            this.requests[data.sender][attr].add(v);
            reqList.delete(v);

            // Get all elements containing the requested key on the requested attribute
            const elems = document.querySelectorAll(`[${attr}~="${v}"]`);

            // Register the entities with visual link system if they exist here,
            // but do not cascade requests for their relations.
            elems.forEach((elem) => {
                this.requestedElements.add(elem);
                this.sendOrUpdate(elem, false);
            });
        });

        // Remove from reqList all requests from other senders
        // so they don't get removed if this sender has stopped requesting them
        Object.keys(this.requests).forEach((sender) => {
            if (sender === data.sender) return;
            this.requests[sender][attr]?.forEach((v) => reqList.delete(v));
        });

        // Remaining entities were previously requested by this sender
        // but omitted this time, so we should remove them.
        reqList.forEach((v) => {
            this.requests[data.sender][attr].delete(v);

            // Get all elements containing the requested key on the requested attribute
            const elems = document.querySelectorAll(`[${attr}~="${v}"]`);
            elems.forEach((elem) => {
                // Skip any nodes that are manually activated
                if (isSelected(elem)) return;
                this.unregister(elem, false);
            });
        });

        this.requestRefresh();
    }

    sendOrUpdate(elem: Element, requests = true) {
        if (!elem) return;

        const id = elem.getAttribute(this.idAttr);
        if (!id) return;
        const active = this.active.has(id);

        // Construct list of relations
        const relations = this.getExpandedElementRelations(elem);

        // Register/update entity
        ipcRenderer.send(
            'sendObjectCustom',
            active ? 'objectUpdate' : 'object',
            this.id(id),
            {
                relations: relations,
            },
            getElemRect(elem)
        );

        elem.classList?.add('vl-active');
        this.active.add(id);

        // Do not generate P2P requests if this is an update or if requests are disabled
        if (active || !requests) return;

        // Increment outgoing request trackers
        this.providedAttributes.forEach((attr) => {
            if (!this.outRequests.hasOwnProperty(attr))
                this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr) ?? '').forEach((r) => {
                req[r] ? req[r]++ : (req[r] = 1);
            });
        });

        console.log('added', this.outRequests);

        this.link();
    }

    addActiveSelected(elem: Element) {
        const id = elem.getAttribute(this.idAttr);
        if (!id || !this.active.has(id)) return;

        // Increment outgoing request trackers
        this.providedAttributes.forEach((attr) => {
            if (!this.outRequests.hasOwnProperty(attr))
                this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr) ?? '').forEach((r) => {
                req[r] ? req[r]++ : (req[r] = 1);
            });
        });

        // Add related elements for multiselect
        if(this.multiselect) {
            const selected = new Set<Element>();
            const allElems = [...document.querySelectorAll(`[${this.idAttr}]`)].filter(e => e !== elem);
            this.subscribedAttributes.forEach((attr) => {
                listToArray(elem.getAttribute(attr) ?? '').forEach(r => {
                    // Select all elements in this view with matching attribute value
                    const elems = allElems.filter(e => e.matches(`[${attr}~="${r}"]`));
                    elems.forEach(e => {
                        selected.add(e);
                    });
                })
            });
            this.msMap[this.localId(elem)] = selected;
            // Activate all elements found through multiselection
            selected.forEach((e) => {
                this.multiselections.add(e);
                this.sendOrUpdate(e, false);
            });
        }

        console.log('added-select', this.outRequests);

        this.link();
    }

    removeActiveSelected(elem: Element) {
        const id = elem.getAttribute(this.idAttr);
        if (!id || !this.active.has(id)) return;

        this.providedAttributes.forEach((attr) => {
            if (!this.outRequests.hasOwnProperty(attr))
                this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr)!).forEach((r) => {
                if (req[r] && --req[r] <= 0) delete req[r];
            });
        });

        // If this element caused a multiselection, we may need to unregister other elements.
        const localId = this.localId(elem);
        if(this.multiselect && localId in this.msMap) {
            // Get elements from other multiselections
            let otherSelections = [] as Element[];
            Object.keys(this.msMap).filter(key => key !== localId).forEach((key) => {
                otherSelections = [...otherSelections, ...this.msMap[key]];
            });
            const otherUnique = new Set(otherSelections);
            // Unregister all elements that aren't active from other selections or requests
            [...this.msMap[localId]].filter(e => !otherUnique.has(e) && !this.requestedElements.has(e) && !isSelected(e)).forEach(e => {
                this.multiselections.delete(e);
                this.unregister(e, false);
            });
            this.requestCleanup();
        }

        console.log('removed-select', this.outRequests);

        this.link();
    }

    unregister(elem: Element, requests = true) {
        ipcRenderer.send('closeObjectCustom', this.id(elem));

        elem.classList?.remove('vl-active');
        this.active.delete(elem.getAttribute(this.idAttr)!);

        if (elem.hasAttribute('data-special-select')) {
            elem.removeAttribute('data-special-select');
            this.removeActiveSelected(elem);
        }

        if (!requests) return;

        this.providedAttributes.forEach((attr) => {
            if (!this.outRequests.hasOwnProperty(attr))
                this.outRequests[attr] = {};
            var req = this.outRequests[attr];
            listToArray(elem.getAttribute(attr)!).forEach((r) => {
                if (req[r] && --req[r] <= 0) delete req[r];
            });
        });

        if (elem.hasAttribute('data-special-select')) {
            elem.removeAttribute('data-special-select');
            this.removeActiveSelected(elem);
        } else {
            this.requestCleanup();
        }

        console.log('removed', this.outRequests);
    }

    findElements(id: string) {
        return document.querySelectorAll(`[${this.idAttr}~="${id}"]`);
    }

    // Get related object IDs for each peer
    getRelations(entityName: string) {
        return [...this.peerNames].map((v) => `${v}-${entityName}`);
    }

    listToRelations(list: string) {
        const elems = listToArray(list);
        return elems.reduce(
            (prev, curr) => [...prev, ...this.getRelations(curr)],
            [] as string[]
        );
    }

    getExpandedElementRelations(elem: Element) {
        if(this.tagsEnabled) {
            return this.getAllRelationsByTags(elem);
        }

        return this.subscribedAttributes.reduce((prev, curr) => {
            const attr = elem.getAttribute(curr);
            return [...prev, ...((attr && this.listToRelations(attr)) || [])];
        }, [] as string[]);
    }

    // Rebuild request counters from DOM
    requestCleanup() {
        const newReqs: Record<string, ReferenceCounter> = {};
        const elems = document.querySelectorAll(`[${this.idAttr}]`);
        // Add to reference counter for each selected element
        elems.forEach((elem) => {
            // Skip unselected elements
            if (!elem.classList.contains('selected')) return;
            // For every attribute we send out requests for...
            this.providedAttributes.forEach((attr) => {
                // If we don't have a counter for this attribute, make one
                if (!newReqs[attr]) newReqs[attr] = {};
                const counter = newReqs[attr];
                // Add to the reference counter for each value this element is associated with on this attribute
                listToArray(elem.getAttribute(attr)!).forEach((r) => {
                    counter[r] ? counter[r]++ : (counter[r] = 1);
                });
            });
        });
        this.outRequests = newReqs;
        this.link();
    }

    buildTagIndex<T>(delegate: (elem: Element, curr: TagIndex<T>, attr: string, tag: string) => T) {
        const toReturn: TagIndex<T> = {};
        // Get every element we could potentially register
        const elems = document.querySelectorAll(`[${this.idAttr}]`);
        elems.forEach((e) => {
            // For every element, we want to look at each attribute we subscribe to.
            this.subscribedAttributes.forEach((a) => {
                if (!toReturn[a]) toReturn[a] = {};
                const attr = e.getAttribute(a);
                const tags = attr ? listToArray(attr) : [];
                // For each value on those attributes, we want to add this element to the tag index.
                tags.forEach((t) => {
                    toReturn[a][t] = delegate(e, toReturn, a, t);
                });
            });
        });
        return toReturn;
    }

    broadcastTags() {
        ipcRenderer.send('p2pEmit', `${this.channel}Tags`, {
            sender: this.name,
            tags: this.buildTagIndex<string[]>((e,c,a,t) => [...new Set([...(c[a][t] ?? []), this.id(e)])])
        } as TagRequestData);
    }

    ingestRemoteTags({ sender, tags }: TagRequestData) {
        if(!this.remotesByTag[sender]) this.remotesByTag[sender] = {};
        this.remotesByTag[sender] = tags;
    }

    getKnownTaggedRemotes(attr: string, tag: string) {
        return [...this.peerNames].flatMap(peer => this.remotesByTag[peer]?.[attr]?.[tag] ?? []);
    }

    getAllRelationsByTags(elem: Element) {
        let relations = [] as string[];
        this.subscribedAttributes.forEach(attr => {
            const val = elem.getAttribute(attr);
            if(!val || val.length < 1) return;
            // Get all of this element's tags for this attribute, and then add all known remote objects with those tags
            listToArray(val).forEach(tag => relations = [...relations, ...this.getKnownTaggedRemotes(attr, tag)]);
        });
        // Return list with no duplicates
        return [...new Set(relations)];
    }

    _defaultSearch() {
        return this.providedAttributes.reduce((prev, curr) => {
            prev[curr] = [];
            return prev;
        }, {} as LinkRequestSearch);
    }
}

export default function initVislink(
    name: string,
    idAttr: string,
    linkRequests: string[],
    channel = 'vlp',
    options: Partial<VislinkOptions> = {}
) {
    // Backwards-compatibility
    options.subscribedAttributes =
        options.subscribedAttributes ?? options.defaultRequests;

    const vl = (window.vislink = new Vislink({
        name: name,
        idAttr: idAttr,
        providedAttributes: linkRequests,
        ...options,
    }));
    vl.channel = channel;

    const joinEvent = `${channel}Join`;
    const linkEvent = `${channel}Link`;
    const exitEvent = `${channel}Exit`;
    const tagsEvent = `${channel}Tags`;

    // electron stuff here
    ipcRenderer.send('p2pHook', linkEvent);
    ipcRenderer.send('p2pHook', joinEvent);
    ipcRenderer.send('p2pHook', exitEvent);
    ipcRenderer.send('p2pHook', tagsEvent);

    ipcRenderer.on(joinEvent, (e, { sender }, peerId) => {
        if (sender === 'default')
            console.warn(
                `Received join request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`
            );

        console.info(`${joinEvent} : Got join event from ${sender}`);
        vl.newPeer(sender);
    });

    ipcRenderer.on(exitEvent, (e, { sender }, peerId) => {
        if (sender === 'default')
            console.warn(
                `Received exit request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`
            );

        console.info(`${exitEvent} : Got exit event from ${sender}`);
        vl.removePeer(sender);
    });

    ipcRenderer.on(linkEvent, (e, data, peerId) => {
        if (data.sender === 'default')
            console.warn(
                `Received link request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`
            );

        console.info(`${linkEvent} : Got link event from ${data.sender}`, data);
        vl.linkRequest(data);
    });

    ipcRenderer.on(tagsEvent, (e, data, peerId) => {
        if (data.sender === 'default')
            console.warn(
                `Received tags request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`
            );

        console.info(`${tagsEvent} : Got tags event from ${data.sender}`, data);
        vl.ingestRemoteTags(data);
    });

    window.addEventListener('unload', () => {
        vl.exitP2P();
    });

    // Wait a moment before sending a join signal out
    setTimeout(
        () => {
            ipcRenderer.send('p2pEmit', joinEvent, { sender: vl.name });
            if(vl.tagsEnabled) {
                vl.broadcastTags();
            }
        },
        1000
    );

    return vl;
}
window.initVislink = initVislink;

export const vSelect: VislinkEvent = function (d, elem) {
    console.log('select', d, elem);

    // If this element is active but was only just selected, broadcast that we are now selecting this element.
    const id = elem.getAttribute(window.vislink.idAttr);
    if (id && window.vislink.active.has(id)) {
        window.vislink.addActiveSelected(elem);
        elem.setAttribute('data-special-select', 'true');
    }
};

export const vDeselect: VislinkEvent = function (d, elem) {
    console.log('deselect', d, elem);

    // This element was selected while already active (i.e., because another view requested it)
    // We need to make sure it gets cleaned up properly
    if (elem.hasAttribute('data-special-select')) {
        window.vislink.removeActiveSelected(elem);
        elem.removeAttribute('data-special-select');
    }
};

export const vEnter: VislinkEvent = function (d, elem) {
    console.log('enter', d, elem);

    // If element is not selected or active, register it
    const id = elem.getAttribute(window.vislink.idAttr);
    if (!id || window.vislink.active.has(id)) return;

    window.vislink.sendOrUpdate(elem);
};

export const vLeave: VislinkEvent = function (d, elem) {
    console.log('leave', d, elem);

    // If element is deselected and not being requested, unregister it
    if (isSelected(elem)) return;
    if (window.vislink.requestedElements.has(elem)) return;

    window.vislink.unregister(elem);
};

window.vlHooks = { vSelect, vDeselect, vEnter, vLeave };
