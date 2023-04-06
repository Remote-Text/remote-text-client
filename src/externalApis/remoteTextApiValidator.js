// see the docs here for help https://github.com/tdegrunt/jsonschema

var Validator = require('jsonschema').Validator;

module.exports = class Schemas {

// listFiles(no input) -> list of fileSummary objects

	fileSummarySchema = {
		"id": "/FileSummary",
		"type": "object",
		"properties": {
			"name": { "type": "string" },
			"edited_time": { "type": "string" },
			"created_time": { "type": "string" },
			"id": { "type": "string" }
		},
		"required": ["id"]
	}

	listFilesOutput = {
		"id": "/listFiles",
		"type": "array",
		"items": {
			"$ref": "/FileSummary"
		}
	}

// createFile(name) -> fileSummary object

	createFileInput = {
		"id": "/createFile",
		"type": "object",
		"properties": {
			"name": { "type": "string" },
			"content": { "type": "string" }  // content is optional (for uploading existing file content)
		},
		"required": ["name"]
	}

// getFile(id, hash) -> file object

	getFileInput = {
		"id": "/getFile",
		"type": "object",
		"properties": {
			"id": {"type": "string"},
			"hash": {"type": ["string", "null"]}
		},
		"required": ["id"]
	}

	getFileOutput = {
		"id": "/getFile",
		"type": "object",
		"properties": {
			"name": { "type": "string" },
			"id": { "type": "string" },
			"content": { "type": "string" }
		}
	}

// saveFile(name, id, content, parent, branch) -> hash, parent

	saveFileInput = {
		"id": "/saveFile",
		"type": "object",
		"properties": {
			"name": { "type": "string" },
			"id": { "type": "string" },
			"content": { "type": "string" }
		}
	}

	saveFileOutput = {
		"id": "/saveFile",
		"type": "object",
		"properties": {
			"hash": { "type": "string" },
			"parent": { "type": ["string", "null"] }
		}
	}

// previewFile(id, hash) -> state (success/failure), log

	previewFileInput = {
		"id": "/previewFile",
		"type": "object",
		"properties": {
			"id": { "type": "string" },
			"hash": { "type": "string" }
		},
		"required": ["id", "ref"]
	}

	previewFileOutput = {
		"id": "/previewFile",
		"type": "object",
		"properties": {
			"state": { "type": "string" },  // {"SUCCESS", "FAILURE"}
			"log" : {"type": "string"}
		}
	}

// getPreview(id, hash) -> name, id, filetype, data

	getPreviewInput = {
		"id": "/getPreview",
		"type": "object",
		"properties": {
			"id": { "type": "string" },
			"hash": { "type": "string" }
		},
		"required": ["id", "ref"]
	}

	getPreviewOutput = {
		"id": "/getPreview",
		"type": "object",
		"properties": {
			"name": { "type": "string" },
			"id": { "type": "string" },
			"type": { "type": "string" },  // {"HTML", "PDF"}
			"data": { "type": "string" }
		}
	}

// getHistory(id) -> list of commit objects & list of ref objects

	getHistoryInput = {
		"id": "/getHistory",
		"type": "object",
		"properties": {
			"id": {"type": "string"},
		},
		"required": ["id"]
	}

	gitCommitSchema = {
		"id": "/GitCommit",
		"type": "object",
		"properties": {
			"hash": {"type": "string"},
			"parent": {"type": ["string", "null"]}
		}
	}

	gitRefSchema = {
		"id": "/GitRef",
		"type": "object",
		"properties": {
			"name": {"type": "string"},
			"hash": {"type": "string"}
		}
	}

	getHistoryOutput = {
		"id": "/getHistory",
		"type": "object",
		"properties": {
			"commits" : {
				"type": "array",
				"items": {"$ref": "/GitCommit"}
			},
			"refs" : {
				"type": "array",
				"items": {"$ref": "/GitRef"}
			}
		}
	}


	constructor() {
		// any supporting types need to be added to validator here
		// so like in the getFilesSchema, since I say the json is an array of /FilesSummary, I need to add /FileSummary to validator so it knows that type
		this.validator = new Validator();
		this.validator.addSchema(this.fileSummarySchema, "/FileSummary");
		this.validator.addSchema(this.gitCommitSchema, "/GitCommit")
		this.validator.addSchema(this.gitRefSchema, "/GitRef")
	}

}
