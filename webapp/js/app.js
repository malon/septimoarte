requirejs.config({
    baseUrl: 'js',
    paths: {
        'templates': '../templates', 
        'text': '../libs/requirejs-text/text',
        'd3': '../libs/d3/d3.min',
        'tooltipd3': '../libs/tooltip.d3'

    }
});

requirejs(['app/config', 'app/context', 'app/templates', 
           'app/helpers', 'app/view_helpers', 'app/permalink', 
           'd3', 'tooltipd3'],
function(config, ctxt, templates, helpers, view_helpers, permalink, d3, _tooltipd3) {
    $(function() {
    "use strict";
        var map;
        // Template for percentage tooltip
        var tooltip_tmpl = _.template(templates.tooltip);
        var transform = d3.geo.transform({point: projectPoint});
        var path = d3.geo.path().projection(transform).pointRadius(0);
        var presults = {};
        var features;
        var geom = null;

        var current_zoom_level = null;

        // Set initial zoom level for responsiveness
        config.screen_width = $("body").width();
        if (is_small_screen()) {
            current_zoom_level = 11;
        }
        else {
            current_zoom_level = 12;
        }

        function is_small_screen() {
            if (config.screen_width < 700) {
                return true;
            } else {
                return false;
            }
        }
        //Original
        // var southWest = L.latLng(-34.705, -58.531),
        //     northEast = L.latLng(-34.527, -58.335),
        //     bounds = L.latLngBounds(southWest, northEast);
        
        //New to allow overlay interaction
        var southWest = L.latLng(-34.738, -58.672),
            northEast = L.latLng(-34.488, -58.219),
            bounds = L.latLngBounds(southWest, northEast);
        
        map = L.map('mapa', {
            center: config.bsas_center,
            zoom: current_zoom_level,
            minZoom: current_zoom_level,
            maxZoom: 16,
            attributionControl: false,
            maxBounds: bounds
        });

        map.addLayer(config.base_layer);

        config.sql = new cartodb.SQL({
            user: config.CARTODB_USER
        });

        // D3 layer
        var svg = d3.select(map.getPanes().overlayPane)
                    .append("svg").attr("id", "d3layer");
        var g = svg.append("g").attr("class", "leaflet-zoom-hide");

        config.sql.execute(templates.d3_geom_sql,null,{format: 'GeoJSON'})
            .done(function(collection) {
                // store geoJSON in context
                geom = collection;

                features = g.selectAll("path.location")
                                .data(collection.features, function(d) {return d.properties.id;});

                //Create the polling tables circles
                features.enter()
                        .append("path")
                        .attr("class", "location")
                        .attr('id', function(d) {return "id"+d.properties.id;})
                        .on('click', d3featureClick)
                        .on("mouseover", d3featureOver);

                map.on("viewreset", reset);
                reset();

                //Get context from permalink
                permalink.get();
                //We need to check the permalink
                update_map();
            });
        
        // Reposition the SVG to cover the features.
        function reset() {
            current_zoom_level = map.getZoom();
            var bounds = path.bounds(geom),
                         topLeft = bounds[0],
                         bottomRight = bounds[1];
            // We need to give some padding because of the path pointRadius
            var padding = 30;
            topLeft = [topLeft[0]-padding, topLeft[1]-padding];

            svg.attr("width", bottomRight[0] - topLeft[0]+padding)
               .attr("height", bottomRight[1] - topLeft[1]+padding)
               .style("left", topLeft[0] + "px")
               .style("top", topLeft[1]+ "px");

            g.attr("transform", "translate(" + (-topLeft[0]) + "," + (-topLeft[1]) + ")");
            // TODO add permalink functionality
            if (true) {
                features.attr("d", path);
            }
        }

        /** CIRCLE FUNCTIONALITY */

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            /*jshint validthis: true */
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

        function set_circle_radius(d) {
            var r = 10;
            return r;

        }

        function set_circle_visibility(d) {
            if (config.filtered_locations) {
                if (config.filtered_locations.hasOwnProperty(d.id))                    
                    return 1;
                else
                    return 0;
            }
        }

        function check_available_data() {
            var p = ctxt.selected_movie;
            if (!ctxt.selected_movie) {
                //TODO cuando vengo con datos en permalink
                return true;
            }
            return true;
        }

        function update_map() {
            if (ctxt.selected_movie) {
                //TODO
            } 
            else {
                if (ctxt.selected_location) {
                    var query = templates.d3_near_sql;
                    var data = {lat: ctxt.selected_lat, lng: ctxt.selected_lng};
                    config.sql.execute(query, data)
                    .done(function(collection) {
                        var rows = collection.rows;
                        config.filtered_locations = rows.map(function(r) {return r["id"];});
                        features.transition().ease("quad-in-out").duration(1000)
                            .style("fill-opacity", set_circle_visibility)
                            .call(d3endall, enable_map_events);
                    });
                }
                permalink.set();
                redraw_map();
            }
        }

        function redraw_map(rows) {
            disable_map_events();
            features.transition().ease("quad-in-out").duration(1000)
                .attr("d",path.pointRadius(set_circle_radius))
                .call(d3endall, enable_map_events);
        }

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else { 
                return "Geolocation is not supported by this browser.";
            }

            function showPosition(position) {
                console.log(position)
                return [position.coords.latitude, position.coords.longitude];
            }
        }

        /** D3 LAYER EVENTS */
        var tooltip = tooltipd3();
        // Get data for the clicked polling station and show popup and overlay
        function d3featureClick(d, i, latlng) {
            console.log(d);
            var html = ""
            d.properties.title;
            tooltip.mouseover(tooltip_tmpl(d.properties)); // pass html content
            tooltip.mousemove(d);
        }
        
        // Get data for the over polling station 
        function d3featureOver(d, i){

        }

        //Called when the Cartodb SQL has finished
        function featureClickDone(latlng, establecimiento_data, votos_data) {
            var popup = null;
            var ttip_data = {establecimiento: establecimiento_data,
                         winner: false,
                         v: votos_data,
                         dict_datos: config.diccionario_datos,
                         vh: view_helpers};
            /** If we are viewing differences ignore overlay */
            if (ctxt.selected_movie) {
                popup = L.popup().setLatLng(latlng)
                                 .setContent(popup_tpl(ttip_data))
                                 .openOn(map);
                return false;
            }

            //Tooltip
            ttip_data.winner = true;
            popup = L.popup().setLatLng(latlng)
                             .setContent(popup_tpl(ttip_data))
                             .openOn(map);
            //Overlay calculation
            var d = votos_data.rows;
            d.forEach(function(d) {
                d.pct = (d.votos / establecimiento_data.positivos) * 100;
            });
            
            //Show overlay
            $('#results').html(overlay_tpl({
                e: establecimiento_data,
                data: d,
                dict_datos: config.diccionario_datos,
                max: _.max(d, function(item){ return item.votos; }),
                vh: view_helpers
            }));
            
            $('#results').animate({right:'0%'}, 'fast', function(){
                helpers.animate_barras();
            }); 

            d3.select("#results a.cerrar").on("click", helpers.close_slide);
        }

        //Helper counting function to wait to all elements of a transition to end
        function d3endall(transition, callback) { 
            if (transition.size() === 0) { callback(); }
            var n = 0; 
            transition 
                .each(function() { ++n; }) 
                .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
        }

        function reset_map() {
            // Reset map position
            if (is_small_screen()) {
                map.setView(config.bsas_center, 11);
            }
            else {
                map.setView(config.bsas_center, 12);
            }
        }

        function enable_map_events () {
            // Enable drag and zoom handlers.
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();

            // Enable tap handler, if present.
            if (map.tap) map.tap.enable();
            
        }

        function disable_map_events() {
            /** Function to disable map events while transitioning */
            // Disable drag and zoom handlers.
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();

            // Disable tap handler, if present.
            if (map.tap) map.tap.disable();
        }

        /** MAP EVENTS */

        // Hide overlay if dragged position is out of bounds
        map.on('dragend', function(e, x, y) {
            if (config.current_latlng !== null && !map.getBounds().contains(config.current_latlng)) {
                map.closePopup();
            }
        });

        // Close popup and overlay
        map.on('popupclose', function(e) {
            if (ctxt.selected_location) {
                ctxt.selected_location = null;
                permalink.set();
            }
            if (ctxt.selected_movie) {
                helpers.close_slide();
            }
        });
    });
});
