const postgis2mbtiles = require('postgis2mbtiles');
const Mbtiles2pbf = require('mbtiles2pbf');
const {postgis2geojson} = require('@watergis/postgis2geojson');
const config = require('./config');
const configSearch = require('./config-search');

const VtMapCreator = () =>{
    console.time('vt-map');
    //create geojson file for search function
    createGeoJSONSearch();

    const pg2mbtiles = new postgis2mbtiles(config);
    pg2mbtiles.run().then(res=>{
        console.log(res);
        //create mapbox vectortile
        const mbtiles2pbf = new Mbtiles2pbf(config.mbtiles, config.ghpages.tiles);
        mbtiles2pbf.run();

    }).catch(err=>{
        console.log(err);
    }).finally(()=>{
        console.timeEnd('vt-map');
    })
};

const createGeoJSONSearch = async() =>{
    const pg2json = new postgis2geojson(configSearch);
    await pg2json.run().then(res=>{
        res.forEach(f=>{console.log(f)});
    }).catch(err=>{console.log(err)});
}

module.exports = VtMapCreator();