
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

        this.setState({ venues: this.formatData(data) });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('error', error);

      });
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <div className="buttons-holder">
            <button className="main-page">Main Page</button>
            <button className="favorites">Favorites</button>
          </div>

        </div>
        <h1 className= "tripster-header">Tripster</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.searchtext} name="searchtext" placeholder="City" onChange={this.handlechange} />
          <input type="text" value={this.state.activity} name="activity" placeholder="Acitivity" onChange={this.handlechange} />
          <button type="submit">Search</button>
        </form>
        {
          this.state.venues.map((venue, i) => (
            <div className="venue-card" key={`venue-${i}`}>
              <img src={`${venue.prefix}.png`} alt="location image"/>
              <div>
                <h3>{venue.name}</h3>
                <p>{venue.pluralName}</p>
                <p>{venue.address}</p>
              </div>
            </div>
          ))
        }
      </div>
    );
  }

}

export default App;
