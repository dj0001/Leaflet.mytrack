# Leaflet.mytrack
track my way on a map and download it

Demo https://dj0001.github.io/Leaflet.mytrack/

Leaflet.mytrack extends the Layer class. Adding your track to a leaflet map is as easy as:

    var mytrack = L.mytrack().addTo(map);

## API

| Option  | Default |Description  |
| ------------- | ------------- | -----------  |
| click         | false         |draw a track  |
| elevation  | false  |record latitude  |
   
and a method:

| Method  | Description |
| ------------- | ------------- | 
| ajax(url)     | add geojson via fetch  |
| upload(url)   | upload geojson to server |

Draw [demo](https://dj0001.github.io/Leaflet.mytrack/?1)    
Ajax [demo](https://dj0001.github.io/Leaflet.mytrack/?../pwa/test/Fahrrad.gpx)

## Changelog
Done: Upload track    
21.01. show elevation (colored dots)    
21.01. add method upload
