const electron = require('electron');
const {app, screen, ipcMain} = electron;
// const screen = electron.screen;
// const ipcMain = electron.ipcMain;
const windowManager = require('electron-window-manager');
const os = require('os');
const qr = require('qrcode');
const network = require('network');

let objects = require("./resources/objects/objects.json");
let config = require("./config.json");
const { time } = require('console');
const { webContents, BrowserWindow } = require('electron');
let main = {
	regDisplay: undefined,
	objWindows: {},
	webToObjID: {},
	childObjects: {},
	displays: undefined,
	server: undefined,
	p2pServer: undefined,
	p2pClient: undefined,
	activeSock: undefined,
	ipObj: undefined,
	qrCodes: [],
	lastObjUpdate: 0,
	pendingUpdates: {},
	p2pHooks: {}
};

function generateIpInfo()
{
	if(main.qrCodes.length > 0) return Promise.resolve(main.qrCodes);
	return new Promise((res, rej) => {
		network.get_interfaces_list((err, ifs) => {
			const ipoTemplate = {
				localIP: undefined,
				port: config.socket.port,
				p2pPort: config.p2p.port,
				p2pServerUp: (main.p2pServer !== undefined),
				id: config.socket.id,
				numDisplays: main.displays.length
			}
			const ips = ifs.map(inf => {
				return {
					name: inf.name,
					ip: inf.ip_address
				}
			}).filter(o => o.ip);

			console.log(ips);

			// Select first IP
			main.ipObj = {...ipoTemplate, localIp: ips[0].ip};

			Promise.all(ips.map(ip => {
				const ipo = {...ipoTemplate, localIP: ip.ip};
				return new Promise((resolve, reject) => {
					qr.toDataURL("JSCK" + JSON.stringify(ipo))
						.then(url => {
							resolve({
								info: ip,
								name: `${ip.name} (${ip.ip})`,
								url: url
							});
						})
						.catch(reject);
				})
			})).then(qrs => {
				// console.log(qrs);
				main.qrCodes = qrs;
				res(qrs);
				// contents.send('qrcodes', qrs);
			}).catch(rej);
		});
	});
	
}

