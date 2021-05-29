/* eslint-disable no-console */
require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const fetch = require('node-fetch');
const ClientError = require('./client-error');
const cors = require('cors');
// const { query } = require('express');

const app = express();
app.use(cors());

// eslint-disable-next-line no-unused-vars
const formatData = json => {
  // console.log(JSON.stringify(json));
  return json.response.venues
    .map(({ id, location, name, categories }) => {
      const { address } = location;
      const { pluralName } = categories[0];
      // The id is going to be used here: https://api.foursquare.com/v2/venues/{{ID GOES HERE}}/photos?v=20210514
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

  fetch(`https://api.foursquare.com/v2/venues/${id}/photos?v=20210514`)
    .then(data => data.json())
    .then(photodata => {
      const item = photodata.response.photos.items[0];

      // console.log(`${item.prefix}/${item.height}x${item.width}/${item.suffix}`);
      return (`${item.prefix}/${item.height}x${item.width}/${item.suffix}`);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.get('/api/venues/:city?/:search?', (req, res, next) => {
  const searchQuery = req.params.search;
  const cityname = req.params.city;
  if (!searchQuery || !cityname) {
    throw new ClientError(400, 'please provide the required information');
  }

  fetch(
    `https://api.foursquare.com/v2/venues/search?client_id=EZOAI304JHK222F243HNN4KULBKUGKG10DPYVDWCHNJWB3HT&client_secret=IG3AUD5AEZ1TVO5PMT43BYTL2WRTIRSKWBUFQ4HZAVTZJYI3&v=20210514&near=${cityname}&intent=browse&radius=10000&query=${searchQuery}&limit=10`
  )
    .then(data => data.json())
    .then(json => {
      return formatData(json);
    }) // this is fetch res
    .then(data => {
      res.status(200).json(data.response.venues);
    });

  // .then(results => res.json(results)); // this is express res
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

// id
// https://api.foursquare.com/v2/venues/525da4dc498eb92d634abb7a/photos?v=20210514

// suffix
// https://fastly.4sqi.net/img/general/500x500/oXTsiXVZQz7jO3U7jEhKljgcVg9R0_IxaRHfQ9tBubI.jpg
