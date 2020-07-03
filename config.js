require('dotenv').config();
const env = process.env;

const export_dir = env.export_dir || __dirname;

module.exports = {
    db: {
      user:env.db_user,
      password:env.db_password,
      host:env.db_host,
      post:env.db_port,
      database:env.db_name,
    },
    ghpages:{
      tiles: export_dir + '/public/tiles'
    },
    mbtiles: export_dir + '/rwss.mbtiles',
    minzoom: 8,
    maxzoom: 14,
    layers : [
        {
            name: 'pipeline',
            geojsonFileName: export_dir + '/pipeline.geojson',
            select: `
            SELECT row_to_json(featurecollection) AS json FROM (
              SELECT
                'FeatureCollection' AS type,
                array_to_json(array_agg(feature)) AS features
              FROM (
                SELECT
                  'Feature' AS type,
                  ST_AsGeoJSON(ST_MakeValid(x.geom))::json AS geometry,
                  row_to_json((
                    SELECT t FROM (
                      SELECT
                        14 as maxzoom,
                        11 as minzoom
                    ) AS t
                  )) AS tippecanoe,
                  row_to_json((
                    SELECT p FROM (
                      SELECT
                        x.pipe_id as fid,
                        x.material,
                        x.pipe_size,
                        x.pressure,
                        x.construction_year,
                        x.rehabilitation_year,
                        x.input_date
                    ) AS p
                  )) AS properties
                FROM pipeline x
                WHERE NOT ST_IsEmpty(x.geom)
              ) AS feature
            ) AS featurecollection
            `
        },
        {
          name: 'connection',
          geojsonFileName: export_dir + '/connection.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.connection_id as fid, 
                    x.connection_type,
                    x.no_user, 
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.input_date, 
                    x.construction_year, 
                    x.rehabilitation_year
                ) AS p
              )) AS properties
              FROM water_connection x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'chamber',
          geojsonFileName: export_dir + '/chamber.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.chamber_id as fid, 
                    x.chamber_type, 
                    x.chamber_size, 
                    x.material, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.is_breakpressure, 
                    x.chlorination_unit, 
                    x.construction_year,
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM chamber x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'watersource',
          geojsonFileName: export_dir + '/watersource.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    12 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.watersource_id as fid, 
                    x.source_type, 
                    x.discharge,  
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.chlorination_unit, 
                    x.source_protected, 
                    x.construction_year,
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM watersource x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'reservoir',
          geojsonFileName: export_dir + '/reservoir.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    12 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                    x.reservoir_id as fid, 
                    x.reservoir_type,
                    x.capacity, 
                    x.material, 
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.is_breakpressure, 
                    x.meter_installation_date, 
                    x.chlorination_unit, 
                    x.construction_year, 
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM reservoir x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom) 
            ) AS feature
          ) AS featurecollection
          `
        },
        {
            name: 'pumping_station',
            geojsonFileName: export_dir + '/pumping_station.geojson',
            select:`
            SELECT row_to_json(featurecollection) AS json FROM (
              SELECT
                'FeatureCollection' AS type,
                array_to_json(array_agg(feature)) AS features
              FROM (
                SELECT
                'Feature' AS type,
                ST_AsGeoJSON(x.geom)::json AS geometry,
                row_to_json((
                  SELECT t FROM (
                    SELECT
                      14 as maxzoom,
                      12 as minzoom
                  ) AS t
                )) AS tippecanoe,
                row_to_json((
                  SELECT p FROM (
                    SELECT
                      x.pumpingstation_id as fid, 
                      a.status, 
                      x.head_pump, 
                      x.power_pump, 
                      x.discharge_pump, 
                      x.pump_type, 
                      x.power_source, 
                      x.no_pump, 
                      x.kva, 
                      x.no_generator, 
                      x.observation, 
                      x.elevation, 
                      x.pump_installation_date, 
                      x.meter_installation_date, 
                      x.capacity_antihummber, 
                      x.water_meter, 
                      x.chlorination_unit, 
                      x.installation_antihummer, 
                      x.construction_year, 
                      x.rehabilitation_year,
                      x.input_date
                  ) AS p
                )) AS properties
                FROM pumping_station x
                INNER JOIN status a
                ON x.status = a.code
                WHERE NOT ST_IsEmpty(x.geom)
              ) AS feature
            ) AS featurecollection
            `
        },
        // {
        //   name: 'parcels',
        //   geojsonFileName: export_dir + '/parcels.geojson',
        //   select:`
        //   SELECT row_to_json(featurecollection) AS json FROM (
        //     SELECT
        //       'FeatureCollection' AS type,
        //       array_to_json(array_agg(feature)) AS features
        //     FROM (
        //       SELECT
        //       'Feature' AS type,
        //       ST_AsGeoJSON(x.geom)::json AS geometry,
        //       row_to_json((
        //         SELECT t FROM (
        //           SELECT
        //             18 as maxzoom,
        //             16 as minzoom
        //         ) AS t
        //       )) AS tippecanoe,
        //       row_to_json((
        //         SELECT p FROM (
        //         SELECT
        //           x.fid,
        //           x."Parcel_ID" parcel_no
        //         ) AS p
        //       )) AS properties
        //       FROM parcels x
        //       WHERE NOT ST_IsEmpty(x.geom)
        //     ) AS feature
        //   ) AS featurecollection
        //   `
        // },
        // {
        //   name: 'parcels_annotation',
        //   geojsonFileName: export_dir + '/parcels_annotation.geojson',
        //   select:`
        //   SELECT row_to_json(featurecollection) AS json FROM (
        //     SELECT
        //       'FeatureCollection' AS type,
        //       array_to_json(array_agg(feature)) AS features
        //     FROM (
        //       SELECT
        //       'Feature' AS type,
        //       ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
        //       row_to_json((
        //         SELECT t FROM (
        //           SELECT
        //             18 as maxzoom,
        //             17 as minzoom
        //         ) AS t
        //       )) AS tippecanoe,
        //       row_to_json((
        //         SELECT p FROM (
        //         SELECT
        //           x.fid,
        //           x."Parcel_ID" parcel_no
        //         ) AS p
        //       )) AS properties
        //       FROM percels x
        //       WHERE NOT ST_IsEmpty(x.geom)
        //     ) AS feature
        //   ) AS featurecollection
        //   `
        // },
        {
          name: 'wss',
          geojsonFileName: export_dir + '/wss.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    9 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.wss_id,  
                  x.wss_type
                ) AS p
              )) AS properties
              FROM wss x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'wss_annotation',
          geojsonFileName: export_dir + '/wss_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    11 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.wss_id, 
                  x.wss_name
                ) AS p
              )) AS properties
              FROM wss x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'district',
          geojsonFileName: export_dir + '/district.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    8 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.dist_id
                ) AS p
              )) AS properties
              FROM district x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'district_annotation',
          geojsonFileName: export_dir + '/district_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    11 as maxzoom,
                    8 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.dist_id, 
                  x.district
                ) AS p
              )) AS properties
              FROM district x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'sector',
          geojsonFileName: export_dir + '/sector.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    10 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.sect_id
                ) AS p
              )) AS properties
              FROM sector x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'sector_annotation',
          geojsonFileName: export_dir + '/sector_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    10 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.sect_id, 
                  x.sector
                ) AS p
              )) AS properties
              FROM sector x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'cell',
          geojsonFileName: export_dir + '/cell.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    13 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.cell_id
                ) AS p
              )) AS properties
              FROM cell x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'cell_annotation',
          geojsonFileName: export_dir + '/cell_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    13 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.cell_id, 
                  x.cell
                ) AS p
              )) AS properties
              FROM cell x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'village',
          geojsonFileName: export_dir + '/village.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.vill_id
                ) AS p
              )) AS properties
              FROM village x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'village_annotation',
          geojsonFileName: export_dir + '/village_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.vill_id, 
                  x.village
                ) AS p
              )) AS properties
              FROM village x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        }
    ],
};
