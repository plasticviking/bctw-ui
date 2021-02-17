import * as L from 'leaflet';
import './MapPage.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

import { CircularProgress, InputLabel } from '@material-ui/core';
import pointsWithinPolygon from '@turf/points-within-polygon';
import { PageProp } from 'components/component_interfaces';
import TextField from 'components/form/Input';
import dayjs from 'dayjs';
import download from 'downloadjs';
import { useTelemetryApi } from 'hooks/useTelemetryApi';
import { useEffect, useRef, useState } from 'react';
import tokml from 'tokml';
import { formatDay, formatLocal, getToday } from 'utils/time';

export default function MapPage(props: PageProp): JSX.Element {
  const bctwApi = useTelemetryApi();

  const mapRef = useRef<L.Map>(null);

  const [tracks, setTracks] = useState(new L.GeoJSON()); // Store Tracks
  const [pings, setPings] = useState(new L.GeoJSON()); // Store Pings

  const [start, setStart] = useState<string>(dayjs().subtract(14, 'day').format(formatDay));
  const [end, setEnd] = useState<string>(getToday());
  const [selectedCollars, setSelectedCollars] = useState([]);

  const drawnItems = new L.FeatureGroup(); // Store the selection shapes

  const { isFetching: fetchingTracks, isError: isErrorTracks, data: tracksData } = bctwApi.useTracks(start, end);
  const { isFetching: fetchingPings, isError: isErrorPings, data: pingsData } = bctwApi.usePings(start, end);
  // const { isError: isErrorLatestPings, data: latestPingsData } = (bctwApi.usePings as any)(start, end);

  useEffect(() => {
    drawLatestPings();
  }, [start, end]);

  useEffect(() => {
    if (tracksData && !isErrorTracks) {
      tracks.addData(tracksData);
    }
  }, [tracksData]);

  useEffect(() => {
    if (pingsData && !isErrorPings) {
      pings.addData(pingsData);
    }
  }, [pingsData]);

  pings.options = {
    pointToLayer: (feature, latlng) => {
      // Mortality is red
      const s = feature.properties.animal_status;
      const colour = s === 'Mortality' ? '#ff0000' : '#00ff44';

      const pointStyle = {
        radius: 8,
        fillColor: colour,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      };

      return L.circleMarker(latlng, pointStyle);
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      const g = feature.geometry as any; // Yes... this exists!
      const x = g.coordinates[0]?.toFixed(5);
      const y = g.coordinates[1]?.toFixed(5);
      const t = dayjs(p.date_recorded).format(formatLocal);
      const text = `
        ${p.species || ''} ${p.animal_id || 'No WLHID'} <br>
        <hr>
        Device ID ${p.device_id} (${p.device_vendor}) <br>
        ${p.radio_frequency ? 'Frequency of ' + p.radio_frequency + '<br>' : ''}
        ${p.population_unit ? 'Unit ' + p.population_unit + '<br>' : ''}
        ${t} <br>
        ${x}, ${y}
      `;
      layer.bindPopup(text);
    }
  };

  const selectedPings = new L.GeoJSON(); // Store the selected pings

  (selectedPings as any).options = {
    pointToLayer: (feature, latlng) => {
      const pointStyle = {
        class: 'selected-ping',
        radius: 10,
        fillColor: '#ffff00',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      };
      return L.circleMarker(latlng, pointStyle);
    }
  };

  const displaySelectedUnits = (overlay) => {
    const selectedCollars = overlay.features
      .map((f) => f.properties.device_id)
      .reduce((total, f) => {
        if (total.indexOf(f) >= 0) {
          return total;
        } else {
          return total.concat(f);
        }
      }, []);
    setSelectedCollars(selectedCollars);
    console.log('selection', selectedCollars);
  };

  const drawSelectedLayer = () => {
    const clipper = drawnItems.toGeoJSON();
    const allPings = pings.toGeoJSON();
    // More typescript type definition bugs... These are the right features!!!
    const overlay = pointsWithinPolygon(allPings as any, clipper as any);

    displaySelectedUnits(overlay);

    // Clear any previous selections
    mapRef.current.eachLayer((layer) => {
      if ((layer as any).options.class === 'selected-ping') {
        mapRef.current.removeLayer(layer);
      }
    });

    selectedPings.addData(overlay);
  };

  const drawLatestPings = (): void => {
    console.log('drawing pings');
    const layerPicker = L.control.layers();
    layerPicker.removeLayer(pings);
    layerPicker.removeLayer(tracks);
    pings.clearLayers();
    tracks.clearLayers();
  };

  const initMap = (): void => {
    mapRef.current = L.map('map', { zoomControl: false }).setView([55, -128], 6);

    const layerPicker = L.control.layers();

    const bingOrtho = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; <a href="https://esri.com">ESRI Basemap</a> ',
        maxZoom: 24,
        maxNativeZoom: 17
      }
    ).addTo(mapRef.current);

    const bcGovBaseLayer = L.tileLayer(
      'https://maps.gov.bc.ca/arcgis/rest/services/province/roads_wm/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 24,
        attribution: '&copy; <a href="https://www2.gov.bc.ca/gov/content/home">BC Government</a> '
      }
    );

    layerPicker.addBaseLayer(bingOrtho, 'Bing Satellite');
    layerPicker.addBaseLayer(bcGovBaseLayer, 'BC Government');

    layerPicker.addOverlay(tracks, 'Critter Tracks');
    layerPicker.addOverlay(pings, 'Critter Locations');

    mapRef.current.addLayer(drawnItems);

    mapRef.current.addLayer(selectedPings);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems
      }
    });

    mapRef.current.addControl(drawControl);

    mapRef.current.addControl(layerPicker);

    // Set up the drawing events
    mapRef.current
      .on('draw:created', (e) => {
        drawnItems.addLayer((e as any).layer);
        drawSelectedLayer();
      })
      .on('draw:edited', (e) => {
        drawSelectedLayer();
      })
      .on('draw:deletestop', (e) => {
        drawSelectedLayer();
      });

    // drawLatestPings() // TODO: Refactor ala React
  };

  const handlePickDate = (event): void => {
    const key = Object.keys(event)[0];
    if (key === 'tstart') {
      setStart(event[key]);
      return;
    }
    if (key == 'tend') {
      setEnd(event[key]);
    }
  };

  const initSidebar = (): void => {
    props.setSidebarContent(
      <div id='date-picker-grp'>
        <div className='date-div'>
          <InputLabel>Start</InputLabel>
          <TextField type='date' defaultValue={start} propName='tstart' changeHandler={handlePickDate} />
        </div>
        <div className='date-div'>
          <InputLabel>End</InputLabel>
          <TextField type='date' defaultValue={end} propName='tend' changeHandler={handlePickDate} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const updateComponent = (): void => {
      if (!mapRef.current) {
        initMap();
        initSidebar();
      }
    };
    updateComponent();
  });

  // Add the tracks layer
  useEffect(() => {
    tracks.addTo(mapRef.current);
  }, [tracks]);

  // Add the ping layer
  useEffect(() => {
    pings.addTo(mapRef.current);
  }, [pings]);

  const handleKeyPress = (e) => {
    if (!(e.ctrlKey && e.keyCode == 83)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let kml;
    if ((selectedPings as any).toGeoJSON().features.length > 0) {
      kml = tokml((selectedPings as any).toGeoJSON());
    } else {
      kml = tokml((pings as any).toGeoJSON());
    }
    download(kml, 'collars.kml', 'application/xml');
  };

  return (
    <>
      <div id='map' onKeyDown={handleKeyPress}></div>
      <div id='collar-list'>
        {fetchingPings || fetchingTracks ? <CircularProgress color='secondary' /> : null}
        <ul>
          {selectedCollars.map((collar) => (
            <li key={collar}>{collar}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
