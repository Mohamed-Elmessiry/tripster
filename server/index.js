require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const fetch = require('node-fetch');
const ClientError = require('./client-error');
// const { query } = require('express');

const app = express();

app.use(staticMiddleware);

app.get('/api/venues/:city?/:search?', (req, res, next) => {
  const searchQuery = req.params.search;
  const cityname = req.params.city;
  if (!searchQuery || !cityname) {
    throw new ClientError(400, 'please provide the required information');
  }

  fetch(
    `https://api.foursquare.com/v2/venues/search?client_id=EZOAI304JHK222F243HNN4KULBKUGKG10DPYVDWCHNJWB3HT&client_secret=IG3AUD5AEZ1TVO5PMT43BYTL2WRTIRSKWBUFQ4HZAVTZJYI3&v=20210514&near=${cityname}&intent=browse&radius=10000&query=${searchQuery}&limit=10`
  )
    .then(res => res.json()) // this is fetch res
    .then(results => res.json(results)); // this is express res
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});