// this is an example of calling an external api
const axios = require('axios');
const schemas = require('./remoteTextApiValidator')

module.exports = class RemoteTextApi {

	constructor() {
		this.url = `${process.env.REMOTE_TEXT_API_URL}`
		this.schemas = new schemas()
	}

	// helper function to validate input
	validate(data, expected){
		this.schemas.validator.validate(data, expected, {throwAll: true});
	}

	async listFiles() {
		 return axios.get(this.url + '/listFiles')
			.then(response => {
				// extract data from response
				var data = response.data

				// make sure data follows expected format and return
				this.validate(data, this.schemas.listFilesSchema)
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.reponse.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('Schema Error')
					console.log(error)
				}
			})
	}
}


