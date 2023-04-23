	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
	mapboxgl.accessToken = 'pk.eyJ1IjoiZmdjdW1hcmNvbW0iLCJhIjoiY2pzbHhhZ3FjMjA5czQzazZhdGFubGJwYSJ9.CSQzR5A2zS9QHdiDVbdC7w';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3
    });

    map.on('load', function () {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('earthquakes', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data:
                'https://webdev.fgcu.edu/campusmap/files/alumnigeodata.json',
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                 'circle-stroke-width': 3,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': .3,
                'circle-opacity': .95,
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#5fc5e0', //Small circle color
                    100,
                    '#4ba5cf', //Medium circle color
                    750,
                    '#438ac7' //Big circle color
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    14, //adjust small circle size
                    100,
                    21, //adjust medium circle size
                    750,
                    32 //adjust big circle size
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
             paint: {
              'text-color': '#ffffff'
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
           paint: {
                'circle-color': '#8edaee', //smallest circle color
				'circle-opacity': .95,
                'circle-radius': 5, //adjust smallest circle size
                'circle-stroke-width': 2,
                'circle-stroke-opacity': .3,
                'circle-stroke-color': '#fff'
            }
        });

        // inspect a cluster on click
        map.on('click', 'clusters', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            var clusterId = features[0].properties.cluster_id;
            map.getSource('earthquakes').getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var year = e.features[0].properties.year;
			var major = e.features[0].properties.major;
			var degree = e.features[0].properties.degree;

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    'Graduation Year: ' + year + '<br></br>Major: ' + major + ' ' + degree
                )
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
            map.getCanvas().style.cursor = '';
        });
    });