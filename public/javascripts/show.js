mapboxgl.accessToken = MapToken;
        const map =  mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v12', // style URL
                center: accom.geometry.coordinates, // starting position [lng, lat]
                zoom: 8, // starting zoom
            });

            const marker1 =  mapboxgl.Marker()
            .setLngLat(accom.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({offset :25})
                .setHTML(
                    `<h3>${accom.title}</h3><p>${accom.location}` 
                )
            )
            .addTo(map);