function createWindow()
{
	const { screen } = require('electron');
	windowManager.init();

	let win = windowManager.open('main', 'Visual Link Companion', `file://${__dirname}/connect.html`, false, {
		width: 800,
		height: 800,
		resizable: true,
		webPreferences:
		{
			nodeIntegration: true
		}
	}, false);

	// win.loadFile('index.html');

	let contents = win.content();
	// console.log(contents);

	let displays = main.displays = screen.getAllDisplays();
	console.log(displays);

	contents.on('did-finish-load', () => {
		// Get private IPs and generate QR codes to send to window
		generateIpInfo()
			.then(qrs => contents.send('qrcodes', qrs))
			.catch(console.error);

		// network.get_private_ip((err, ip) => {
		// 	if(err)
		// 	{
		// 		console.log(err);
		// 		return;
		// 	}
		// 	ipObj = {
		// 		localIP: ip,
		// 		port: config.socket.port,
		// 		p2pPort: config.p2p.port,
		// 		p2pServerUp: (main.p2pServer !== undefined),
		// 		id: config.socket.id,
		// 		numDisplays: displays.length
		// 	}

		// 	main.ipObj = ipObj;
		// 	// console.log(ipObj);
		// 	qr.toDataURL("JSCK" + JSON.stringify(ipObj))
		// 		.then(url => {
		// 			// console.log(url);
		// 			contents.send('qrcode', url);
		// 		})
		// 		.catch(err => {
		// 			console.error(err);
		// 		});
		// });
	});

	// Handler which sends IP information to the requesting WebContents
	ipcMain.handle('ipInfo', (event) => {
		return main.ipObj;
	});

	ipcMain.on('selectIp', (e, ip) => {
		console.log(`Updating IP object with ${ip}`);
		main.ipObj.localIP = ip;
	});

	// Handler which sends object list to the requesting WebContents
	ipcMain.handle('getObjects', e => {
		return objects;
	});

	// Manually switch main window to page
	ipcMain.on('navigate', (e, url) => {
		let mainWin = windowManager.get('main');
		mainWin.loadURL(`file://${__dirname}/${url}`);
	});

	ipcMain.handle('ourDisplay', e => {
		const win = BrowserWindow.getAllWindows().find(w => w.webContents.id === e.sender.id);
		const bounds = win.getBounds();
		const s = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
		const index = main.displays.findIndex(sc => s.id === sc.id);
		return { screenObj: s, index: index };
	});

	ipcMain.handle('getDisplay', (_, ind) => {
		return ind < displays.length ? displays[ind] : null;
	});

	// Request to send some info to WebContents
	// TODO: Use a handler instead for this communication, collapse ipInfo into this
	ipcMain.on('req', (e, d) => {
		switch(d)
		{
			case 'monitor':
				contents.send('monitorCt', displays.length);
				break;
			case 'displays':
				contents.send('displays', displays);
				break;
			default:
				console.log("request " + d);
		}
	});

	// Request to register a monitor with info from WebContents
	ipcMain.on('monitorRegister', (e, d, widthCM, img) => {
		console.log("Register monitor " + d);	

		main.regDisplay = d - 1;
		var disp = displays[main.regDisplay];

		var targetWin = windowManager.get('target');
		if(targetWin)
			targetWin.close();

		const mobj = getMonitorObj(main.regDisplay, (widthCM > 0) ? (widthCM / 100) : undefined);
		if(!img)
		{
			targetWin = windowManager.open('target', 'Image Target', `file://${__dirname}/target.html`, false, {
				'parent': win,
				'width': disp.size.width,
				'height': disp.size.height,
				'position': [disp.bounds.x, disp.bounds.y],
				'resizable': true,
				'frame': false,
				'fullscreen': true,
				'webPreferences': {
					'nodeIntegration': true,
					'additionalArguments': ['--monitorindex ' + d ]
				}
			}, false);

			var sock = main.activeSock;


			targetWin.content().on('did-finish-load', () => {
				targetWin.toFullScreen();
			});

			if(sock)
				sock.emit('registerMonitor', mobj);
		}
		else
		{
			console.log("Image included");
			e.sender.send('regCapture', { index: main.regDisplay, id: disp.id });
			ipcMain.once('regCapture', (_, idata) => {
				console.log(`Got registration capture from display ${main.regDisplay} (${idata.slice(0,32)}...)`);
				if(!main.activeSock)
					return;
				main.activeSock.emit('registerMonitor', {...mobj, img: idata});
			});
		}
	});

	ipcMain.on('setDisplayTracked', (_, id, val) => {
		console.log(`Requesting display ${id} AR tracking to be turned ${(val ? "on" : "off")}`);

		main.activeSock?.emit('setDisplayTracked', {
			id: id - 1,
			track: val ? true : false
		});
	});

	// Request to create the desired object
	ipcMain.on('spawnObject', (e, id, disp) => {
		spawnObject(id, disp-1);
	});

	// Force begin capture
	ipcMain.on('beginCapture', (e, id) => {
		windowManager.get('main').content().send('monitorCapture', getMonitorObj(id));
	});

	// Request containing screenshot to send to AR app
	ipcMain.on('monitorCapture', (e, obj) => {
		console.log('monitor capture');
		let sock = main.activeSock;
		if(!sock) return;

		sock.emit('monitorCapture', {
			id: getDisplayIndex(obj.id),
			img: obj.img
		});
	});

	// Request to send or update a sub-object managed by the WebContents
	ipcMain.on('sendObjectCustom', (e, event, oid, obj, domBounds) => {
		let id = main.webToObjID[e.sender.id];
		console.log(oid, obj, domBounds);
		if(!id) return;

		let sock = main.activeSock;
		if(!sock) return;

		let o = getObjectObj(id);
		o.obj = obj; // replace object with our object
		o.id = oid;
		o.x = domBounds.x;
		o.y = domBounds.y + 50;
		o.height = domBounds.height;
		o.width = domBounds.width;
		o.class = "entity";
		o.parent = id;

		console.log("obj", o);

		main.childObjects[id][oid] = {
			localBounds: domBounds
		};

		sock.emit(event, o)
	});

	// Request to close a sub-object managed by the WebContents
	ipcMain.on('closeObjectCustom', (e, oid) => {
		let id = main.webToObjID[e.sender.id];
		console.log('close', oid);
		if(!id) return;

		let sock = main.activeSock;
		if(!sock) return;

		delete main.childObjects?.[id]?.[oid];

		sock.emit('objectClose', { id: oid });
	});

	ipcMain.on('arRefresh', e => {
		console.log(`refresh requested from ${e.sender.id}`);

		if(main.activeSock)
			main.activeSock.emit('requestRefresh');
	});

	// Request from renderer to start up peer-to-peer communication to a specific address.
	// Likely to go unused outside of debug & demo applications.
	// P2P connections should usually be established with the assistance of the HoloLens app.
	ipcMain.handle('p2pConnect', (e, addr) => {
		if(main.p2pClient)
		{
			console.warn(`p2pConnect(${addr}) triggered from ${e.sender.id}, but P2P client is already set up!`);
			return false;
		}

		console.log(`p2pConnect(${addr}) triggered from ${e.sender.id}`);

		initP2PClient(addr);

		return true;
	});

	// Request from renderer to direct certain peer-to-peer communications to its process.
	ipcMain.on('p2pHook', (e, channel) => {
		if(!main.p2pClient)
		{
			console.warn(`p2pHook(${channel}) triggered from ${e.sender.id}, but P2P client is not set up! Continuing anyways...`);
		}
		else
			console.log(`p2pHook(${channel}) triggered from ${e.sender.id}`);
		// main.p2pClient.on(channel, (data) => {
		// 	e.reply(replyChannel, data);
		// })

		addP2PHook(channel, e.sender.id);
	});

	// Request from renderer to send some data to the peer-to-peer network.
	ipcMain.on('p2pEmit', (e, channel, data) => {
		propagateP2PHook(channel, data, main.p2pClient?.peerId, [e.sender.id]); // Propagate the hook so any other open windows will receive the event
		if(!main.p2pClient)
		{
			console.warn(`p2pEmit(${channel}, ${data}) triggered from ${e.sender.id}, but P2P client is not set up! Only propagating within this device...`);
			return;
		}

		console.log(`p2pEmit(${channel}, ${data}) triggered from ${e.sender.id}`);
		main.p2pClient.emit("p2p-data", {channel: channel, data: data, sender: main.p2pClient.peerId}); // Emit the event to the P2P network
	});

	// Sends info about the status of the P2P network to a window
	ipcMain.handle('p2pInfo', e => {
		return {
			serverUp: main.p2pServer ? true : false,
			clientUp: main.p2pClient ? true : false,
			clientId: main.p2pClient ? main.p2pClient.peerId : undefined
		};
	});

	addSBDocuments();
	createServer();

	// The HoloLens app should most likely appoint the 'host' of the peer-to-peer network,
	// but this is a useful debug option to automatically create one.
	if(config.p2p.__makeServer)
	{
		initP2PServer();
	} 
}

