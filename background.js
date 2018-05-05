/*
	Bathroom Status
	
	Dashboard
	- https://my.wirelesstag.net/eth/index.html
	
	API docs
	- http://wirelesstag.net/apidoc.html
	
	Creating AUTH TOKEN
	- http://wirelesstag.net/eth/oauth2_apps.html
*/

const URL = 'https://www.mytaglist.com'
const AUTH_TOKEN = 'dc958ab6-5b95-4af7-a571-8fc3237100cb'
// const AUTH_TOKEN_WEST = '3c8cda06-ee04-4c76-b3c8-ea76159a62c1'
// const AUTH_TOKEN_EAST = 'f75fa51f-97f5-4617-9ade-2c162a6cef12'
const UPDATE_INTERVAL = 60 * 1000 // auto update every 60 seconds

let sensors = new Sensors()

function fetchSensors(){
	
	return fetch(URL+'/ethClient.asmx/GetTagList2', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			'Authorization': 'Bearer '+AUTH_TOKEN
		}
	})
	.then(resp=>resp.json())
	.then(data=>{
		
		sensors.reset(data.d)
		
		let numOpen = sensors.numOpen
		
		// set the toolbar badge color and text
		if( numOpen > 0 ){
			chrome.browserAction.setBadgeText({text: String(numOpen)})
			chrome.browserAction.setBadgeBackgroundColor({color: '#66BB6A'})
		}else{
			chrome.browserAction.setBadgeText({text: ' '})
			chrome.browserAction.setBadgeBackgroundColor({color: '#ff1744'})
		}
		
		return Sensors
	})
}

// fetch list of sensors now and start auto-update interval
fetchSensors()
setInterval(fetchSensors, UPDATE_INTERVAL)

// listen for the browser action to request a status update
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
	
	if( req.cmd == 'status' ){
		
		fetchSensors().then(()=>{
			sendResponse(sensors)
		})
		return true;
	}
	
});