
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchtext: '', venues: [], activity: '' };
    this.text = '';
    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlechange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ [name]: value });

  }

  formatData(venues) {
    return venues.map(({ location, name, categories }) => {
      const { address } = location;
      const { pluralName, icon: { prefix } } = categories[0];
      return {
        address,
        name,
        prefix,
        pluralName
      };
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const activity = this.state.activity;
    const location = this.state.searchtext;
    const api = `http://localhost:3001/api/venues/${location}/${activity}`;
    fetch(api)
      .then(res => {
        return res.json();
      })
      .then(data => {
        // eslint-disable-next-line no-debugger
        // eslint-disable-next-line no-console
        console.log(data);
        // eslint-disable-next-line no-console

        this.setState({ venues: data });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('error', error);

      });
  }

  render() {
    return (
      <div className={this.state.venues.length > 0 ? 'App-white' : 'App'}>
        <div className={this.state.venues.length > 0 ? 'header-orange' : 'header'}>
          <div className="buttons-holder">
            <button className="main-page">Main Page</button>
            <button className="favorites">Favorites</button>
          </div>

        </div>
        {this.state.venues.length > 0
          ? (
          <>
          <h1>Results</h1>
          <section>

          {
            this.state.venues.map((venue, i) => (
              <div className="venue-card" key={`venue-${i}`}>
                <img src={`${venue.prefix}64.png`} alt="location image" />
                <div>
                  <span>{venue.prefix}.png</span>
                  <h3 className="venue-names">{venue.name}</h3>
                  <p className="venue-category">{venue.pluralName}</p>
                  <p className="venue-address">{venue.address}</p>
                </div>
              </div>
            ))
          }
              </section>
          </>
            )
          : (
          <>
              <h1 className="tripster-header">Tripster</h1>
              <form onSubmit={this.handleSubmit}>
                <input className="city-input" type="text" value={this.state.searchtext} name="searchtext" placeholder="City" onChange={this.handlechange} />
                <input className="activity-input" type="text" value={this.state.activity} name="activity" placeholder="Activity" onChange={this.handlechange} />
                <button className="search" type="submit">Search</button>
              </form>

          </>
            )}

      </div>
    );
  }

}

export default App;
