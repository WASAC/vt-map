# vt-map
![GitHub](https://img.shields.io/github/license/narwassco/vt-map)
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/narwassco/vt-map)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/narwassco/vt-map)
[![Gitter](https://badges.gitter.im/narwassco/community.svg)](https://gitter.im/narwassco/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

This repository is no longer available. Its functionality shifted to [WASAC/vt](https://github.com/WASAC/vt) repository.

This is a simple tool to create vector tile map on Github pages.

## Design of vectortiles
You can see vectortiles' design for `WASAC` from this [wiki](https://github.com/WASAC/vt-map/wiki/Vector-Tile-Design-for-WASAC).

## Installation
### tippecanoe
This module uses [`tippecanoe`](https://github.com/mapbox/tippecanoe) to convert geojson files to mbtiles. Please make sure to install it before running.

for MacOS
```
$ brew install tippecanoe
```

for Ubuntu
```
$ git clone https://github.com/mapbox/tippecanoe.git
$ cd tippecanoe
$ make -j
$ make install
```

### mbutil
This module uses [mbutil](https://github.com/mapbox/mbutil) to extract mvt files from mbtiles. Please make sure install it on your python3.

for MacOS & Ubuntu
```
git clone git://github.com/mapbox/mbutil.git
cd mbutil
sudo python setup.py install
```

### main module
```
git clone https://github.com/narwassco/vt-map.git
npm install
```

## Configuration
All the settings are in `config.js`, so please make sure your own settings on this file before producing vector tile.

Please create `app-docker.env` file under project root directory to put environment variable for database settings.
```
export_dir=/tmp/src/vt-map

db_user=postgres
db_password=Your password
db_host=host.docker.internal
db_post=5432
db_name=narwassco
```

The stylefile `style.json` under this repository is just for checking the vector tile data.

We are managing Mapbox Stylefile in [narwassco/mapbox-stylefiles](https://github.com/narwassco/mapbox-stylefiles).

## Create vector tile from your PostGIS database by using Docker

Build Docker Image
```
docker build -t narwassco/vt-map .
```

Create Vector Tile and sprite files under public directory.
```
docker-compose up
```

## Create vector tile from your PostGIS database by using local Nodejs
It will retrieve the data from PostGIS as mbtiles format, then vector tiles (.mvt) were extracted under `public/tiles` folder.
```
npm run build
```

## Deploy to gh-pages
It will push all of website contents  under public folder to Github pages.
```
npm run deploy
```

# License

This source code under the repository is licensed by 
`MIT license`. You can use it freely for your purposes.

However, these data under [public](./public) is owned and maintained by [Water and Sanitation Corporation (WASAC)(https://www.wasac.rw) in Rwanda. It is under a [Creative Commons Attribution 4.0 International
License](http://creativecommons.org/licenses/by/4.0/), which is different from main repository. You can use this data freely, but please mention our credit `©WASAC,Ltd.` on attribution of your web application.

---
Copyright (c) 2020 Water and Sanitation Corporation, Ltd.
