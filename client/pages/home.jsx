/* eslint-disable multiline-ternary */

import React, { useEffect, useState } from 'react';

const App = () => {
  const [venues, setVenues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [imageLinks, setImageLinks] = useState([]);
  const baseUrl = 'http://localhost:3001';

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    venues.map((venue, i) => {

      if (i > 1) return null;

      fetch(`${baseUrl}/api/venue/image/${venue.id}`)
        .then(data => data.json())
        .then(res => {
          imageLinks.push({ id: venue.id, url: res.imgUrl });

          const copiedImageLinks = JSON.parse(JSON.stringify(imageLinks));

          setImageLinks(copiedImageLinks);
        });
    });
  }, [venues]);

  const handleSubmit = e => {
    event.preventDefault();
    const api = `${baseUrl}/api/venues/${searchCity}/${searchText}`;
    fetch(api)
      .then(res => {
        return res.json();
      })
      .then(venues => {
        setVenues(venues);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('error', error);
      });
  };

  const mainPageClicked = e => {
    e.preventDefault();
    setVenues([]);
  };

  return (
    <div className={venues.length > 0 ? 'App-white' : 'App'}>
      <div className={venues.length > 0 ? 'header-orange' : 'header'}>
        <div className="buttons-holder">
          <button className={venues.length === 0 ? 'main-page' : 'main-page-orange'} onClick={mainPageClicked}>Main Page</button>
          <button className={venues.length === 0 ? 'favorites' : 'favorites-orange'}>Favorites</button>
        </div>

      </div>
      {venues.length > 0
        ? (
          <>
            <h1 className= "results">Results</h1>
            <section>

              {
                venues.map((venue, i) => {

                  let imageLink = null;
                  if (imageLinks.length > 0) {
                    imageLink = imageLinks.find(({ id }) => {
                      return id === venue.id;
                    });
                  }
                  return (
                    <div className="venue-card" key={`venue-${i}`}>
                      {
                        imageLink && imageLink.url && <img height={200} width={200} src={imageLink.url} alt="location image" />
                      }
                      <div className="venue-text">
                        <h3 className="venue-names">{venue.name}</h3>
                        <p className="venue-category">{venue.pluralName}</p>
                        <p className="venue-address">{venue.address}</p>
                      </div>
                    </div>
                  );
                })
              }
            </section>
          </>
          ) : (
          <>
            <h1 className="tripster-header">Tripster</h1>
            <form onSubmit={handleSubmit}>
              <input
                className="city-input"
                type="text"
                value={searchCity}
                name="searchText"
                placeholder="City"
                onChange={e => setSearchCity(e.target.value)}
              />
              <input
                className="activity-input"
                type="text"
                value={searchText}
                name="activity"
                placeholder="Activity"
                onChange={e => setSearchText(e.target.value)}
              />
              <button className="search" type="submit">Search</button>
            </form>

          </>
          )}
    </div>
  );
};

export default App;
