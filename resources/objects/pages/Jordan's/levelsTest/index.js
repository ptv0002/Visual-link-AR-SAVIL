const { ipcRenderer, remote } = require("electron");

const mouseTrackerSize = 50;
const mouseUpdateTimeout = 100;

let ip;
let lastUpdate = 0;

function updateIPInfo()
{
    ipcRenderer.invoke('ipInfo')
        .then((ipObj) => {
            if(!ipObj) return;

            ip = ipObj;
        })
        .catch(console.error);
}

function updateTracker(eventType)
{
    return function _updateTracker(e)
    {
        let now = Date.now();
        // Respect the update timeout to avoid flooding HoloLens with requests
        if(now - lastUpdate < mouseUpdateTimeout) return;

        let connection = document.getElementById('remoteDisplay').value;

        // Send object to main process & to HoloLens
        ipcRenderer.send('sendObjectCustom', eventType, "mouseTracker" + ip.localIP, {
            relations: [
                // If an ID is given, connect to that object. Otherwise, connect to teapot.
                connection.length > 0 ? connection : "teapot"
            ]
        }, {
            x: e.clientX,
            y: e.clientY,
            width: mouseTrackerSize,
            height: mouseTrackerSize
        });

        lastUpdate = now;
    }
}

window.onload = function() {
    let mouseRegion = document.getElementById("mouseRegion");

    updateIPInfo();

    // Handle mouse tracker region
    mouseRegion.addEventListener("mouseenter", updateTracker('object'));

    mouseRegion.addEventListener("mousemove", updateTracker('objectUpdate'));

    // Remove the mouse tracker if it leaves the tracking region
    mouseRegion.addEventListener("mouseleave", e => {
        ipcRenderer.send('closeObjectCustom', "mouseTracker" + ip.localIP);
    });
}