L.Mytrack = L.Layer.extend({
  options: {
    click: false,
    elevation: false
  }, //click or locationfound
  lng0: 0, //prevent duplikates
  gpx: {
    "type": "LineString",
    "coordinates": []
  },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  onAdd: function(map) {
    this.myLayer = L.geoJSON().addTo(map);
    map.on(this.options.click ? 'click' : 'locationfound', this._onclick, this);
  },
  _onclick: function(e) {
    if (e.latlng.lng != this.lng0) {
      this.lng0 = e.latlng.lng; this.gpx.coordinates.push(this.options.elevation &&e.altitude?[e.latlng.lng, e.latlng.lat, e.altitude]:[e.latlng.lng, e.latlng.lat]);
      this.myLayer.clearLayers(); this.myLayer.addData(this.gpx); this._map.panTo([e.latlng.lat, e.latlng.lng])
    }
  },
  upload: function(url) {
   var xhr=new XMLHttpRequest(), fd = new FormData()
   var blob = new Blob([JSON.stringify(this.gpx)], { type: "application/json"})
   fd.append("myfile", blob, "mytrack.json")
   xhr.open("POST", url, true)
   xhr.send(fd)
  }
});

L.mytrack = function(options) {return new L.Mytrack(options);}; //L.mytrack = new L.Mytrack();

L.Control.Watermark = L.Control.extend({ //download-button
  onAdd: function(map) {
    var img = L.DomUtil.create('div');
    img.innerHTML = "<a download='mytrack.json'>&nbsp;&#x2b07;&nbsp;</a>" //img.src = 'icons/search.png';
    img.style.background = 'white'; //img.style.width = '200px';

    L.DomEvent.on(img, 'click', this._download, this); //_download
    L.DomEvent.disableClickPropagation(img)

    return img;
  },
  _download: function(ev) { var tmp=this._map._layers  //mytrack.gpx //must be named mytrack!
  	  for (var layer in tmp) {if (tmp[layer].gpx) {tmp=tmp[layer].gpx; break}}
      //tmp = {"type": "FeatureCollection","features": [{"type":"Feature","geometry": tmp }]}
      if ('msSaveOrOpenBlob' in navigator) navigator.msSaveOrOpenBlob(new Blob([JSON.stringify(tmp)]), "mytrack.json"); //L.mytrack?
      else ev.target.href = "data:application/geo+json," + JSON.stringify(tmp)
    }
    //, onRemove: function(map) { }   // Nothing to do here
});

L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
}

L.Control.Watermark2 = L.Control.extend({ //upload-button
  onAdd: function(map) {
    var thisLoader = this;
    this.mt=L.geoJSON("",{style: {color: "red"}}).addTo(map)
    this.wakelock = new this.Wakelock()
    var container = L.DomUtil.create('div');
    var img = L.DomUtil.create('input', 'mc', container);
    img.type = 'file'
    img.id = "fileElem"
    img.style.display = 'none'
    img.accept = ".json,.gpx"
    img.addEventListener('change', function() {
      thisLoader._handleFiles(this.files)
    }); //L.DomEvent.on

    var lab = L.DomUtil.create('label', 'mc', container);
    lab.setAttribute("for", "fileElem")
    lab.textContent = "\u00A0\u2B06\u00A0"
    lab.style.background = 'white'

    L.DomEvent.disableClickPropagation(container)
    return container;
  },
  _handleFiles: function(files) {
      var thisLoader = this;
      var reader = new FileReader();
      reader.onload = function(e) {thisLoader._add(reader.result, new Date(files[0].lastModified))}  //Date
      reader.readAsText(files[0])
    },
    ajax: function(url) {
      var thisLoader = this;
      fetch(url).then(function(response) {response.text().then(function(data) {thisLoader._add(data,response.headers.get("Last-modified"))}
    ) })
    },
    _add: function(data,lm) {
      if(data[0]!="{") { //Gpx track
          data = '{"type": "LineString","coordinates": [' + (data.replace(/lat="(.*?)" lon="(.*?)"/g, "[$2,$1]").match(/\[.*?\]/g) + "").replace('"', '') + ']}'
        }
      data = JSON.parse(data)
      if(data.latitude) data = { "type": "Point","coordinates": [data.longitude, data.latitude] }  //read json
      
      var mt=this.mt; //mt.clearLayers()
      mt.addData(data)
      this._map.panTo(mt.getBounds().getCenter())  //.fitBounds(mt.getBounds())
      
      mt=mt.bindPopup(function (layer) { var fe=layer.feature.geometry.coordinates, tot=0
       for (var i=0; i<fe.length-1; i++) {tot += L.latLng([fe[i][1],fe[i][0]]).distanceTo([fe[i+1][1],fe[i+1][0]])}
      return (tot/1000).toFixed(3)+" km<br>&#x2195; "+(fe[fe.length-1][2]-fe[0][2]).toFixed(0)+" m<br>"+(lm||"") })
      
      var mp; mt.eachLayer(function (layer) {mp=layer.feature.geometry.coordinates});  //altitude
      if(mp[0][2]) mp.forEach(function myFunction(item) {L.geoJSON({"type":"Point","coordinates":item},{
       style:function(feature) {return {fillColor:"hsl("+-180/1000*(feature.geometry.coordinates[2]-1000)+", 100%, 50%)"}},  //500
       pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, {radius: 4,color: "#000",weight: 0,fillOpacity: 0.8})}  //1
       }).addTo(karte);
      })
      
    },
    Wakelock: function() {  //Android
     var video = document.createElement('video'); video.addEventListener('ended', function() {video.play()})
     this.request = function() {
      video.src = "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA="
      video.play() }
    }
    //, onRemove: function(map) { }   // Nothing to do here
});

L.control.watermark2 = function(opts) {
  return new L.Control.Watermark2(opts);
}
