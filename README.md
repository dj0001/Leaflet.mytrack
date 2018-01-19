# Leaflet.mytrack
track my way on a map

Demo https://dj0001.github.io/Leaflet.mytrack/

API
L.Realtime

This is a realtime updated layer that can be added to the map. It extends L.GeoJSON.
Creation
Factory 	Description
L.Realtime(<Source> source, <RealtimeOptions> options?) 	Instantiates a new realtime layer with the provided source and options
Options

Provides these options, in addition to the options of L.GeoJSON.
Option 	Type 	Default 	Description
start 	Boolean 	true 	Should automatic updates be enabled when class is instantiated
interval 	Number 	60000 	Automatic update interval, in milliseconds
