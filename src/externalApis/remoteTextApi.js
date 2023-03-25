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
		return this.schemas.validator.validate(data, expected, {throwAll: true});
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
		const filenameObject = {name: filename}
		try {
			this.validate(filenameObject, this.schemas.createFileInput)
		} catch (error) {
			throw error
		}

		return axios.post(this.url + '/createFile', filenameObject)
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

	async getFile(fileid, githash='HEAD') {  // Parameters: File ID, Git hash (optional, default = HEAD). Returns: A FileSummary object
		try {
			this.validate({id: fileid, hash: githash}, this.schemas.getFileInput)
		} catch (error) {
			throw error
		}

		return axios.post(this.url + '/getFile', {id: fileid, hash: githash})
			.then(response => {
				var data = response.data
				this.validate(data, this.schemas.fileSummarySchema)
				return data;
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.status)
				} else {
					console.log('Schema Error')
					console.log(error)
				}
			})
	}

	async getHistory(fileid) {  // Parameters: File ID. Returns: A list of GitCommit objects, and a list of GitRef objects
		try {
			this.validate({id: fileid}, this.schemas.getHistoryInput)
		} catch (error) {
			throw error
		}

		return axios.post(this.url + '/getHistory', {id: fileid})
			.then(response => {
				var data = response.data
				this.validate(data, this.schemas.gitSummarySchema)
				return data;
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.status)
				} else {
					console.log('Schema Error')
					console.log(error)
				}
			})
	}
}


