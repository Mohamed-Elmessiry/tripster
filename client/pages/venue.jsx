import React from 'react';

const Venue = () => {
  const venue = JSON.parse(localStorage.getItem('venue'));
  if (!venue) {

    return <></>;
  }

  let menuClass = 'hidden';
  if (venue.menuUrl) {

    menuClass = 'show';
  }

  const onSave = e => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venue)
    };
    fetch('/api/user/addFavorite/', requestOptions).then(res => {
    });
  };
  const goFavorites = e => {
    localStorage.setItem('favorites', 'true');
    window.location.replace('/');
  };
  const goMainMenu = e => {
    localStorage.removeItem('favorites');
    window.location.replace('/');
  };
  const onMenu = e => {
    localStorage.removeItem('favorites');
    window.open(venue.menuUrl);
  };

  return (
    <div className={venue ? 'app-white' : 'app'}>
      <div className={venue ? 'header-orange' : 'header'}>
        <div className="buttons-holder">

          <button onClick={goMainMenu} className={!venue ? 'main-page' : 'main-page-orange'} >Main Page</button>
          <button onClick={goFavorites} className={!venue ? 'main-page' : 'main-page-orange'} >Favorites</button>

        </div>
        <section className='single-view-section'>
          <div className='single-view-image-holder'>
            <img className= 'single-view-img'

              src={venue.imageUrl}
              alt="venue image"
            />
          </div>
          <div className="venue-text-single">
            <h3 className="venue-names-single">{venue.name}</h3>
            <div className="venue-details-single">
              <p className="venue-category-single">{venue.pluralName}</p>
              <p className="venue-address-single">{venue.address}</p>
            </div>

          </div>
          <div className="bottomButtons">
            <button className="save-button" onClick={onSave}>Save</button>

            <button className={menuClass} id='btnMenu' onClick={onMenu}>Menu</button>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Venue;
