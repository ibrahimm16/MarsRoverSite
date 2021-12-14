import React from 'react';

class RoverComponent extends React.Component {
    constructor(props) {
        super(props);

        const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

        this.state = {
            selectedRover: "curiosity",
            selectedDate: "",
            today: today,
            minDate: "2012-08-06",
            maxDate: today,
            apiData: [],
            imgSrc: "https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png",
            index: 0,
            maxIndex: 0,
            displayDate: "No date selected"
        }

        this.changeRover = this.changeRover.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    changeRover(e) {
        // Hash of operational days for each rover
        const minMax = new Map([
            ["curiosity", ["2012-08-06", this.state.today]],
            ["opportunity", ["2004-01-26", "2018-06-09"]],
            ["perseverance", ["2021-02-27", this.state.today]],
            ["spirit", ["2004-01-05", "2010-03-21"]]
        ]);

        const roverChoice = e.target.value;

        // Update the state with the newly selected rover and its operational days
        this.setState({
            selectedRover: roverChoice,
            minDate: minMax.get(roverChoice)[0],
            maxDate: minMax.get(roverChoice)[1]
        })
    }

    changeDate(e) {
        let date = e.target.value;

        // Format the day, month, and year from the calendar to form an api query and display date
        let day = date.substring(8, 10);
        if (day.substring(0, 1) === 0) {
            day = day.substring(1, 2);
        }
        let month = date.substring(5, 7);
        if (month.substring(0, 1) === 0) {
            month = month.substring(1, 2);
        }
        let year = date.substring(0, 4);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Update the state based upon the new date
        this.setState({
            selectedDate: `?earth_date=${year}-${month}-${day}`,
            displayDate: `${months[parseInt(month) - 1]} ${day}, ${year}`
        })
    }

    submitRequest() {
        // Data required to fetch a json from the nasa api
        const api = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';
        const key = '&api_key=W0JTYr31WWFst27Jqc2mkPzSJhCIBaKtWBy3dfcS';
        const query = `${api}${this.state.selectedRover}/photos${this.state.selectedDate}${key}`;

        // Use the query to return a json result from the api
        fetch(query)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // Check if the query returned valid data and update the page accordingly
                if (data.photos.length !== 0) {
                    this.setState({
                        apiData: data,
                        index: 0,
                        maxIndex: data.photos.length - 1,
                        imgSrc: data.photos[0].img_src
                    })
                } else {
                    this.setState({
                        apiData: [],
                        index: 0,
                        maxIndex: 0,
                        imgSrc: "https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png",
                    })
                }
            })
    }

    // Check input from the scroll wheel by the user
    changeIndex(e) {
        if (e.deltaY > 0) {
            this.next();
        } else {
            this.previous();
        }
    }

    // Moves to the next image if there is one
    next() {
        let newIndex = this.state.index + 1;
        if (this.state.index !== this.state.maxIndex) {
            this.setState({
                index: newIndex,
                imgSrc: this.state.apiData.photos[newIndex].img_src
            })
        }
    }

    // Moves to the previous image if there is one
    previous() {
        let newIndex = this.state.index - 1;
        if (this.state.index !== 0) {
            this.setState({
                index: newIndex,
                imgSrc: this.state.apiData.photos[newIndex].img_src
            })
        }
    }

    // Render function returns the Display function passing necessary data to it via props
    render() {
        return (
            <Display
                rover={this.state.selectedRover}
                changeRover={this.changeRover}
                date={this.state.displayDate}
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                changeDate={this.changeDate}
                submitRequest={this.submitRequest}
                index={this.state.index + 1}
                maxIndex={this.state.maxIndex + 1}
                changeIndex={this.changeIndex}
                imgSrc={this.state.imgSrc}
            />
        );
    }
}

// Generates the webpage html using the data contained in the props
function Display(props) {
    return (
        <div className="viewport">
            <div className="header">
                <h1>Mars Rover Images</h1>
            </div>
            <div className="rovercontainer">
                <div className="selectioncontainer">
                    <h1 className="bordertext">Rover: {props.rover}</h1>
                    <select className="bordertext" onChange={props.changeRover}>
                        <option value="curiosity">Curiosity</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="perseverance">Perseverance</option>
                        <option value="spirit">Spirit</option>
                    </select>
                </div>
                <div className="selectioncontainer">
                    <h1 className="bordertext">{props.date}</h1>
                    <input className="bordertext" type="date" min={props.minDate} max={props.maxDate} onChange={props.changeDate} />
                    <button className="bordertext" type="button" onClick={props.submitRequest}>Submit Request</button>
                </div>
                <div className="picturecontainer">
                    <h2 className="bordertext">Selected Image: {props.index} of {props.maxIndex}</h2>
                    <img width="450" height="450" src={props.imgSrc} alt="" onWheel={props.changeIndex} />
                </div>
            </div>
        </div>
    );
}

export default RoverComponent;