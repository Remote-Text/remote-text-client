// this is an example of calling an external api
const https = require('https');
const axios = require('axios');
const schemas = require('./remoteTextApiValidator')

module.exports = class RemoteTextApi {

	constructor() {
		this.url = `${process.env.REMOTE_TEXT_API_URL}`
		this.schemas = new schemas()
	}

	async getFiles() {
		 return axios.get(this.url)
			.then(response => {
				var data = response.data
				this.schemas.validator.validate(data, this.schemas.getFilesSchema, {throwAll: true});
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.reponse.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log(error)
				}
			})

	
	}
}
