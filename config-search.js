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
    layers : [
        {
          name: 'wss',
          geojsonFileName: export_dir + '/public/wss.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(x.geom))::json AS geometry,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  x.wss_id, 
                  x.wss_name, 
                  a.district,
                  c.po_name
                ) AS p
              )) AS properties
              FROM wss x
              INNER JOIN district a
              ON x.dist_id = a.dist_id
              LEFT JOIN management b
              ON x.wss_id = b.wss_id
              INNER JOIN private_operator c
              ON b.po_id = c.po_id
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
    ],
};
