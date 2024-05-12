// const { ipcRenderer, remote } = require('electron');

const { ipcRenderer, remote } = require("electron");

let ip = null;
let lastPing = 0;
let ourId = undefined;
let relations = [];

async function createLink(id)
{
    if(relations.includes(id)) return;

    if(!ourId)
    {
        let info = await ipcRenderer.invoke('p2pInfo');

        if(!info.clientUp) return;

        ourId = info.clientId;
    }

    let { body, documentElement } = document;

    relations.push(id);

    ipcRenderer.send('sendObjectCustom', 'object', ourId, {
        relations: relations
    }, {
        x: 0,
        y: 0,
        width: Math.max(body.scrollWidth, body.offsetWidth, documentElement.offsetWidth, documentElement.scrollWidth, documentElement.clientWidth),
        height: Math.max(body.scrollHeight, body.offsetHeight, documentElement.offsetHeight, documentElement.scrollHeight, documentElement.clientHeight)
    });
}

function updateIPInfo()
{
    ipcRenderer.invoke('ipInfo')
        .then((ipObj) => {
            if(!ipObj) return;

            ip = ipObj;

            var elem = document.getElementById('ipDisplay');

            elem.innerText = `${ipObj.localIP}:${ipObj.p2pPort}`;
            if(ip.p2pServerUp) elem.innerText += " (P2P Server Running)";
        })
        .catch(console.error);
}

function ping()
{
    lastPing = new Date();
    document.getElementById('sharedOutput').innerText += 'Ping!\n';
    document.getElementById('ping').disabled = true;

    // ipcRenderer.invoke('send', document.getElementById('remoteIp').value, 'ping')
    //     .then((v) => {
    //         document.getElementById('sharedOutput').innerText += `Pong! ${new Date() - time}ms\n`;
    //     })
    //     .catch(console.error);

    ipcRenderer.send('p2pEmit', 'ping');

    // document.getElementById('sharedOutput').innerText += `Pong! ${new Date() - time}ms\n`;
}

function pong(e, data, sender)
{
    console.log('ping', e, data, sender);
    document.getElementById('sharedOutput').innerText += `Pong! ${new Date() - lastPing}ms\n`;
    document.getElementById('ping').disabled = false;

    // Create a link to all devices that responded to the ping
    createLink(sender);
}

async function initConnection(event)
{
    let remoteIp = document.getElementById('remoteIp').value;
    console.log(remoteIp);

    // Tell the main process to spin up the p2p connection.
    await ipcRenderer.invoke('p2pConnect', remoteIp);
}

function p2pSend(msg)
{
    document.getElementById('sharedOutput').innerText += 'ME: ' + msg + '\n';
    ipcRenderer.send('p2pEmit', 'chat', {message: msg});
}

function p2pReceive(e, data, sender)
{
    console.log(e, data);
    document.getElementById('sharedOutput').innerText += sender + ": " + data.message + '\n';
}

window.onload = function () {
    updateIPInfo();
    ipcRenderer.send('p2pHook', 'chat');
    ipcRenderer.send('p2pHook', 'ping');
    ipcRenderer.send('p2pHook', 'pong')
    ipcRenderer.on('chat', p2pReceive);
    ipcRenderer.on('pong', pong);
    ipcRenderer.on('ping', (e) => {
        ipcRenderer.send('p2pEmit', 'pong');
    })

    document.getElementById('connectButton').addEventListener('click', initConnection);
    document.getElementById('ping').addEventListener('click', ping);
    document.getElementById('chatSend').addEventListener('click', (ev) => {
        let elem = document.getElementById('chatInput');
        let msg = elem.value.trim();

        if(msg.length < 1) return;

        p2pSend(msg);
        elem.value = "";
    });
    // document.getElementById('ping').addEventListener('click', (ev) => {
    //     p2pSend("HELLO?");
    // });
}