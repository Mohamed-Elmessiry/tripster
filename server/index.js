
/* eslint-disable no-console */
require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const ClientError = require('./client-error');
const path = require('path');
const sqlite = require('sqlite3');

const app = express();

const formatData = json => {
  return json.response.venues
    .map(({ id, location, name, categories, delivery }) => {
      const { address } = location;
      const { pluralName } = categories[0];
      let url = null;

      if (delivery != null) {
        if ('url' in delivery) {
          url = delivery.url;
        }
      }

      return {
        id,
        address,
        name,
        pluralName,
        menuUrl: url,
        imageUrl: null
      };
    });
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

app.get('/api/venue/image/:id?', (req, res, next) => {
  const id = req.params.id;
  const uri = `https://api.foursquare.com/v2/venues/${id}/photos?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&v=20210514`;
  fetch(uri)

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
app.get('/api/venue/:id', (req, res, next) => {
  const id = req.params.id;
  const uri = `https://api.foursquare.com/v2/venues/${id}/?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&limit=4`;

  fetch(uri)
    .then(data => data.json())
    .then(json => {
      res.send(json);
      res.end();
    });
});
app.get('/api/venues/:city/:search', (req, res, next) => {
  const searchQuery = req.params.search;
  const cityname = req.params.city;
  if (!searchQuery || !cityname) {
    throw new ClientError(400, 'please provide the required information');
  }

  fetch(
    `https://api.foursquare.com/v2/venues/search?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&near=${cityname}&intent=browse&radius=10000&query=${searchQuery}&limit=4`
  )
    .then(data => data.json())
    .then(json => {

      res.send(formatData(json));
    });
});
app.get('/create', (req, res, next) => {
  const db = new sqlite.Database('./tripster.db');

  db.run("DELETE FROM favorites WHERE venue_json = '456'");
  db.close();
  res.end('created');
});
app.get('/api/user/favorites', (req, res, next) => {
  const db = new sqlite.Database('./tripster.db');
  const venues = [];
  db.all('SELECT venue_json FROM favorites', [], (err, rows) => {
    if (err) {
      console.error();
    }
    rows.forEach(function (row) {
      const obj = JSON.parse(row.venue_json);
      venues.push(obj);
    });
    res.send(venues);
    db.close();
    res.end();
  });
});
app.get('/api/user/addFavorite/:str', (req, res, next) => {
  const db = new sqlite.Database('./tripster.db');
  const str = req.params.str;
  const params = ['tester', str];
  db.run('INSERT INTO favorites (username, venue_json) VALUES (?,?)', params);

  db.close();
  res.end('saved');

});
app.post('/api/user/addFavorite/', (req, res, next) => {
  const body = req.body;
  const strBody = JSON.stringify(body);

  const db = new sqlite.Database('./tripster.db');

  const params = ['tester', strBody];
  db.run('INSERT INTO favorites (username, venue_json) VALUES (?,?)', params);

  db.close();

  res.end(strBody);
});
app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
