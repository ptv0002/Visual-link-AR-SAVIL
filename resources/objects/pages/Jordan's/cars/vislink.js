const { ipcRenderer } = require('electron');

let vl;

function Vislink(name, idAttr, linkRequests) {
    return {
        name: name || "default",
        idAttr: idAttr,
        active: new Set(),
        requests: {},
        outRequests: {},
        requestedElements: new Set(),
        peerNames: new Set(),
        refreshTimer: null,
        defaultRequests: ['car-name','car-maker','car-country'],
        linkRequests: linkRequests ?? ['car-name', 'car-maker', 'car-country'],
        id: function (name, space) { return `${space || this.name}-${name.getAttribute?.(this.idAttr) || name}` },
        link: function() {
            console.info("Broadcasting requests");
            var reqs = {};
            this.linkRequests.forEach(attr => {
                if(!this.outRequests.hasOwnProperty(attr)) return;
                reqs[attr] = Object.keys(this.outRequests[attr]);
            });

            ipcRenderer.send('p2pEmit', 'carLink', {
                sender: this.name,
                ...reqs
            });
        },
        exitP2P: function() {
            ipcRenderer.send('p2pEmit', 'carExit', { sender: this.name });
        },
        newPeer: function(name) {
            console.info(`Setting up new peer "${name}"`);
            this.peerNames.add(name);
            const reqs = this.requests[name] = {};
            this.defaultRequests.forEach(r => reqs[r] = new Set());

            // Update relations for all elements
            this.forEachElement(sendOrUpdate);
            this.link();
        },
        removePeer: function(name) {
            console.info(`Removing peer "${name}"`);
            this.linkRequest({
                sender: name,
                'car-maker': [],
                'car-name': [],
                'car-country': []
            });
            this.peerNames.delete(name);
            delete this.requests[name];
        },
        linkRequest: function(data) {
            this.requestedElements.clear();
            this.defaultRequests.forEach(r => handleRequest(data, r));
        },
        forEachElement: function(func, ...args) {
            this.active.forEach(e => {
                const matches = findElements(e);
                matches.forEach(elem => {
                    func(elem, ...args);
                });
            });
        },
        requestRefresh: function (time = 2000) {
            if(this.refreshTimer !== null)
                clearTimeout(this.refreshTimer);
            this.refreshTimer = setTimeout(() => ipcRenderer.send('arRefresh'), time);
        }
    };
}

