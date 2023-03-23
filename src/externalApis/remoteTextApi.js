// this is an example of calling an external api
const axios = require('axios');
const schemas = require('./remoteTextApiValidator')

module.exports = class RemoteTextApi {

	constructor() {
		this.url = `${process.env.REMOTE_TEXT_API_URL}`
		this.schemas = new schemas()
	}

	// helper function to validate input
	validate(data, expected) {
		return this.schemas.validator.validate(data, expected, { throwAll: true });
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
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('Schema Error')
					console.log(error)
				}
			})
	}

	async createFile(filename) {
		const filenameObject = { name: filename }
		try {
			this.validate(filenameObject, this.schemas.createFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/createFile', filenameObject)
			.then(response => {
				// extract data from response
				var data = response.data

				// make sure data follows expected format and return
				this.validate(data, this.schemas.fileSummarySchema)
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('Schema Error')
					console.log(error)
				}
			})
	}

	async saveFile(file) {
		const filenameObject = {
			name: file.name,
			id: file.id,
			content: file.content

		}
		try {
			this.validate(filenameObject, this.schemas.fileSchema)
		} catch (error) {
			throw error
		}

		return axios.get(this.url + '/saveFile', filenameObject)
			.then(response => {
				var data = response.data

				this.validate(data, this.schemas.saveFileOutput) //Think this isn't quite right? Gonna double check
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('Schema Error')
					console.log(error)
				}
			})
	}

	async getPreview(file) {
		const filenameObject = {
			name: file.name,
			id: file.id,
			content: file.content

		}
		try {
			this.validate(filenameObject, this.schemas.fileSchema)
		} catch (error) {
			throw error
		}

		return axios.get(this.url + '/getPreview', filenameObject)
			.then(response => {
				var data = response.data

				this.validate(data, this.schemas.getPreviewOutput)  //Think this isn't quite right? Gonna double check
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('Schema Error')
					console.log(error)
				}
			})
	}
}


