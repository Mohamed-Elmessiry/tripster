import React from 'react';

const Venue = () => {
  const venue = JSON.parse(localStorage.getItem('venue'));
  if (!venue) {
    return <></>;
  }
  let menuClass = 'hidden';
  if (venue.menuUrl) {

    menuClass = 'show';
    // document.getElementById('btnMenu').style.display = 'none';
  }
  const onSave = e => {
    alert('save');
  };
  const onMenu = e => {
    window.open(venue.menuUrl);
  };
  const mainPageClicked = e => {
    window.location.replace('/');
  };
  return (
    <div className={venue ? 'app-white' : 'app'}>
      <div className={venue ? 'header-orange' : 'header'}>
        <div className="buttons-holder">
          <button className={!venue ? 'main-page' : 'main-page-orange'} onClick={mainPageClicked}>Main Page</button>
          <button className={!venue ? 'favorites' : 'favorites-orange'}>Favorites</button>
        </div>
        <section>
          <div>
            <img
              height={200}
              width={200}
              src={venue.imageUrl}
              alt="venue image"
            />
          </div>
          <div className="venue-text">
            <h3 className="venue-names">{venue.name}</h3>
            <p className="venue-category">{venue.pluralName}</p>
            <p className="venue-address">{venue.address}</p>
          </div>
          <div>
            <button onClick={onSave}>Save</button>

            <button className={menuClass} id='btnMenu' onClick={onMenu}>Menu</button>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Venue;
