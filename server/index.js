
/* eslint-disable no-console */
require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const fetch = require('node-fetch');
const ClientError = require('./client-error');

const app = express();

const formatData = json => {
  return json.response.venues
    .map(({ id, location, name, categories }) => {
      const { address } = location;
      const { pluralName } = categories[0];

      return {
        id,
        address,
        name,
        pluralName
      };
    });
};

app.use(staticMiddleware);

app.get('/api/venue/image/:id?', (req, res, next) => {
  const id = req.params.id;

  fetch(`https://api.foursquare.com/v2/venues/${id}/photos?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&v=20210514`)

    .then(data => data.json())
    .then(photodata => {
      const item = photodata.response.photos.items[0];
      const imgUrl = `${item.prefix}${item.height}x${item.width}${item.suffix}`;
      res.send({ imgUrl });
    })
    .catch(error => {
      next(res.send(error));
    });
});

app.get('/api/venues/:city/:search', (req, res, next) => {
  const searchQuery = req.params.search;
  const cityname = req.params.city;
  if (!searchQuery || !cityname) {
    throw new ClientError(400, 'please provide the required information');
  }

  fetch(
    `https://api.foursquare.com/v2/venues/search?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&near=${cityname}&intent=browse&radius=10000&query=${searchQuery}&limit=1`
  )
    .then(data => data.json())
    .then(json => {
      res.send(formatData(json));
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