// Create a P2P network host from this companion
function initP2PServer()
{
	console.log("Starting P2P server...");

	let server = require('http').createServer();
	const io = require('socket.io')(server);
	// const io = require('socket.io')({
	// 	transports: ['websocket']
	// });
	const p2p = require('socket.io-p2p-server').Server;

	server.listen(config.p2p.port);

	io.use(p2p);

	// io.attach(config.p2p.port);

	main.p2pServer = io;

	io.on("connection", (socket) => {
		console.log(`New P2P connection: ${socket.id}`);
		// console.log(socket);

		socket.on("p2p-data", (data) => {
			console.debug("P2P Data:", data);
			socket.broadcast.emit("p2p-data", data);

			// Send P2P event to AR device if it is connected
			if(!main.activeSock) {
				main.activeSock.emit('p2pData', data);
			}
		});

		socket.on('disconnect', (e) => {
			console.log(`P2P Disconnect: ${socket.id}`);
		})
	});

	initP2PClient(); // our client is just connecting to our server, so set it up now!
}

// Create a local P2P client and connect it to the P2P network host
function initP2PClient(address)
{
	// if(address === "") address = undefined;
	if(address === undefined || address === "") address = `localhost:${config.p2p.port}`;

	// address = `ws://${address}/socket.io/?EIO=4&transport=websocket`;
	address = `http://${address}/`;

	console.log(`Starting P2P Client connecting to "${address}"...`);

	const P2P = require('socket.io-p2p');
	const io = require('socket.io-client');
	const socket = io(address);
	const p2p = new P2P(socket, {}, () => {
		console.log("Wahoo!", p2p.peerId);
	});

	main.p2pClient = p2p;

	p2p.on("p2p-data", (data) => {
		console.log(`p2p-data (client): ${data}`);
		let channel = data.channel;
		let d = data.data;

		propagateP2PHook(channel, d, data.sender);
	})

	console.log(p2p);

	return p2p;
}

