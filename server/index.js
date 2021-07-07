require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const ClientError = require('./client-error');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tripster',
  password: 'Trip1234',
  database: 'tripster',
  port: '8889'
});

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

app.get('/api/venue/:id', (req, res, next) => {
  const id = req.params.id;
  const uri = `https://api.foursquare.com/v2/venues/${id}/?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&limit=4`;

  fetch(uri)
    .then(data => data.json())
    .then(json => {
      res.send(json);
    });
});
app.get('/api/venues/:city/:search', (req, res, next) => {
  const searchQuery = req.params.search;
  const cityname = req.params.city;
  if (!searchQuery || !cityname) {
    throw new ClientError(400, 'please provide the required information');
  } else {

    fetch(
    `https://api.foursquare.com/v2/venues/search?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&v=20210514&near=${cityname}&intent=browse&radius=10000&query=${searchQuery}&limit=2`
    )
      .then(data => data.json())
      .then(json => {

        res.send(formatData(json));
      });
  }
});
app.get('/create', (req, res, next) => {

  connection.query("DELETE FROM favorites WHERE venue_json = '456'", function (err) {
    if (err) {

      throw new ClientError(400, 'Information not found');
    } else {
      res.end('created');
    }
  });

});
app.get('/dbtest', (req, res, next) => {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) {
      console.error(err);
      throw new ClientError(400, 'Information not found');
    } else {
      res.send(rows);
    }
  });
});
app.get('/api/user/favorites', (req, res, next) => {

  connection.query('SELECT venue_json FROM favorites', (qErr, qRes) => {
    if (qErr) {
      console.error(qErr);
      res.status(400).send('error retrieving venue');
    } else {
      const data = [];
      qRes.forEach(row => {
        data.push(JSON.parse(row.venue_json));
      });
      res.send(data);
    }
  });

});
app.get('/api/favorites', (req, res, next) => {

  connection.query('SELECT * FROM favorites', (qErr, qRes) => {
    if (qErr) {
      console.error(qErr);
      res.status(400).send('error retrieving venue');
    } else {
      const data = [];
      qRes.forEach(row => {
        data.push(JSON.parse(row.venue_json));
      });
      res.send(data);
    }
  });

});
app.get('/api/user/favorites/remove/:id', (req, res, next) => {
  const id = req.params.id;
  const query = "DELETE FROM favorites WHERE id = '" + id + "'";
  connection.query(query, function (err) {
    if (err) {

      throw new ClientError(400, 'Information not found');
    } else {
      res.end('deleted');
    }

  });
});
app.get('/api/get/allposts', (req, res, next) => {
  connection.query('SELECT * FROM posts ORDER BY date_created DESC', (qErr, qRes) => {

    if (qErr) {
      console.error(qErr);

      res.status(400).send('error retrieving all posts');
    } else if (qRes && qRes.rows) {
      res.json(qRes.rows);
    } else {
      res.end('no data found');
    }
  });
});

app.get('/api/mock', (req, res, next) => {
  connection.query('SELECT * FROM mock', (qErr, qRes) => {
    if (qRes && qRes.rows) {
      res.json(qRes.rows);
    } else {

      console.error(qErr);
      res.status(400).send('error retreiving information');
    }
  });
});

app.get('/api/posts', (req, res, next) => {
  connection.query('SELECT * FROM posts', (qErr, qRes) => {
    if (qRes && qRes.rows) {
      res.json(qRes.rows);
    } else {

      console.error(qErr);
      res.status(400).send('error retreiving data from posts');
    }
  });
});

app.get('/api/user/addFavorite/:str', (req, res, next) => {

  const str = '{}';
  const obj = JSON.parse(str);
  const id = obj.id;
  const params = [id, 'tester', str];
  connection.query('INSERT INTO favorites (id, username, venue_json) VALUES (?,?,?)', params,
    (qErr, qRes) => {
      if (qErr) {
        console.error(qErr);
        res.status(404).send('requested info not found');
      } else {
        res.json(qRes.rows);
      }

    });
});

app.post('/api/user/addFavorite/', (req, res, next) => {
  const body = req.body;
  const id = body.id;
  const strBody = JSON.stringify(body);
  const params = [id, 'tester', strBody];
  connection.query('INSERT INTO favorites (id, username, venue_json) VALUES (?,?,?)', params, (qErr, qRes) => {
    if (qErr) {
      console.error(qErr);
      res.status(404).send('requested info not found');
    } else {
      res.json(qRes.rows);
    }
  });

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
