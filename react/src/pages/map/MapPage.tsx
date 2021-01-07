import React, {useEffect, useRef} from 'react';
import * as L from 'leaflet';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './MapPage.css';

// type IMapPageProps = { }

const MapPage: React.FC = () => {
  const mapRef = useRef<L.Map>(null);

  const initMap = (): void => {
    mapRef.current = L.map('map', {zoomControl:false})
      .setView([55, -128], 10);

    const layerPicker = L.control.layers();

    const bingOrtho = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://esri.com">ESRI Basemap</a> ',
      maxZoom: 24
    }).addTo(mapRef.current);

    const bcGovBaseLayer = L.tileLayer('https://maps.gov.bc.ca/arcgis/rest/services/province/roads_wm/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 24,
      attribution: '&copy; <a href="https://www2.gov.bc.ca/gov/content/home">BC Government</a> ',
    });

    layerPicker.addBaseLayer(bingOrtho, 'Bing Satellite');
    layerPicker.addBaseLayer(bcGovBaseLayer, 'BC Government');

    mapRef.current.addControl(layerPicker);

    const drawnItems = new L.FeatureGroup();
    mapRef.current.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw:{
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems
        // remove: true,
        // edit: true
      }
    });

    mapRef.current.addControl(drawControl);

  };


  useEffect(() => {
    initMap();
  });

  return (
    <div id='map'></div>
  )
}

export default MapPage;