// Propagate a P2P event to all subscribed windows,
// optionally excluding some windows (e.g., if they originated the event)
function propagateP2PHook(channel, data, sender, exclude=[])
{
	console.log(channel, data, sender, exclude, main.p2pHooks[channel]);
	// If there are no hooks for this event, it probably isn't for us.
	if(!main.p2pHooks[channel]) return;

	// Call all hooks on this channel
	for (const id of main.p2pHooks[channel]) {
		if(exclude.includes(id)) continue; // Don't try and call hooks for excluded windows.
		// Send P2P event to AR device
		if(id === 'ar' && main.activeSock) {
			main.activeSock.emit('p2pData', {
				channel: channel,
				edata: data,
				sender: sender
			})
			continue;
		}

		const c = webContents.fromId(id);
		if(!c) continue; // Don't try and call hooks for dead windows.

		console.log(`Propagating ${channel} to ${id}`);
		c.send(channel, data, sender);
	}
}

// Register a window to receive P2P events on a given channel
function addP2PHook(channel, id)
{
	if(channel in main.p2pHooks && !main.p2pHooks[channel].includes(id)) main.p2pHooks[channel].push(id);
	else if(!(channel in main.p2pHooks)) main.p2pHooks[channel] = [id];
}

// Create socket.io server which services communication between this companion and the AR app
function createServer()
{
	// const server = require('http').createServer();
	const io = require('socket.io')({
		transports: ['websocket']
	});
	io.attach(config.socket.port);
	// server.listen(config.socket.port);

	main.server = io;

	io.on('connection', (sock) => {
		if(main.activeSock) return;
		main.activeSock = sock;
		console.log("connection");

		let mainWin = windowManager.get('main');

		mainWin.loadURL(`file://${__dirname}/register.html`);

		// Echo some data from the AR app
		sock.on('debug', (data) => {
			console.log(data);
		});

		// Inform this companion that the AR app is disconnecting
		sock.on('disconnect', (r) => {
			console.log("socket dropped: " + r);
			if(r == "transport close") return;
			main.activeSock = undefined;
			// Return to connection screen
			mainWin.loadURL(`file://${__dirname}/connect.html`);
			// Destroy image target window if it's open
			if(windowManager.get('target')) windowManager.destroy('target');
		});

		// Inform this companion of a completed monitor registration & begin sending screenshots
		sock.on('monitorRegistered', id => {
			mainWin.content().send('monitorCapture', getMonitorObj(id.id));
		});

		// Instruct this companion to become the P2P host
		sock.on('startP2PServer', d => {
			console.log("Got request to start P2P server", d);
			initP2PServer();

			if(main.p2pServer)
				sock.emit('confirmP2PServer');
		});

		// Instruct this companion to connect to a P2P network hosted elsewhere
		sock.on('connectP2P', data => {
			let url = data.url;
			console.log("Got request to join P2P server", url);
			initP2PClient(url);
		});

		// Allow AR device to emit to the P2P network
		// (the AR device cannot participate in the network directly since there is no existing implementation available)
		sock.on('p2pEmit', data => {
			console.log(`Got P2P message from AR device, P2P client ${main.p2pClient ? 'exists' : 'missing'}`, data);
			const { channel, edata } = data;
			const sender = 'AR';

			propagateP2PHook(channel, edata, sender, ['ar']);

			if(!main.p2pClient) return;
			main.p2pClient.emit("p2p-data", {channel: channel, data: edata, sender: sender}); // Emit the event to the P2P network
		});

		sock.on('p2pHook', channel => {
			console.log(`Got request to add AR device to P2P channel ${channel}`);
			addP2PHook(channel, 'ar');
		});
	});
}

// Generate an object which represents the properties of a connected display
function getMonitorObj(index, physicalWidth = 0.475)
{
	let disp = main.displays[index];

	return {
		numMonitors: main.displays.length,
		index: index,
		width: disp.bounds.width,
		height: disp.bounds.height,
		x: disp.bounds.x,
		y: disp.bounds.y,
		id: disp.id,
		class: "display",
		physicalWidth: physicalWidth
	};
}

