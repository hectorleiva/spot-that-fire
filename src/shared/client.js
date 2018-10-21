import axios from 'axios'

export default class STFClient {
    constructor(props) {
        this.incidentUrl = '/api/incidents';
        this.userUrl = '/api/Users';
        this.loginUrl = '/api/Users/login';
        this.subscriptionUrl = '/api/subscriptions';

        console.log('process.env: ', process.env);

        this.axios = axios.create({
            baseURL: process.env.REACT_APP_DATASTORE || 'http://localhost:3001',
            timeout: 10000,
            onUploadProgress: (props && props.uploadProgressIndicator) || null
        });
    }

    async submitIncident(payload) {
        return this.axios.post(this.incidentUrl, payload);
    }

    async submitSubscription(payload, authToken) {
        this.axios.defaults.headers.common['Authorization'] = authToken;
        console.log(this.axios.defaults);
        return this.axios.post(this.subscriptionUrl, payload);
    }

    async login(payload) {
        return this.axios.post(this.loginUrl, payload);
    }

    async register(payload) {
        return this.axios.post(this.userUrl, payload);
    }

    async retrieveAllIncidents() {
        return this.axios.get(this.incidentUrl);
    }
};
