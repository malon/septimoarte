define([], function() {
    var mapboxUrl = 'https://{s}.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';

    return {
    zoom_arrow_multipliers: {
        11: 1,
        12: 2,
        13: 2,
        14: 3,
        15: 4,
        16: 8
    },
    zoom_radius: {
        11: 0,
        12: 0,
        13: 2.5,
        14: 3.5,
        15: 4,
        16: 5
    },
    bsas_center: [-34.61597432902992, -58.442115783691406],
    CARTODB_USER: 'cieslog',
    sql: null,
    screen_width: null,
    current_latlng: null,
    initial_zoom: null,
    filtered_locations: null,
    base_layer: L.tileLayer(mapboxUrl, {
                                        id: 'olcreativa.mle7fnoa',  
                                        attribution: "OpenStreetMaps", 
                                        token: 'pk.eyJ1Ijoib2xjcmVhdGl2YSIsImEiOiJEZWUxUmpzIn0.buFJd1-sVkgR01epcQz4Iw'})
    };
});