function initVislink(name, idAttr, linkRequests) {
    vl = window.vislink = new Vislink(name, idAttr, linkRequests);

    // electron stuff here
    ipcRenderer.send('p2pHook', 'carLink');
    ipcRenderer.send('p2pHook', 'carJoin');
    ipcRenderer.send('p2pHook', 'carExit');

    ipcRenderer.on('carJoin', (e, { sender }, peerId) => {
        if(sender === "default")
            console.warn(`Received join request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        vl.newPeer(sender);
    });

    ipcRenderer.on('carExit', (e, { sender }, peerId) => {
        if(sender === "default")
            console.warn(`Received exit request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        vl.removePeer(sender);
    });

    ipcRenderer.on('carLink', (e, data, peerId) => {
        if(data.sender === "default")
            console.warn(`Received link request from peer ${peerId} named 'default,' please call initVislink with a unique name for all windows!`);

        vl.linkRequest(data);
    });

    window.addEventListener('unload', () => {
        vl.exitP2P();
    });

    // Wait a moment before sending a join signal out
    setTimeout(() => ipcRenderer.send('p2pEmit', 'carJoin', { sender: vl.name }), 1000);

    return vl;
}

function vSelect(d, elem)
{
    console.log("select", d, elem);
}

function vDeselect(d, elem)
{
    console.log("deselect", d, elem);
}

function vEnter(d, elem)
{
    console.log("enter", d, elem);

    // If element is not selected or active, register it
    if(vl.active.has(elem.getAttribute(vl.idAttr))) return;

    sendOrUpdate(elem);
}

function vLeave(d, elem)
{
    console.log("leave", d, elem);

    // If element is deselected and not being requested, unregister it
    if(isSelected(elem)) return;
    if(vl.requestedElements.has(elem)) return;

    unregister(elem);
}

// Handle new peer joining the session
function handleNewPeer(name)
{
    vl.peerNames.add(name);
}

function findElements(id)
{
    return document.querySelectorAll(`[${vl.idAttr}~="${id}"]`);
}

// Get related object IDs for each peer
function getRelations(entityName)
{
    return [...vl.peerNames].map(v => `${v}-${entityName}`);
}

// Get VL-ready DOM rect info
function getElemRect(elem)
{
    const rect = elem.getBoundingClientRect();
    return {
        x: Math.min(document.body.clientWidth + 10, Math.max(rect.x, -10)),
        y: Math.min(document.body.clientHeight + 10, Math.max(rect.y, -10)),
        width: rect.width,
        height: rect.height
    };
}

function listToArray(list)
{
    if(!list) return [];
    return [...new Set(list.split(' ').map(v => v.trim()))];
}

// Returns true if a comma-separated list of IDs contains the desired ID
function listContains(list, id)
{
    return listToArray(list).includes(id);
}

// Expands comma-separated list to list of relations
function listToRelations(list)
{
    const elems = listToArray(list);
    return elems.reduce((prev, curr) => [...prev, ...getRelations(curr)], []);
}

function getRelationsForElement(elem)
{
    const carRelations = listToRelations(elem.getAttribute("car-name"));
    const makerRelations = listToRelations(elem.getAttribute("car-maker"));
    const countryRelations = listToRelations(elem.getAttribute("car-country"));
    const relations = [...makerRelations, ...carRelations, ...countryRelations];

    return [carRelations, makerRelations, relations, countryRelations];
}

// Register or update an entity with AR-SAViL system
function sendOrUpdate(elem, requests = true)
{
    if(!elem) return;

    const id = elem.getAttribute(vl.idAttr);
    const active = vl.active.has(id);

    // Construct list of relations
    const [carRelations, makerRelations, relations] = getRelationsForElement(elem);

    // Register/update entity
    ipcRenderer.send('sendObjectCustom', active ? 'objectUpdate' : 'object', vl.id(id), {
        relations: relations
    }, getElemRect(elem));

    elem.classList?.add("vl-active");
    vl.active.add(id);

    // Do not generate P2P requests if this is an update or if requests are disabled
    if(active || !requests) return;

    // Increment outgoing request trackers
    vl.linkRequests.forEach(attr => {
        if(!vl.outRequests.hasOwnProperty(attr)) vl.outRequests[attr] = {};
        var req = vl.outRequests[attr];
        listToArray(elem.getAttribute(attr)).forEach(r => {
            req[r] ? req[r]++ : (req[r] = 1);
        });
    });

    console.log("added", vl.outRequests, vl.makerReqs, vl.carReqs, vl.countryReqs);

    vl.link();
}

// Remove entity from AR-SAViL system
function unregister(elem, requests = true)
{
    ipcRenderer.send('closeObjectCustom', vl.id(elem));

    elem.classList?.remove("vl-active");
    vl.active.delete(elem.getAttribute(vl.idAttr));

    if(!requests) return;

    vl.linkRequests.forEach(attr => {
        if(!vl.outRequests.hasOwnProperty(attr)) vl.outRequests[attr] = {};
        var req = vl.outRequests[attr];
        listToArray(elem.getAttribute(attr)).forEach(r => {
            if(req[r] && --req[r] <= 0) delete req[r];
        });
    });

    vl.link();

    console.log("removed", vl.makerReqs, vl.carReqs, vl.countryReqs);
}

// Handle P2P requests, registering newly requested entities and pruning unnecessary requests
function handleRequest(data, attr) {
    // If we do not have a request list for this sender, set them up as a new peer.
    if (!vl.requests.hasOwnProperty(data.sender))
        vl.newPeer(data.sender);

    // Add/update every request, tracking all that we've seen before
    const reqList = new Set(vl.requests[data.sender][attr]);
    data[attr]?.forEach(v => {
        vl.requests[data.sender][attr].add(v);
        reqList.delete(v);

        // Get all elements containing the requested key on the requested attribute
        const elems = document.querySelectorAll(`[${attr}~="${v}"]`);

        // Register the entities with visual link system if they exist here,
        // but do not cascade requests for their relations.
        elems.forEach(elem => { vl.requestedElements.add(elem); sendOrUpdate(elem, false); });
    });

    // Remove from reqList all requests from other senders
    // so they don't get removed if this sender has stopped requesting them
    Object.keys(vl.requests).forEach(sender => {
        if (sender === data.sender) return;
        vl.requests[sender][attr]?.forEach(v => reqList.delete(v));
    })

    // Remaining entities were previously requested by this sender
    // but omitted this time, so we should remove them.
    reqList.forEach(v => {
        vl.requests[data.sender][attr].delete(v);

        // Get all elements containing the requested key on the requested attribute
        const elems = document.querySelectorAll(`[${attr}~="${v}"]`);
        elems.forEach(elem => {
            // Skip any nodes that are manually activated
            if(isSelected(elem)) return;
            unregister(elem, false);
        })
    });

    vl.requestRefresh();
}