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
        var imdb = {"LA LLUVIA ES TAMBI&#XE9;N NO VERTE":{"imdb_url":"/title/tt4438952/","imdb_id":"tt4438952","title":"La Lluvia Es Tambi&#xE9;n No Verte","year":"2015","description":" Ten years ago, horror came about in Buenos Aires. During a rock concert in a nightclub, 194 people, mainly young people, died in which was know as 'The tragedy of Cromagnon'. Since then, ... See full summary » ","rating":"","actors":"","directors":"","duration":"94 min 94 min"},"ESTELA":{"imdb_url":"/title/tt4080986/","imdb_id":"tt4080986","title":"Estela","year":"2010","description":" Add a Plot ","rating":"","actors":"Julien DellacherieEstela Ramos","directors":"","duration":"80 min 80 min"},"NACIDOS VIVOS":{"imdb_url":"/title/tt3600034/","imdb_id":"tt3600034","title":"Nacidos vivos","year":"2014","description":" Add a Plot ","rating":"","actors":"","directors":"","duration":""},"ALFONSINA STORNI":{"imdb_url":"/title/tt4950608/","imdb_id":"tt4950608","title":"Alfonsina Storni","year":"2004","description":" Add a Plot ","rating":"","actors":"Graciela GuiñazúMercedes SosaAlfonsina Storni","directors":"","duration":""},"IRAQI TANGO":{"imdb_url":"/title/tt3298318/","imdb_id":"tt3298318","title":"Iraqi Tango","year":"2013","description":" Follows the paralleling lives of an upscale Argentinian prostitute and a war traumatized Marine whose worlds collide in the underground network of sex trafficking.","rating":"","poster":"http://ia.media-imdb.com/images/M/MV5BMzk5MDA4MDk0MV5BMl5BanBnXkFtZTgwNjQ4MzI4NTE@._V1_SY317_CR6,0,214,317_AL_.jpg","actors":"Andres BaggLuisina QuarleriJulieta Umezawa","directors":"","duration":"122 min 122 min"},"BAIRES":{"imdb_url":"/title/tt4621470/","imdb_id":"tt4621470","title":"Baires","year":"2015","description":" Add a Plot ","rating":"","actors":"Rodrigo Guirao DíazSabrina GarciarenaBenjamín Vicuña","directors":"","duration":""},"LA PATOTA":{"imdb_url":"/title/tt3784222/","imdb_id":"tt3784222","title":"La patota","year":"2015","description":" A young woman is raped by a gang.","rating":" 6.7 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjM0ODI5NDE5Ml5BMl5BanBnXkFtZTgwMDE4NzUwNjE@._V1_SY317_CR175,0,214,317_AL_.jpg","actors":"Dolores FonziOscar MartínezEsteban Lamothe","directors":"","duration":"103 min 103 min"},"8 TIROS":{"imdb_url":"/title/tt2748060/","imdb_id":"tt2748060","title":"8 Tiros","year":"2013","description":" Revenge. Juan and Vicente are brothers, but they are separated by a deep hate that will do that Juan returns to life to take his brother from the only thing that matters to him: his power. The story of a love, disillusions and excesses.","rating":"","actors":"Alberto AjakaMaría Eugenia ArboledaDaniel Aráoz","directors":"","duration":"88 min 88 min"},"SOL":{"imdb_url":"/title/tt1584146/","imdb_id":"tt1584146","title":"Sol","year":"2012","description":" Far into the future a group of young adults are stranded on a hostile alien planet with no hope of getting home.","rating":" 3.3 ","poster":"http://ia.media-imdb.com/images/M/MV5BNDgwOTc3NDk2OV5BMl5BanBnXkFtZTcwMDc4NDExNQ@@._V1_SX214_AL_.jpg","actors":"Jake WhiteJake BrownColin Conners","directors":"","duration":""},"EL CLAN":{"imdb_url":"/title/tt4411504/","imdb_id":"tt4411504","title":"El Clan","year":"2015","description":" The true story of the Puccio Clan, a family who kidnapped and killed people in the 80s.","rating":" 7.4 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTQ5ODMwMjg5OF5BMl5BanBnXkFtZTgwODYyOTE2NjE@._V1_SX214_AL_.jpg","actors":"Antonia BengoecheaGastón CocchiaraleGuillermo Francella","directors":"","duration":"110 min 110 min"},"LLAMAS DE NITRATO":{"imdb_url":"/title/tt3302170/","imdb_id":"tt3302170","title":"Llamas de Nitrato","year":"2014","description":" A look upon the tragic fate of Falconetti, the star of \"The Passion of Joan of Arc\" and the way that performance mirrored her life and overshadowed everything else she did.","rating":" 8.0 ","actors":"Maria FalconettiCarl Theodor DreyerGerman Baudino","directors":"","duration":""},"FOCUS: MAESTROS DE LA ESTAFA":{"imdb_url":"/title/tt2381941/","imdb_id":"tt2381941","title":"Focus: Maestros de la estafa","year":"2015","description":" In the midst of veteran con man Nicky's latest scheme, a woman from his past - now an accomplished femme fatale - shows up and throws his plans for a loop.","rating":" 6.6 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTUwODg2OTA4OF5BMl5BanBnXkFtZTgwOTE5MTE4MzE@._V1_SX214_AL_.jpg","actors":"Will SmithMargot RobbieRodrigo Santoro","directors":"","duration":"105 min 105 min"},"DESAF&#XED;O":{"imdb_url":"/title/tt1034303/","imdb_id":"tt1034303","title":"Desaf&#xED;o","year":"2008","description":" Jewish brothers in Nazi-occupied Eastern Europe escape into the Belarussian forests, where they join Russian resistance fighters and endeavor to build a village in order to protect themselves and about 1,000 Jewish non-combatants.","rating":" 7.2 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjAzODIzMTE3Ml5BMl5BanBnXkFtZTcwNDU1MjQzMg@@._V1_SY317_CR0,0,214,317_AL_.jpg","actors":"Daniel CraigLiev SchreiberJamie Bell","directors":"","duration":"137 min 137 min"},"TESIS SOBRE UN HOMICIDIO":{"imdb_url":"/title/tt2241605/","imdb_id":"tt2241605","title":"Tesis sobre un homicidio","year":"2013","description":" Roberto Bermudez, a specialist in criminal law, is convinced that one of his students committed a brutal murder. It leads him to start an investigation that becomes his obsession.","rating":" 6.3 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTQ2MDk0MDE5OV5BMl5BanBnXkFtZTcwNTk0MTAzOQ@@._V1_SY317_CR4,0,214,317_AL_.jpg","actors":"Ricardo DarínNatalia SantiagoAlberto Ammann","directors":"","duration":"106 min 106 min"},"COLONIA":{"imdb_url":"/title/tt4005402/","imdb_id":"tt4005402","title":"Colonia","year":"2015","description":" A young woman's desperate search for her abducted boyfriend that draws her into the infamous Colonia Dignidad, a sect nobody ever escaped from.","rating":"","actors":"Emma WatsonDaniel BrühlMichael Nyqvist","directors":"","duration":"110 min 110 min"},"HIMNO NACIONAL ARGENTINO":{"imdb_url":"/title/tt4622708/","imdb_id":"tt4622708","title":"Himno Nacional Argentino","year":"1910","description":" Add a Plot ","rating":"","actors":"Eliseo Gutiérrez","directors":"","duration":""},"EL ALMUERZO":{"imdb_url":"/title/tt4384804/","imdb_id":"tt4384804","title":"El Almuerzo","year":"2015","description":" Add a Plot ","rating":"","actors":"Pompeyo AudivertAlejandro AwadaArturo Bonín","directors":"","duration":""},"LE CIEL DU CENTAURE":{"imdb_url":"/title/tt3497384/","imdb_id":"tt3497384","title":"Le ciel du centaure","year":"2015","description":" Add a Plot ","rating":" 6.5 ","actors":"Malik ZidiRomina PaulaRoly Serrano","directors":"","duration":""},"S&#XE9;PTIMO":{"imdb_url":"/title/tt2403961/","imdb_id":"tt2403961","title":"S&#xE9;ptimo","year":"2013","description":" A father gets into a desperate search to find his children who disappeared while going down stairs from their apartment in the seventh floor.","rating":" 5.8 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjI2NTg0NTQzMl5BMl5BanBnXkFtZTgwNzgzOTUzMjE@._V1_SY317_CR12,0,214,317_AL_.jpg","actors":"Ricardo DarínBelén RuedaAbel Dolz Doval","directors":"","duration":"88 min"},"PORTADORES":{"imdb_url":"/title/tt0806203/","imdb_id":"tt0806203","title":"Portadores","year":"2009","description":" Four friends fleeing a viral pandemic soon learn they are more dangerous than any virus.","rating":" 6.1 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTYwOTcxMzYxMl5BMl5BanBnXkFtZTcwODQyODQ3Mg@@._V1_SY317_CR0,0,214,317_AL_.jpg","actors":"Chris PinePiper PeraboLou Taylor Pucci","directors":"","duration":"84 min"},"EL MISTERIO DE LA FELICIDAD":{"imdb_url":"/title/tt3302594/","imdb_id":"tt3302594","title":"El misterio de la felicidad","year":"2014","description":" Santiago and Eugenio are more than friends, they are life long business partners. They understand each other without words, they care for each other, they need each other. One day Eugenio ... See full summary » ","rating":" 6.0 ","poster":"http://ia.media-imdb.com/images/M/MV5BOTU5NDkyMzE1Ml5BMl5BanBnXkFtZTgwNDI0MDE2MjE@._V1_SY317_CR6,0,214,317_AL_.jpg","actors":"Fabián ArenillasAlejandro AwadaSergio Boris","directors":"","duration":"92 min 92 min"},"MUERTE EN BUENOS AIRES":{"imdb_url":"/title/tt3621802/","imdb_id":"tt3621802","title":"Muerte en Buenos Aires","year":"2014","description":" Buenos Aires in the 1980s. Detective Chavez, a family man and a tough cop, once again must solve a mysterious crime. To reveal the identity of the murderer, Chavez must clarify the enigma ... See full summary » ","rating":" 5.2 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTc3ODgzNzU3OV5BMl5BanBnXkFtZTgwNjA2MzE1MTE@._V1_SY317_CR4,0,214,317_AL_.jpg","actors":"Monica AntonopulosHugo AranaFabián Arenillas","directors":"","duration":"94 min 90 min"},"ALL IN":{"imdb_url":"/title/tt0475217/","imdb_id":"tt0475217","title":"All In","year":"2006","description":" Six medical students with unique talents pool their resources to win the World Series of Poker.","rating":" 3.7 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjE0MDIxODgyOV5BMl5BanBnXkFtZTcwMzY0MTUwMg@@._V1_SY317_CR4,0,214,317_AL_.jpg","actors":"Dominique SwainMichael MadsenLouis Gossett Jr.","directors":"","duration":"98 min 98 min"},"20.000 BESOS":{"imdb_url":"/title/tt2241376/","imdb_id":"tt2241376","title":"20.000 Besos","year":"2013","description":" Juan is a thirty who is bored with her current life. Time ago that you don't see your friends and only is dedicated to work - in a boring place - and to groom... See full synopsis » ","rating":" 5.7 ","actors":"Carla QuevedoEduardo BlancoClemente Cancela","directors":"","duration":"91 min 91 min"},"IMPULSOS":{"imdb_url":"/title/tt0322731/","imdb_id":"tt0322731","title":"Impulsos","year":"2002","description":" Sara, a sensitive and beautiful young woman, whose only reason to live is her inability to die. Mario... See full synopsis » ","rating":" 4.6 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjAyNDk2NzE4MV5BMl5BanBnXkFtZTcwMjI0MzMzMQ@@._V1_SY317_CR5,0,214,317_AL_.jpg","actors":"Paloma BerganzaMichala BrízováDaniel Freire","directors":"","duration":"91 min 91 min"},"MADRAZA":{"imdb_url":"/title/tt2520046/","imdb_id":"tt2520046","title":"Madraza","year":"2015","description":" A humble housewife becomes an assassin for money, gaining self-confidence and rebuilding her life.","rating":"","poster":"http://ia.media-imdb.com/images/M/MV5BMjIwOTQ4ODEzOV5BMl5BanBnXkFtZTgwOTk1MDg1MzE@._V1_SY317_CR5,0,214,317_AL_.jpg","actors":"Loren AcuñaGustavo GarzónSofía Gala","directors":"","duration":""},"VIUDAS":{"imdb_url":"/title/tt1785670/","imdb_id":"tt1785670","title":"Viudas","year":"2011","description":" A married man's death puts his widow and mistress in an unusual living arrangement.","rating":" 6.3 ","actors":"Graciela BorgesValeria BertuccelliRita Cortese","directors":"","duration":"100 min"},"EL INVENTOR DE JUEGOS":{"imdb_url":"/title/tt2766268/","imdb_id":"tt2766268","title":"El inventor de juegos","year":"2014","description":" Young Ivan Drago's newfound love of board games catapults him into the fantastical and competitive world of game invention, and pits him against the inventor Morodian, who has long desired ... See full summary » ","rating":" 5.6 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTg2NjA0ODAzN15BMl5BanBnXkFtZTgwNDc0MzkwMjE@._V1_SY317_CR3,0,214,317_AL_.jpg","actors":"Joseph FiennesTom CavanaghMegan Charpentier","directors":"","duration":"111 min"},"PAPELES EN EL VIENTO":{"imdb_url":"/title/tt3772576/","imdb_id":"tt3772576","title":"Papeles en el viento","year":"2015","description":" When El Mono dies, his three longtime friends try to recover from the loss and want to secure his little girl's future. But for Fernando, Mauricio and El Ruso this will not be easy. They ... See full summary » ","rating":" 6.1 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTk5NTQ5MzA0Ml5BMl5BanBnXkFtZTgwNzIzMDU2MzE@._V1_SY317_CR4,0,214,317_AL_.jpg","actors":"Paola BarrientosCacho BuenaventuraCecilia Dopazo","directors":"","duration":"98 min 98 min"},"UN TANGO M&#XE1;S":{"imdb_url":"/title/tt4937156/","imdb_id":"tt4937156","title":"Un tango m&#xE1;s","year":"2015","description":" Add a Plot ","rating":"","actors":"Johana CopesJuan Carlos CopesAlejandra Gutty","directors":"","duration":"85 min 85 min"},"FIVE":{"imdb_url":"/title/tt1877740/","imdb_id":"tt1877740","title":"Five","year":"2011","description":" An anthology of five short films exploring the impact of breast cancer on people's lives.","rating":" 7.0 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTM5MDcxODA0OV5BMl5BanBnXkFtZTcwMDMyMzA5Ng@@._V1_SY317_CR2,0,214,317_AL_.jpg","actors":"Patricia ClarksonRosario DawsonLyndsy Fonseca","directors":"","duration":"87 min 87 min"},"OMISI&#XF3;N":{"imdb_url":"/title/tt3165392/","imdb_id":"tt3165392","title":"Omisi&#xF3;n","year":"2013","description":" A deep crisis will lead a psychiatrist to the extreme decision of \"cleanse\" society. His path will cross Santiago Murray, a priest who has just returned to Buenos Aires, willing to assist the needy people of his neighborhood.","rating":" 3.8 ","poster":"http://ia.media-imdb.com/images/M/MV5BMjAyOTQyOTI3Ml5BMl5BanBnXkFtZTgwMTcwNTQyMDE@._V1_SY317_CR4,0,214,317_AL_.jpg","actors":"Gonzalo HerediaCarlos BellosoEleonora Wexler","directors":"","duration":"99 min 99 min"},"INEVITABLE":{"imdb_url":"/title/tt2618936/","imdb_id":"tt2618936","title":"Inevitable","year":"2013","description":" Fabian (Dario Grandinetti) works as a bank executive. After one of his colleagues in the bank dies, he falls into crisis. His wife, Mariela (Carolina Peleritti), is a psychologist and has ... See full summary » ","rating":" 7.0 ","actors":"Antonella CostaDarío GrandinettiFederico Luppi","directors":"","duration":"95 min 95 min"},"MEC&#XE1;NICA POPULAR":{"imdb_url":"/title/tt4262918/","imdb_id":"tt4262918","title":"Mec&#xE1;nica Popular","year":"2015","description":" After devoting his life to publish philosophy, history and psychoanalysis, the editor Mario Zavadikner, discontented with the social and intellectual reality, decides to shoot himself at ... See full summary » ","rating":"","actors":"Alejandro AwadaPatricio ContrerasMarina Glezer","directors":"","duration":""},"NO TE ENAMORES DE M&#XED;":{"imdb_url":"/title/tt2342233/","imdb_id":"tt2342233","title":"No te enamores de m&#xED;","year":"2012","description":" \"Sólo en la honestidad de una crisis es donde se conoce la verdadera esencia de alguien, y al entender... See full synopsis » ","rating":" 6.4 ","poster":"http://ia.media-imdb.com/images/M/MV5BMTQxNDg3Nzc4OF5BMl5BanBnXkFtZTcwMTM4MDY2Nw@@._V1_SY317_CR6,0,214,317_AL_.jpg","actors":"Pablo RagoJulieta OrtegaMercedes Oviedo","directors":"","duration":"104 min"},"LA MUERTE JUEGA A LOS DADOS":{"imdb_url":"/title/tt4355552/","imdb_id":"tt4355552","title":"La muerte juega a los dados","year":"2014","description":" Four co-workers decide to go to make a barbecue on an island. After getting a little drunk, one of them accidentally dies in a game. Everything will complicate when, while attempting to ... See full summary » ","rating":"","actors":"Carlos KasparEsteban ColettiAna Livingston","directors":"","duration":"98 min 98 min"},"UP IS DOWN":{"imdb_url":"/title/tt1401252/","imdb_id":"tt1401252","title":"Up Is Down","year":"1969","description":" A boy who walks on his hands enjoys a different view of the world.","rating":" 6.8 ","actors":"Hans Conried","directors":"","duration":"5 min 5 min"}};
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

        $("span#geo").click(function(){
            getLocation(function(coords) {
                ctxt.selected_location = true;
                ctxt.selected_lat = coords[0];
                ctxt.selected_lng = coords[1];
                var latlng = L.latLng(coords[0], coords[1]);
                map.panTo(latlng);
                update_map();
            });
        });

        $("span#logo").click(function(){
                ctxt.selected_location = false;
                ctxt.selected_lat = null;
                ctxt.selected_lng = null;
                config.filtered_locations = null;
                var latlng = L.latLng(config.bsas_center[0], config.bsas_center[1]);
                map.panTo(latlng);
                update_map();
        });
        
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
            //maxBounds: bounds
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
            return 3;

        }

        function set_circle_visibility(d) {
            var v = 0;
            config.filtered_locations.forEach(function(i) {
                if (i == d.properties.id) {
                    v = 1;
                }
            });
            return v; 
        }

        function update_map() {
            if (ctxt.selected_location) {
                var query = templates.d3_near_sql;
                var data = {lat: ctxt.selected_lat, lng: ctxt.selected_lng};
                config.sql.execute(query, data)
                .done(function(collection) {
                    var rows = collection.rows;
                    config.filtered_locations = rows.map(function(r) {return r["id"];});
                    console.log(config.filtered_locations);
                    features.style("fill-opacity", set_circle_visibility);
                });
            }
            else {
                features.style("fill-opacity", 0.2);
            }
            permalink.set();
            redraw_map();
        }

        function redraw_map(rows) {
            disable_map_events();
            features.transition().ease("quad-in-out").duration(1000)
                .attr("d",path.pointRadius(set_circle_radius))
                .call(d3endall, enable_map_events);
        }

        function getLocation(cb) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else { 
                return "Geolocation is not supported by this browser.";
            }

            function showPosition(position) {
                cb([position.coords.latitude, position.coords.longitude]);
            }
        }

        /** D3 LAYER EVENTS */
        var tooltip = tooltipd3();
        // Get data for the clicked polling station and show popup and overlay
        var tooltip_i = 0;
        function d3featureClick(d, i, latlng) {
            var html = ""
            d.properties.title;

            var peli = ["EL CLAN", "SéPTIMO", "MUERTE EN BUENOS AIRES", "EL MISTERIO DE LA FELICIDAD"];
            
            var p = imdb[[peli[parseInt(tooltip_i % peli.length)]]] ;
            tooltip_i++;
            d.properties.poster = null;
            if(p){
                d.properties.poster = p.poster;
            }
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
