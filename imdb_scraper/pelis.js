var request = require('request');
var cheerio = require('cheerio');
var events = require('events');
var async = require('async');

const imdb_search_url = 'http://www.imdb.com/find?ref_=nv_sr_fn&exact=true&q=%title%&s=tt';
const imdb_movie = 'http://www.imdb.com/title/';
const omdb_search_url = 'http://www.omdbapi.com/?i=%imdb_id%&plot=short&r=json';

function search_imdb(title, year) {
    var eventEmitter = new events.EventEmitter();
    request(imdb_search_url.replace('%title%', title),
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body, {
                    decodeEntities: true
                });
                
                var title,
                    imdb_link,
                    imdb_url,
                    imdb_year,
                    imdb_year_str,
                    imdb_search,
                    imdb_id, 
                    movie;

                var results = $('tr.findResult');
                var year_regex = /\(([0-9]+)\)/;

                var movies = [];
                results.each(function(i, element) {
                    // IMDB Search text
                    imdb_search = $(this).find('.result_text');
                    imdb_year_str = imdb_search.html().split('</a>')[1].trim();
                    imdb_year = imdb_year_str.match(year_regex);
                    if(!!imdb_year && imdb_year.length >= 1) {
                        imdb_year = imdb_year[1];
                    }

                    // IMDB Link
                    imdb_link = $(this).find('.result_text a');
                    imdb_url = imdb_link.attr('href').split('?')[0];
                    imdb_id = imdb_url.split('/')[2];
                    title = imdb_link.html();

                    //Movie
                    movie =  {
                        imdb_url: imdb_url,
                        imdb_id: imdb_id,
                        title: title,
                        year: imdb_year
                    };

                    movies.push(movie);
                });

                // movies = movies.filter(function(x) { 
                //     return x.year == year;
                // });

                eventEmitter.emit('movie', movies[0]);
            }
        });

    return eventEmitter;
}


async.waterfall([
    function(cb){
        var fs = require('fs');
        var path = require('path');
        var readline = require('readline');

        var file_path = path.join(__dirname, 'bsas_locations_by_type_and_year_refine.csv');

        var rd = readline.createInterface({
            input: fs.createReadStream(file_path),
            output: process.stdout,
            terminal: false
        });

        var movie_fields, 
            movie_year,
            movie_type, 
            movie_title;
        
        var movies = [];
        var movies_titles = [];

        rd.on('line', function(line) {
            movie_fields = line.split(',');
            movie_year = movie_fields[0];
            movie_type = movie_fields[1];
            movie_title = movie_fields[3];

            if((movie_type.indexOf('Largometraje') >= 0 || movie_type.indexOf('Document')) >= 0 && movies_titles.indexOf(movie_title) == -1) {
                movies.push({ title: movie_title, year: movie_year });
                movies_titles.push(movie_title);
            }
        }).on('close', function() {
            cb(null, movies);
        });
    },
    function(movies_csv, cb){
        var movies = {};
        var movies_search = 0;
        var movies_requested = 0;
        var movie_csv;

        for(var i = 0; i < 100; i++) {
            movie_csv = movies_csv[i];

            search_imdb(movie_csv.title, movie_csv.year)
                .on('movie', function(movie) {
                    if(!!movie) {
                        movies_search++;
                        request(imdb_movie + movie.imdb_id, 
                                function(error, response, body) {
                                    var $ = cheerio.load(body, {
                                        decodeEntities: true,
                                        normalizeWhitespace: true
                                    });

                                    movie.description = $('p[itemprop="description"]').text().replace('\n', '');
                                    movie.rating = $('.star-box-giga-star').text();
                                    movie.poster = $('#img_primary').find('img').attr('src');
                                    movie.actors = $('div[itemprop="actors"] span[itemprop="name"]').text().trim();
                                    movie.directors = $('div[itemprop="directors"] span[itemprop="name"]').text().trim();
                                    movie.duration = $('time[itemprop="duration"]').text().trim();

                                    movies[movie.title] = movie;

                                    movies_requested++;
                                    if(movies_search == movies_requested) {
                                        cb(null, movies);
                                    }
                                });
                    }
                });
        }
    },
],
function(err, results){
    console.info("hola");
    console.info(results);
});
