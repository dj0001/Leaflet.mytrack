L.Mytrack = L.Layer.extend({
options: {click:false},  //click or locationfound
lng0: 0,  //prevent duplikates
gpx: {"type": "LineString","coordinates": []},
initialize: function(options) {L.setOptions(this, options);},
onAdd: function(map) {this.myLayer=L.geoJSON().addTo(map); map.on(this.options.click?'click':'locationfound', this._onclick, this);},
_onclick: function(e) {if(e.latlng.lng!=this.lng0)
 {this.lng0=e.latlng.lng; this.gpx.coordinates.push([e.latlng.lng,e.latlng.lat]); this.myLayer.clearLayers(); this.myLayer.addData(this.gpx); this._map.panTo([e.latlng.lat,e.latlng.lng])}}
});

L.mytrack = function(options) {return new L.Mytrack(options);}; //L.mytrack = new L.Mytrack();

	L.Control.Watermark = L.Control.extend({  //download-button
		onAdd: function(map) {
			var img = L.DomUtil.create('div');
			img.innerHTML = "<a download='mytrack.json'>&nbsp;&#x2b07;&nbsp;</a>"  //img.src = 'icons/search.png';
			img.style.background = 'white';  //img.style.width = '200px';
			
			L.DomEvent.on(img, 'click', this._download, this);  //_download
			L.DomEvent.disableClickPropagation(img)
			
			return img;
		},
		_download: function(ev) {  //must be named mytrack!
		if('msSaveOrOpenBlob' in navigator) navigator.msSaveOrOpenBlob(new Blob([JSON.stringify(mytrack.gpx)]),"mytrack.json");  //L.mytrack?
		else ev.target.href="data:application/geo+json,"+JSON.stringify(mytrack.gpx)   
		}
		//, onRemove: function(map) { }   // Nothing to do here
	});

	L.control.watermark = function(opts) {
		return new L.Control.Watermark(opts);
	}

		L.Control.Watermark2 = L.Control.extend({  //upload-button
		onAdd: function(map) {var thisLoader = this;
			var container = L.DomUtil.create('div');
			var img = L.DomUtil.create('input','mc',container);
			img.type = 'file'
			img.id = "fileElem"
			img.style.display = 'none'
			img.accept = ".json"
      img.addEventListener('change', function () {thisLoader._handleFiles(this.files)});  //L.DomEvent.on
		
		var lab = L.DomUtil.create('label','mc',container);
		lab.setAttribute("for", "fileElem")
		lab.textContent = "\u00A0\u2B06\u00A0"
		lab.style.background = 'white'
					
			return container;
		},
		_handleFiles: function(files) {var thisLoader = this;
var reader = new FileReader();
reader.onload = function(e) {
var gpx=JSON.parse(reader.result);

var mt = L.geoJSON(gpx,{style:{color:"red"}}).addTo(thisLoader._map);
thisLoader._map.fitBounds(mt.getBounds())   //fit bounds
}
reader.readAsText(files[0]) 
		}
		//, onRemove: function(map) { }   // Nothing to do here
	});

	L.control.watermark2 = function(opts) {return new L.Control.Watermark2(opts);}
