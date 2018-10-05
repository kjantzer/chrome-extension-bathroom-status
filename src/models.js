
const TagTypeMap = {
	52: 'door',
	21: 'temp'
}

module.exports = class Sensors {
	constructor(data) {
		this.reset(data)
	}
	
	get length(){ return this.models.length }
	
	reset(data, notify=false){
		this.models = data ? data.map(d=>new Sensor(d, notify)) : []
	}
	
	toJSON(){
		return this.models.map(m=>m.toJSON())
	}
	
	each(fn){
		this.models.forEach(fn)
	}
	
	get(id){
		return this.models.find(m=>m.id==id)
	}
	
	get numOpen(){
		return this.models.filter(m=>m.isOpen).length
	}
}


class Sensor {
	constructor(data, notify=false) {
		this.data = data
		
		let wasOpen = JSON.parse(localStorage.getItem('sensor:'+this.id+':isOpen') || false);
		
		if( wasOpen != this.isOpen)
			localStorage.setItem('sensor:'+this.id+':lastUpdated', (new Date).getTime())
		
		localStorage.setItem('sensor:'+this.id+':isOpen', this.isOpen)
		
		if( notify )
			this.notifyIfWatching()
	}
	
	get id(){ return this.data.uuid}
	
	get name(){return this.data.name}
	
	get isOpen(){ return this.data.eventState == 3}
	
	get battery(){ return this.data.batteryRemaining * 100 }
	
	get type(){ return TagTypeMap[this.data.tagType] || 'unknown' }
	
	get lastComm(){
		return new Date((this.data.lastComm / 10000) - 11644473600000);
	}
	
	get lastCommRelative(){
		return Sensor.relativeTime(this.lastComm)
	}
	
	lastUpdated(format='date'){
		let time = localStorage.getItem('sensor:'+this.id+':lastUpdated')
		let date = new Date( time ? parseInt(time) : undefined )
		
		if( format == 'min' )
			return Math.round((((new Date) - date) / 1000 / 60 * 100 ) / 100)
		if( format == 'sec' )
			return Math.round((((new Date) - date) / 1000 * 100 ) / 100)
		
		return date
	}
	
	toJSON(){
		return this.data
	}
	
	toString(){
		return this.name + ' ('+(this.isOpen?'Open':'Closed')+') '+this.lastCommRelative
	}
	
	get isWatching(){
		return this.watching().includes(this.id)
	}
	
	watching(){
		return JSON.parse(localStorage.getItem('sensor:watch')||'[]')
	}
	
	watch(doWatch=true){
		
		let watching = this.watching()
		let indx = watching.indexOf(this.id)
		
		if( doWatch && indx < 0 )
			watching.push(this.id)
			
		else if( !doWatch && indx >= 0 )
			watching.splice(indx, 1)
		
		localStorage.setItem('sensor:watch', JSON.stringify(watching))
	}
	
	notifyIfWatching(){
		// only notify when the bathroom is open
		if( !this.isOpen || !this.isWatching ) return;
		
		chrome.notifications.create(String((new Date).getTime()), {
			type: "basic",
			title: 'Bathroom Status',
			message: this.name+' is Open',
			iconUrl: '../icons/128x128.png'
		})
		
		// this.watch(false)
		localStorage.setItem('sensor:watch', '[]') // stop watching all bathrooms
	}
	
	// http://wirelesstag.net/jshtmlview.aspx?html=index.html&js=styles/client.js
	static relativeTime(date){
		var now = new Date();
		var diff = now.getTime() - date.getTime();
		var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
		if (daysDifference >= 1) return daysDifference + " days ago";
		var hoursDifference = Math.floor(diff / 1000 / 60 / 60);
		if (hoursDifference >= 1) return hoursDifference + " hours ago";
		var minDifference = Math.floor(diff / 1000 / 60);
		if (minDifference >= 1) return minDifference + " min ago";
		else return Math.round(diff / 1000) + " sec ago";
	}
}