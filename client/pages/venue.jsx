import React from 'react';

export const Venue = () => {
  const venue = JSON.parse(localStorage.get('venue'));

  if (!venue) {
    return <></>;
  }

  return (
    <div className={venue ? 'app-white' : 'app'}>
      <div className={venue ? 'header-orange' : 'header'}>
        <div className="buttons-holder">
          <button className={venue ? 'main-page' : 'main-page-orange'}>Main Page</button>
          <button className={venue ? 'favorites' : 'favorites-orange'}>Favorites</button>
        </div>
        <section>
          <div>
            <img
              height={200}
              width={200}
              src={'https://cdn.stocksnap.io/img-thumbs/960w/sliced-homemade_5BADCUBZS9.jpg'}
              alt="venue image"
            />
          </div>
          <div className="venue-text">
            <h3 className="venue-names">{venue.name}</h3>
            <p className="venue-category">{venue.pluralName}</p>
            <p className="venue-address">{venue.address}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
