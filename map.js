<!-- functions that run the blue floating menu -->
		function showlayers(){
		$("#layermenu").toggle();
		$("#mapmenumain").hide();
		$("#flymenu").hide();
		$("#menulayers").toggleClass("active");
		$("#menuresources").removeClass("active");
		$("#menufly").removeClass("active");
		};
		function showmapmenu(){
		$("#mapmenumain").toggle();
		$("#layermenu").hide();
		$("#flymenu").hide();
		$("#menuresources").toggleClass("active");
		$("#menulayers").removeClass("active");
		$("#menufly").removeClass("active");
		};
		function showflymenu(){
		$("#flymenu").toggle();
		$("#layermenu").hide();
		$("#mapmenumain").hide();
		$("#menufly").toggleClass("active");
		$("#menulayers").removeClass("active");
		$("#menuresources").removeClass("active");
		};
		showflymenu
		<!-- begin document ready function -->

		
		$( document ).ready(function() {

				mapboxgl.accessToken = 'pk.eyJ1IjoiZmdjdW1hcmNvbW0iLCJhIjoiY2pzbHhhZ3FjMjA5czQzazZhdGFubGJwYSJ9.CSQzR5A2zS9QHdiDVbdC7w';

		<!-- map initialization happens here, initial center and zoom level can be determined here -->
		var map = new mapboxgl.Map({
			  container: 'map',
			  style: 'mapbox://styles/fgcumarcomm/ck3rt0ogx13y81cmnusnxmfhk', // replace this with your style URL
			  center: [-81.779026, 26.462647],
			  zoom: 16
			});		
		
		// Add geolocate control to the map.
		map.addControl(
			new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
				trackUserLocation: true
			})
		);

				<!-- popupLayers contain the layers that will have a popup attached to them-->
			var popupLayers = ['Student Housing','Colleges','Parking Lot','Parking Garage','Dining','Administrative','UPD','Radio','Recreation','Point of Interest','Modular','Library','ArtGallery','Cafe','Dining','ATM','Bus','Accessible Parking', 'Departments', 'Nature']
		
			<!--begin initial toggleable Layer functionality -->
			<!--the toggleableLayerIds array holds the names that will appear in the layers menu -->
			var toggleableLayerIds = ['Administrative', 'Colleges','Dining','Student Housing', 'Parking','Point of Interest','Recreation','Services'];
			var toggleableADALayerIds = ['Accessible Parking'];
			<!-- the below arrays hold the layers that will be toggled by the layer name, example is parking lot and parking garage will be toggled when parking is clicked-->
			var Colleges = ['Colleges'];
			var StudentHousing = ['Student Housing','Village'];
			var Dining =['Dining'];
			var Services = ['UPD','Radio','Library','Bus','ATM','Services'];
			var POI = ['Point of Interest','ArtGallery', 'Nature']
			var Parking = ['Parking Lot','Parking Garage','Parking'];
			var Recreation = ['Recreation'];
			var Administrative = ['Administrative','Modular', 'Departments'];
			var AccessibleParking = ['Accessible Parking'];
		
			<!--appends the toggleableLayerIds to the layermenu div-->
			for (var i = 0; i < toggleableLayerIds.length; i++) {
			var id = toggleableLayerIds[i];
			var layeritem = document.createElement('div');
			layeritem.className = 'chkbox resourceitem';
			layeritem.id = id;
			var cspan = document.createElement('span');
			cspan.className = 'chkboxfont icon-check';
			cspan.id = id;
			var layerlabel = document.createElement('span');
			layerlabel.className = 'layername';
			layerlabel.textContent = id;
			var layers = document.getElementById('layermenu1');
			layeritem.appendChild(cspan);
			layeritem.appendChild(layerlabel);
			layers.appendChild(layeritem);
			}
		
			<!--appends the toggleableLayerIds to the layermenu div-->
			for (var i = 0; i < toggleableADALayerIds.length; i++) {
			var id = toggleableADALayerIds[i];
			var layeritem = document.createElement('div');
			layeritem.className = 'chkbox resourceitem';
			layeritem.id = id;
			var cspan = document.createElement('span');
			cspan.className = 'chkboxfont icon-check';
			cspan.id = id;
			var layerlabel = document.createElement('span');
			layerlabel.className = 'layername';
			layerlabel.textContent = id;
			var layers = document.getElementById('layermenu2');
			layeritem.appendChild(cspan);
			layeritem.appendChild(layerlabel);
			layers.appendChild(layeritem);
			}
		<!--end toggle layer functionality code -->
		
		
		<!-- begin on click definition for popups on points -->
		 map.on('click', function(e) {
		
		<!-- all layers listed below will have their points be clickable, a.k.a. have a popup box if not listed will not create a popup box -->
		  var features = map.queryRenderedFeatures(e.point, {
			layers: popupLayers 
		  });

		  if (!features.length) {
			return;
		  }

		  var feature = features[0];
				<!--Declaring the htmlstring variable which will hold the HTML that will be added to the popup box for each point on the map. This was done to allow the ability to check if property data exists in the geojson, if so then include/append to the html, and if not then skip. -->
		  var htmlstring ='';
 		if((feature.properties.title != undefined) && (feature.properties.title != undefined)){
			htmlstring = ''
			if(feature.properties.Images != undefined){
				htmlstring += '<div id="w3slides" class="slideshow-container">'
				var imgarray = JSON.parse(feature.properties.Images);
					htmlstring += '<div class="mySlides fade-ms active"><img style="width: 100%;" src="'+imgarray[0]+'" alt="'+feature.properties.title+'" /></div>';
				for (i = 1; i < imgarray.length; i++) {
					htmlstring += '<div class="mySlides fade-ms"><img style="width: 100%;" src="'+imgarray[i]+'" alt="'+feature.properties.title+'" /></div>';
				  } 	
			if(imgarray.length > 1){
				htmlstring += '<a class="prev" onclick="plusSlides(-1)">❮</a> <a class="next" onclick="plusSlides(1)">❯</a></div>';
				}
			}
			htmlstring += '<div id="123" class="mb-info"><p class="h3 bldgtitle">' + feature.properties.title + '</p>';
			if(feature.properties.description != undefined){
			htmlstring += '<p>' + feature.properties.description + '</p>';
			} 
			if(feature.properties.website != undefined){
			htmlstring += '<p><a href="'+feature.properties.website+'">Visit Website</a></p>';
			} 
			if(feature.properties.gallery != undefined){
			htmlstring += '<p><a href="'+feature.properties.gallery+'">See More Images Visit Gallery</a></p>';
			} 
 		htmlstring += '</div>';
		}  
		  var popup = new mapboxgl.Popup({ offset: [0, -5], anchor: 'top' })
			.setLngLat(feature.geometry.coordinates)
			.setHTML(htmlstring) 
			.addTo(map);
		
			<!-- begin code that determines zoomlevel and then offsets the centering of the popup boxes, this was done so that the point is centered horizontally but the point is at a higher point vertically so that the popup box appears beneath the clicked point and more centered -->
			var zoomlevel = map.getZoom();
			if(zoomlevel >= 18){
			var secondcoord = parseFloat(feature.geometry.coordinates[1]) - 0.000129500;
		}	else if(zoomlevel < 18 && zoomlevel > 17.6){
			var secondcoord = parseFloat(feature.geometry.coordinates[1]) - 0.0008229950;
		}   else if(zoomlevel < 17.5 && zoomlevel > 16){
			var secondcoord = parseFloat(feature.geometry.coordinates[1]) - 0.0012299950;
		} else {
			var secondcoord = parseFloat(feature.geometry.coordinates[1]) - 0.00285000;
		}
		console.log("Zoom level is " + zoomlevel);
		
		<!--below is the flyto function based on the modified coordinates determined above -->
			map.flyTo({ center: [feature.geometry.coordinates[0], secondcoord] });
		});


		<!-- hover listeners impemented below that change the cursor to a finger when hovering over clickable points the loop goes through any toggleable layers, then any additional layers that aren't in the toggleable list are implemented afterwards-->	
		for(i=0; i < popupLayers.length; i++){

				// Change the cursor to a pointer when the mouse is over the places layer.		
		map.on('mouseenter', popupLayers[i], function() {
		map.getCanvas().style.cursor = 'pointer';
		});

		// Change it back to a pointer when it leaves.
		map.on('mouseleave', popupLayers[i], function() {
		map.getCanvas().style.cursor = '';
		});   
											   };

		
		<!--fly to function for off campus locations -->
		
		$('.flyto').on('click', function() {
		var flyid = this.id;
			switch(flyid){
			case 'Home':
			map.flyTo({ center: [-81.779600, 26.462114], zoom : 18, speed: 1 });
			break;
			case 'Vester':
			map.flyTo({ center: [-81.83730474911259, 26.330726907672172], zoom : 17, speed: 1 });
			break;
			case 'BC':
			map.flyTo({ center: [-81.7387307191067, 26.656469486609424], zoom : 17, speed: 1 });
			break;
			case 'WLV':
			map.flyTo({ center: [-81.787076, 26.481225], zoom : 17, speed: 1 });
			break;
			case 'ETI':
			map.flyTo({ center: [-81.750928, 26.49707], zoom : 17, speed: 1 });
			break;
			} //end of switch
		});
		<!--end of fly to function -->
		
		<!-- layer selector checkbox function defined below -->
		$('.chkbox').on('click', function() {
	
			<!-- layer visibility is checked here to toggle the change in class for the checkbox icon -->
			var clickedLayer = this.id;
			var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
			if (visibility === 'visible') {
			this.children[0].className = 'chkboxfont icon-check-empty';
			} else if(visibility === undefined) {
			this.children[0].className = 'chkboxfont icon-check-empty';
			} else {
			this.children[0].className = 'chkboxfont icon-check';
			}
		
			<!-- the below switch uses the id of the clicked layer from the menu to send the appropriate array of layers list to the toggle layer function which toggles the visibility -->
			var clickedGroup = this.id;
			switch(clickedGroup){
				case 'Administrative':
				toggleLayers(Administrative);
				break;
				case 'Colleges':
				toggleLayers(Colleges);
				break;
				case 'Parking':
				toggleLayers(Parking);
				break;
				case 'Point of Interest':
				toggleLayers(POI);
				break;
				case 'Student Housing':
				console.log("Student Housing clicked");
				toggleLayers(StudentHousing);
				break;
				case 'Recreation':
				toggleLayers(Recreation);
				break;
				case 'Services':
				toggleLayers(Services);
				break;
				case 'Dining':
				toggleLayers(Dining);
				break;
				case 'Accessible Parking':
				toggleLayers(AccessibleParking);
				break;
			} //end of switch
		
			<!-- toggleLayers iterates through the array and sends each individual layer to the toggleLayer function -->
			function toggleLayers(PassedArray) {
				for (var i = 0; i < PassedArray.length; i++) {
					layer = PassedArray[i];
				toggleLayer(layer);
	

				} // end of for loop
			} // end of toggleLayers function
		
			<!--toggleLayer function toggles the actual layer, done this will for possible future flexibility -->
			function toggleLayer(layer) {
				var visibility = map.getLayoutProperty(layer, 'visibility');
				if (visibility === 'visible') {
				map.setLayoutProperty(layer, 'visibility', 'none');
				} else if(visibility === undefined) {
				map.setLayoutProperty(layer, 'visibility', 'none');
				} else {
				map.setLayoutProperty(layer, 'visibility', 'visible');
				}
			} //end of toggleLayer function
		});
		
		
		}); //end of document ready function

		<!--Javascript for image slider function in popup -->
			var slideIndex = 1;

			// Next/previous controls
			function plusSlides(num) {
			  showSlides(slideIndex += num);
			}

			// Thumbnail image controls
			function currentSlide(num) {
			  showSlides(slideIndex = num);
			}

			function showSlides(num) {
			  var i;
			  var slides = document.getElementsByClassName("mySlides");
			  if (num > slides.length) {
					slideIndex = 1
			  }
			  if (num < 1) {
						slideIndex = slides.length
						}
 			  for (i = 0; i < slides.length; i++) {
				  slides[i].style.display = "none";
			  } 
			  slides[slideIndex-1].style.display = "block";
			}