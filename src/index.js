
const CONFIG = require('./config')
const Sensors = require('./models')

let sensors = new Sensors()
let div = document.getElementById('statuses')

let manifest = chrome.runtime.getManifest()
document.querySelector('#version').innerHTML = ' – v'+manifest.version

function fetch(){
	
	div.innerHTML = '<p>Fetching status...</p>'
	
	chrome.runtime.sendMessage({cmd:'status'}, resp=>{
		
		sensors.reset(resp)
		
		div.innerHTML = sensors.models.map(m=>{
			
			if( m.type != 'door' ) return ''; // skip other sensors (like temp sensors)
			
			let d = m.toJSON()
			let status = m.isOpen ? 'Open' : 'Closed'
			let updated = m.isOpen ? 0 : m.lastUpdated('min')
			
			// if been closed for 10 min or more, show the time since it may be unoccupied
			if( CONFIG.SHOW_TIME_AFTER && updated >= CONFIG.SHOW_TIME_AFTER )
				updated = 'Closed for '+updated+' minutes, may be unoccupied'
			else
				updated = ''
			
			return `<div class="sensor" data-status=${status}>
				<h2>${d.name}
					<span class="updated">${updated}</span>
				</h2>
				<h2 class="status">${status}</h2>
			</div>`
			
		}).join("\n")
	})

}

fetch();