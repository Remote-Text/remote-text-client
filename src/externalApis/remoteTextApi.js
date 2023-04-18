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
				this.validate(data, this.schemas.listFilesOutput)
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('listFiles Schema Error')
					console.log(error)
				}
			})
	}

	async createFile(filename, uploadcontent='') {
		const newfileObject = { name: filename, content: uploadcontent }
		try {
			this.validate(newfileObject, this.schemas.createFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/createFile', newfileObject)
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
					console.log('createFile Schema Error')
					console.log(error)
				}
			})
	}

	async getFile(fileid, githash='HEAD') {
		const fileObject = {id: fileid, hash: githash}
		try {
			this.validate(fileObject, this.schemas.getFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/getFile', {id: fileid, hash: githash})
			.then(response => {
				var data = response.data
				this.validate(data, this.schemas.fileSummarySchema)
				return data;
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.status)
				} else {
					console.log('getFile Schema Error')
					console.log(error)
				}
			})
	}

	async saveFile(file) {
		try {
			this.validate(file, this.schemas.saveFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/saveFile', file)
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
					console.log('saveFile Schema Error')
					console.log(error)
				}
			})
	}

	async previewFile(fileid, githash) {
		const filenameObject = {
			id: fileid,
			hash: githash
		}
		try {
			this.validate(filenameObject, this.schemas.previewFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/previewFile', filenameObject)
			.then(response => {
				var data = response.data

				this.validate(data, this.schemas.previewFileOutput)  //Think this isn't quite right? Gonna double check
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					console.log(error.response.status)
				} else {
					// should we have some more sophisticated error logs?
					console.log('previewFile Schema Error')
					console.log(error)
				}
			})
	}

	async getPreview(fileid, githash) {
		const filenameObject = {
			id: fileid,
			hash: githash
		}
		try {
			this.validate(filenameObject, this.schemas.getPreviewInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/getPreview', filenameObject)
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
					var error_throw = "                __ \n               / _) \n      _.----._/ / \n     /  error  / \n  __/ (  | (  | \n /__.-'|_|--|_|"
					// should we have some more sophisticated error logs?
					console.log(error_throw)
					return error  // it's not an error, it's a feature :D
				}
			})
	}
  
	async getHistory(fileID) {  // Parameters: File ID. Returns: A list of GitCommit objects, and a list of GitRef objects
		const fileidObject={id: fileID}
		try {
			this.validate(fileidObject, this.schemas.getHistoryInput)
		} catch (error) {
			throw error
		}
		return axios.put(this.url + '/getHistory', fileidObject)
			.then(response => {
				var data = response.data
				this.validate(data, this.schemas.getHistoryOutput)
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

	async deleteFile(fileid) {
		const fileidObject = {id: fileid}
		try {
			this.validate(fileidObject, this.schemas.deleteFileInput)
		} catch (error) {
			throw error
		}

		return axios.put(this.url + '/deleteFile', {id: fileid})
			.then(response => {
				var data = response.data
				// this.validate(data, ???)  do we need to validate that it doesn't return anything? seems unimportant, and was throwing error with check against null or empty string, so I'm just excluding this check.
				return data
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.status)
				} else {
					console.log('deleteFile Schema Error')
					console.log(error)
				}
			})
	}
}
