import React from 'react';

class RoverComponent extends React.Component {
    constructor(props) {
        super(props);

        this.getDate = this.getDate.bind(this);
        this.changeRover = this.changeRover.bind(this);
        this.generateQuery = this.generateQuery.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);

        const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

        this.state = {
            api1: "https://api.nasa.gov/mars-photos/api/v1/rovers/",
            api2: "/photos",
            selectedRover: "curiosity",
            key: "&api_key=W0JTYr31WWFst27Jqc2mkPzSJhCIBaKtWBy3dfcS",
            apiQuery: "",
            submittedQuery: "",
            apiData: [],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            imgSrc: "https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png",
            date: "No date selected",
            index: 0,
            maxIndex: 0,
            today: today,
            minDate: "2012-08-06",
            maxDate: today
        }
    }

    getDate() {
        return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    }

    changeRover(e) {
        let today = this.getDate();
        let minMax = new Map([
            ["curiosity", ["2012-08-06", today]],
            ["opportunity", ["2004-01-26", "2018-06-09"]],
            ["perseverance", [1, 2]],
            ["spirit", [1, 2]]
        ]);

        this.setState({
            selectedRover: e.target.value
            
        })
    }

    generateQuery(e) {
        // Use the date input field to generate a nasa query and formatted date to display to the user
        let date = e.target.value;
        let day = date.substring(8, 10);
        if (day.substring(0, 1) === 0) {
            day = day.substring(1, 2);
        }
        let month = date.substring(5, 7);
        if (month.substring(0, 1) === 0) {
            month = month.substring(1, 2);
        }
        let year = date.substring(0, 4);
        let query = `${this.state.api1}${this.state.selectedRover}${this.state.api2}?earth_date=${year}-${month}-${day}${this.state.key}`;

        // Update the state with the new nasa query and formatted date
        this.setState({
            apiQuery: query,
            date: `Selected date: ${this.state.months[month - 1]} ${day}, ${year}`
        })
    }

    submitRequest() {
        // fetch the data from the nasa api using the generated apiQuery held in the state
        if (this.state.apiQuery !== this.state.submittedQuery) {
            fetch(this.state.apiQuery)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.photos.length !== 0) {
                        this.setState({
                            apiData: data,
                            index: 0,
                            maxIndex: data.photos.length - 1,
                            submittedQuery: this.state.apiQuery,
                            imgSrc: data.photos[0].img_src
                        })
                    } else {
                        alert("No available photos for this date");
                        this.setState({
                            apiData: [],
                            index: 0,
                            maxIndex: 0,
                            submittedQuery: this.state.apiQuery,
                            imgSrc: "https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png",
                        })
                    }
                })
        }
    }

    changeIndex(e) {
        if (e.deltaY > 0) {
            this.next();
        } else {
            this.previous();
        }
    }

    next() {
        let newIndex = this.state.index + 1;
        if (this.state.index !== this.state.maxIndex) {
            this.setState({
                index: newIndex,
                imgSrc: this.state.apiData.photos[newIndex].img_src
            })
        }
    }

    previous() {
        let newIndex = this.state.index - 1;
        if (this.state.index !== 0) {
            this.setState({
                index: newIndex,
                imgSrc: this.state.apiData.photos[newIndex].img_src
            })
        }
    }

    render() {
        return (
            <Display date={this.state.date} rover={this.state.selectedRover} minDate={this.state.minDate} maxDate={this.state.maxDate} changeRover={this.changeRover} generateQuery={this.generateQuery} submitRequest={this.submitRequest} index={this.state.index + 1} maxIndex={this.state.maxIndex + 1} imgSrc={this.state.imgSrc} changeIndex={this.changeIndex} />
        );
    }
}

function Display(props) {
    return (
        <div className="viewport">
            <div className="header">
                {/* <img width="150" height="150"
                    src="https://cdn.discordapp.com/attachments/429121521529651210/912163559310512168/397206-middle.png" alt="" /> */}
                {/* <div className="userdata"> */}
                    <h1>Mars Rover Images</h1>
                {/* </div> */}
                {/* <img width="150" height="150"
                    src="https://cdn.discordapp.com/attachments/429121521529651210/912163559310512168/397206-middle.png" alt="" /> */}
            </div>
            <div className="rovercontainer">
                <div className="selectioncontainer">
                    <h1 className="bordertext">Selected Rover: {props.rover}</h1>
                    <select className="bordertext" onChange={props.changeRover}>
                        <option value="curiosity">Curiosity</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="perseverance">Perseverance</option>
                        <option value="spirit">Spirit</option>
                    </select>
                </div>
                <div className="selectioncontainer">
                    <h1 className="bordertext">{props.date}</h1>
                    <input className="bordertext" type="date" min={props.minDate} max={props.maxDate} onChange={props.generateQuery} />
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