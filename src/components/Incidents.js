import React, { Component } from 'react';
import Incident from './Incident';

const initialState = {
    incidents: []
};

class Incidents extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    async componentDidMount(props) {
        try {
            const response = await this.props.client.retrieveAllIncidents();
            this.setState({
                incidents: response.data
            });
        } catch (error) {
            this.setState({
                error: `Unable to retrieve the incidents, please try again: ${error.message}`
            });
        }
    }

    render() {
        const incidents = this.state.incidents;
        console.log('incidents: ', incidents);

        return (
            <div>
                {incidents &&
                    incidents.map((incident) => {
                        return (<Incident key={incident.geolocationTimestamp} incident={incident} />);
                    })
                }
            </div>
        );
    }
}

export default Incidents;