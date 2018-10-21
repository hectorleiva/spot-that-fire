import axios from 'axios'

export default class STFClient {
    constructor(props) {
        this.incidentUrl = '/api/incidents';
        this.userUrl = '/api/Users';
        this.loginUrl = '/api/Users/login';
        this.subscriptionUrl = '/api/subscription';

        this.axios = axios.create({
            baseURL: 'http://localhost:3001',
            timeout: 10000,
            onUploadProgress: (props && props.uploadProgressIndicator) || null
        });
    }

    async submitIncident(payload) {
        return this.axios.post(this.incidentUrl, payload);
    }

    async submitSubscription(payload) {
        return this.axios.post(this.subscriptionUrl, payload);
    }

    async login(payload) {
        return this.axios.post(this.loginUrl, payload);
    }

    async register(payload) {
        return this.axios.post(this.userUrl, payload);
    }
};
