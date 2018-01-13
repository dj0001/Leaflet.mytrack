L.Mytrack = L.Layer.extend({
options: {click:true},  //click or locationfound
lng0: 0,  //prevent duplikates
gpx: {"type": "LineString","coordinates": []},
initialize: function(options) {L.setOptions(this, options);},  //console.log(this.options)
onAdd: function(map) {this.myLayer=L.geoJSON().addTo(map); map.on(this.options.click?'click':'locationfound', this._onclick, this);},
_onclick: function(e) {if(e.latlng.lng!=this.lng0) {this.lng0=e.latlng.lng; this.gpx.coordinates.push([e.latlng.lng,e.latlng.lat]); this.myLayer.addData(this.gpx); this._map.panTo([e.latlng.lat,e.latlng.lng])}}
});

L.mytrack = function(options) {return new L.Mytrack(options);}; //L.mytrack = new L.Mytrack();
 //console.log(L.mytrack)

	L.Control.Watermark = L.Control.extend({  //download-button
		onAdd: function(map) {
			var img = L.DomUtil.create('div');
			img.innerHTML = "<a download='mytrack.json'>&nbsp;&#x2b07;&nbsp;</a>"  //img.src = 'icons/search.png';
			img.style.background = 'white';  //img.style.width = '200px';
			
			L.DomEvent.on(img, 'click', this._download, this);  //_download
			L.DomEvent.disableClickPropagation(img)
			
			return img;
		},
		_download: function(ev) {  //console.log(this._map._layers)  //must be named mytrack!
		if('msSaveOrOpenBlob' in navigator) navigator.msSaveOrOpenBlob(new Blob([JSON.stringify(mytrack.gpx)]),"mytrack.json");  //L.mytrack???
		else ev.target.href="data:application/geo+json,"+JSON.stringify(mytrack.gpx)   
		}
		//, onRemove: function(map) { }   // Nothing to do here
	});

	L.control.watermark = function(opts) {
		return new L.Control.Watermark(opts);
	}