
const CONFIG = require('./config')

var Sensors = require('./models')
let sensors = new Sensors()

function fetchSensors(notify){
	
	return fetch(CONFIG.URL+'/ethClient.asmx/GetTagList2', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			'Authorization': 'Bearer '+CONFIG.AUTH_TOKEN
		}
	})
	.then(resp=>resp.json())
	.then(data=>{
		
		sensors.reset(data.d, notify!==false)
		
		updateBadge()
		
		return Sensors
	})
}

function updateBadge(){
	if( !CONFIG.AUTO_UPDATE ) return;
	
	let numOpen = sensors.numOpen
	
	// set the toolbar badge color and text
	if( numOpen > 0 ){
		chrome.browserAction.setBadgeText({text: String(numOpen)})
		chrome.browserAction.setBadgeBackgroundColor({color: '#27ae60'})
	}else{
		chrome.browserAction.setBadgeText({text: ' '})
		chrome.browserAction.setBadgeBackgroundColor({color: '#ff1744'})
	}
}

// fetch list of sensors now and start auto-update interval
fetchSensors()

if( CONFIG.AUTO_UPDATE )
	setInterval(fetchSensors, CONFIG.AUTO_UPDATE)

// listen for the browser action to request a status update
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
	
	if( req.cmd == 'status' ){
		
		fetchSensors(false).then(()=>{
			sendResponse(sensors)
		})
		return true;
	}
	
});