// Create a window for a requested view on the desired display and register that view with the AR system
function spawnObject(id, display)
{
	if(main.objWindows.hasOwnProperty(id))
		return main.objWindows[id];
	
	if(!objects.hasOwnProperty(id)) return null;

	let disp = main.displays[display];

	let objWin = windowManager.open('obj' + id, id, `file://${__dirname}/object.html`, false, {
		'width': 500,
		'height': 500,
		'position': [disp.bounds.x + disp.bounds.width / 3, disp.bounds.y + disp.bounds.height / 3],
		'resizable': true,
		'minimizable': false,
		'webPreferences': {
			'nodeIntegration': true
		}
	}, false);

	objWin.object.setAlwaysOnTop(false);

	main.objWindows[id] = objWin;
	let contents = objWin.content();

	main.webToObjID[contents.id] = id;

	main.childObjects[id] = {};

	contents.on('did-finish-load', () => {
		contents.send('object', id);
		console.log("Loaded " + id);
		if(main.activeSock)
			main.activeSock.emit('object', getObjectObj(id));
	});

	// Listen for window movement to update AR position
	objWin.object.on('move', (e) => {
		// console.log("Moving " + id, objWin.object.getBounds());
		
		if(main.activeSock)
		{
			// If we got another update before a buffered update completes, cancel the buffered update
			if(id in main.pendingUpdates) {
				clearTimeout(main.pendingUpdates[id]);
				delete main.pendingUpdates[id];
			}

			let o = getObjectObj(id);
			// Don't flood the client with so many updates
			let timestamp = new Date().getTime();
			if(timestamp - main.lastObjUpdate < config.socket.objUpdateTimeout) {
				// Keep the last update so the object position is eventually correct
				main.pendingUpdates[id] = setTimeout(() => {
					main.lastObjUpdate = timestamp;
					main.activeSock.emit('objectUpdate', o);
				}, timestamp - main.lastObjUpdate);
				return;	
			}
			
			main.lastObjUpdate = timestamp;
			main.activeSock.emit('objectUpdate', o);

			// o.parent = id;
			// o.class = "entity";
			// for(const key in main.childObjects[id])
			// {
			// 	// console.log(key);
			// 	const element = main.childObjects[id][key];
			// 	if(!element) continue;

			// 	const domBounds = element.localBounds;
			// 	o.id = key;
			// 	o.x += domBounds.x;
			// 	o.y += domBounds.y;
			// 	o.height = domBounds.height;
			// 	o.width = domBounds.width;

			// 	console.log(o);

			// 	main.activeSock.emit('objectUpdate', o);

			// 	// Reverse position change for next element
			// 	o.x -= domBounds.x;
			// 	o.y -= domBounds.y;
			// }
		}
	});

	// Listen for window resize to update AR bounds
	objWin.object.on('resize', (e) => {
		console.log("Resizing " + id, objWin.object.getBounds());
		
		if(main.activeSock)
		{
			// Don't flood the client with so many updates
			let timestamp = new Date().getTime();
			if(timestamp - main.lastObjUpdate < config.socket.objUpdateTimeout)
				return;

			main.lastObjUpdate = timestamp;
			main.activeSock.emit('objectUpdate', getObjectObj(id));
		}
	});

	// Listen for view closes to unregister AR object
	objWin.object.on('close', (e) => {
		console.log("Closing " + id);
		if(main.activeSock)
		{
			main.activeSock.emit('objectClose', { id: id });

			for(const key in main.childObjects[id])
				main.activeSock.emit('objectClose', { id: key });
		}

		delete main.childObjects[id];
		delete main.objWindows[id];
	});

	return objWin;
}

// Generate a meta object for a given view
function getObjectObj(id, bounds=null)
{
	if(!main.objWindows.hasOwnProperty(id))
		return null;

	let win = main.objWindows[id];
//	console.log(win);
	if(!bounds) bounds = win.object.getBounds();

	let disp = screen.getDisplayMatching(bounds);
	let dindex = getDisplayIndex(disp.id);
//	console.log(disp);
	return {
		id: id,
		obj: objects[id],
		disp: dindex,
		x: bounds.x - disp.bounds.x,
		y: bounds.y - disp.bounds.y,
		width: bounds.width,
		height: bounds.height,
		class: "window",
		parent: "",
		ip: main.ipObj.localIP
	};
}

// Get the local display index of a display given its ID
function getDisplayIndex(id)
{
	for(var i = 0; i < main.displays.length; i++)
		if(main.displays[i].id == id) return i;
	return -1;
}

// Add SightBi documents to object registry
function addSBDocuments()
{
	const docs = require('./resources/data/document.json');
	docs.forEach(d => {
		objects[`sbDoc-${d.docId}`] = {
			type: 'html',
			src: `./resources/objects/pages/sightBi_Doc/index.html?docId=${d.docId}`,
			size: {
				width: 500,
				height: 300
			},
			relations: [ ]
		};
	});
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () =>
{
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin')
	{
		app.quit()
	}
})

app.on('activate', () =>
{
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0)
	{
		createWindow()
	}
})
