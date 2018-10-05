
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
				
			if( m.isWatching ){
			
				if( m.isOpen )
					m.watch(false)
				else
					updated = '<span class="watching">Watching</span>...will notify when open'
			}
			
			let battery = m.battery < CONFIG.BATTERY_WARNING_LEVEL ? `&nbsp;<img src="../src/battery.png"> ${m.battery}%` : ''
			
			return `<div class="sensor" data-status=${status} data-id="${m.id}">
				<h2>${d.name} ${battery}
					<span class="updated">${updated}</span>
				</h2>
				<h2 class="status">${status}</h2>
			</div>`
			
		}).join("\n")
		
		document.querySelectorAll('.sensor').forEach(el=>{
			el.addEventListener('click', watch)
		})
	})

}

function watch(e){
	
	let id = e.currentTarget.dataset.id
	let sensor = sensors.get(id)
		
	if( !sensor || sensor.isOpen ) return;
	
	sensor.watch(!sensor.isWatching)
	
	e.currentTarget.querySelector('.updated').innerHTML = sensor.isWatching ? '<span class="watching">Watching</span>...will notify when open' : ''
}

fetch();