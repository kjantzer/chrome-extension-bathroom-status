
const TagTypeMap = {
	52: 'door',
	21: 'temp'
}

class Sensors {
	constructor(data) {
		this.reset(data)
	}
	
	get length(){ return this.models.length }
	
	reset(data){
		this.models = data ? data.map(d=>new Sensor(d)) : []
	}
	
	toJSON(){
		return this.models.map(m=>m.toJSON())
	}
	
	each(fn){
		this.models.forEach(fn)
	}
	
	get numOpen(){
		return this.models.filter(m=>m.isOpen).length
	}
}


class Sensor {
	constructor(data) {
		this.data = data
		
		let wasOpen = JSON.parse(localStorage.getItem('sensor:'+this.id+':isOpen') || false);
		
		if( wasOpen != this.isOpen)
			localStorage.setItem('sensor:'+this.id+':lastUpdated', (new Date).getTime())
		
		localStorage.setItem('sensor:'+this.id+':isOpen', this.isOpen)
	}
	
	get id(){ return this.data.uuid}
	
	get name(){return this.data.name}
	
	get isOpen(){ return this.data.eventState == 3}
	
	get battery(){ return this.data.batteryRemaining }
	
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