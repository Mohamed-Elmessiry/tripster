
import React, { useEffect, useState } from 'react';

const App = () => {
  const [venues, setVenues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [imageLinks, setImageLinks] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    venues.forEach((venue, i) => {

      if (i > 1) return null;

      fetch(`/api/venue/image/${venue.id}`)
        .then(data => data.json())
        .then(res => {
          const newImageLinks = imageLinks.concat({ id: venue.id, url: res.imgUrl });

          setImageLinks(newImageLinks);
        });
    });
  }, [venues]);

  const handleSubmit = e => {
    event.preventDefault();
    const api = `/api/venues/${searchCity}/${searchText}`;
    fetch(api)
      .then(res => {
        return res.json();
      })
      .then(venues => {
        setVenues(venues);
      });
    console.error();
  };

  const mainPageClicked = e => {
    e.preventDefault();
    setVenues([]);
  };

  return (
    <div className={venues.length > 0 ? 'app-white' : 'app'}>
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
          )
        : (
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
