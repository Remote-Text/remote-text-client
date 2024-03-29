// this is an example of calling an external api
const axios = require('axios');
const schemas = require('./remoteTextApiValidator')
const validator = require('validator')

async function redirectError(errorCode) {
	if (errorCode=="other") {  // extra check to prevent other errors getting overwritten by this
		axios.get(`${process.env.REMOTE_TEXT_API_URL}`+ '/listFiles') // is there a different (faster) way to just ping the server?
		.catch(error=>{
			window.location = window.location.origin+"/error?err=503","_self"
		})
	} else {
		window.location = location.origin+"/error?err="+errorCode,"_self"
	}
}

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
				try {
					this.validate(data, this.schemas.listFilesOutput)
				} catch (error) {
					console.log('listFiles output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					redirectError(error.response.status)
				} else {
					redirectError("other")  // this occurs when the server response is undefined, ie server can't respond, but also occurs in other API calls as a duplicate after processing a 404 error.
				}
			})
	}

	async createFile(filename, uploadcontent='') {
		const newfileObject = { name: filename, content: uploadcontent }
		try {
			this.validate(newfileObject, this.schemas.createFileInput)
		} catch (error) {
			console.log('createFile input Schema Error')
			throw error
		}

		return axios.put(this.url + '/createFile', newfileObject)
			.then(response => {
				// extract data from response
				var data = response.data

				// make sure data follows expected format and return
				try {
					this.validate(data, this.schemas.fileSummarySchema)
				} catch (error) {
					console.log('createFile output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async getFile(fileid, githash) {
		if (!validator.isUUID(fileid)) {
			return redirectError("404")
		}

		const fileObject = {id: fileid, hash: githash}
		try {
			this.validate(fileObject, this.schemas.getFileInput)
		} catch (error) {
			console.log('getFile input Schema Error')
			throw error
		}

		return axios.put(this.url + '/getFile', {id: fileid, hash: githash})
			.then(response => {
				var data = response.data
				try {
					this.validate(data, this.schemas.fileSummarySchema)
				} catch (error) {
					console.log('getFile output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async saveFile(file) {
		if (!validator.isUUID(file.id)) {
			return redirectError("404")
		}

		try {
			this.validate(file, this.schemas.saveFileInput)
		} catch (error) {
			console.log('saveFile input Schema Error')
			throw error
		}

		return axios.put(this.url + '/saveFile', file)
			.then(response => {
				var data = response.data
				try {
					this.validate(data, this.schemas.saveFileOutput)
				} catch (error) {
					console.log('saveFile output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async previewFile(fileid, githash) {
		if (!validator.isUUID(fileid)) {
			return redirectError("404")
		}

		const filenameObject = {
			id: fileid,
			hash: githash
		}
		try {
			this.validate(filenameObject, this.schemas.previewFileInput)
		} catch (error) {
			console.log('previewFile input Schema Error')
			throw error
		}

		return axios.put(this.url + '/previewFile', filenameObject)
			.then(response => {
				var data = response.data

				try {
					this.validate(data, this.schemas.previewFileOutput)
				} catch (error) {
					console.log('previewFile output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async getPreview(fileid, githash) {
		if (!validator.isUUID(fileid)) {
			return redirectError("404")
		}

		const filenameObject = {
			id: fileid,
			hash: githash
		}
		try {
			this.validate(filenameObject, this.schemas.getPreviewInput)
		} catch (error) {
			console.log('getPreview input Schema Error')
			throw error
		}

		return axios.put(this.url + '/getPreview', filenameObject, { responseType: 'arraybuffer' })
			.then(response => {
				// this doesn't return a json so no need to validate
				return response.data
			})
			.catch(error => {
				if (error.response) {
					//get HTTP error code
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async getHistory(fileID) {  // Parameters: File ID. Returns: A list of GitCommit objects, and a list of GitRef objects
		if (!validator.isUUID(fileID)) {
			return redirectError("404")
		}

		const fileidObject={id: fileID}
		try {
			this.validate(fileidObject, this.schemas.getHistoryInput)
		} catch (error) {
			console.log('getHistory input Schema Error')
			throw error
		}
		return axios.put(this.url + '/getHistory', fileidObject)
			.then(response => {
				var data = response.data
				try {
					this.validate(data, this.schemas.getHistoryOutput)
				} catch (error) {
					console.log('getHistory output Schema Error')
					throw error
				}
				return data;
			})
			.catch(error => {
				if (error.response) {
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}

	async deleteFile(fileid) {
		if (!validator.isUUID(fileid)) {
			return redirectError("404")
		}

		const fileidObject = {id: fileid}
		try {
			this.validate(fileidObject, this.schemas.deleteFileInput)
		} catch (error) {
			console.log('deleteFile input Schema Error')
			throw error
		}

		return axios.put(this.url + '/deleteFile', {id: fileid})
			.then(response => {
				var data = response.data
				// unsure why we're even returning anything here
				return data
			})
			.catch(error => {
				if (error.response) {
					redirectError(error.response.status)
				} else {
					redirectError("other")
				}
			})
	}
}
