import React from 'react';
import styled from 'styled-components';

const IncidentWrapper = styled.div`
    padding: 5%;
`;

const IncidentLocationInfo = styled.div`
    text-align: left;
    float: left;
    display: block;
`;

const IncidentMedia = styled.div`
    display: block;
`;

const IncidentNote = styled.div`
    display:block;
`;

const Incident = (props) => ({
    render() {
        const incident = props.incident;
        return (
            <IncidentWrapper>
                <IncidentLocationInfo>
                    Latitude: {incident.geolocation.lat} <br />
                    Longitude: {incident.geolocation.lng} <br />
                    Accuracy (within meters): {incident.geolocationAccuracy}
                </IncidentLocationInfo>
                <IncidentMedia>
                    <img src={incident.media} alt="Fire Incident Reported" />
                </IncidentMedia>
                <IncidentNote>
                    {incident.note}
                </IncidentNote>
            </IncidentWrapper>
        );
    }
});

export default Incident;