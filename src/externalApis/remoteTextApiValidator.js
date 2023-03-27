// see the docs here for help https://github.com/tdegrunt/jsonschema

var Validator = require('jsonschema').Validator;

module.exports = class Schemas{

	fileSummarySchema = {
		"id": "/FileSummary",
		"type": "object",
		"properties": {
			"name": {"type": "string"},
			"edited_time": {"type": "string"},
			"created_time": {"type": "string"},
			"id": {"type": "string"}
		},
		"required": ["id"]
	};

	listFilesSchema = {
		"id": "/GetFiles",
		"type": "array",
		"items": {
			"$ref": "/FileSummary"
		}
	};

	createFileInput = {
		"id": "/createFile",
		"type": "object",
		"properties": {
			"name": {"type": "string"},
		},
		"required": ["name"]
	};

	getFileInput = {
		"id": "/getFile",
		"type": "object",
		"properties": {
			"id": {"type": "string"},
			"hash": {"type": "string"}
		},
		"required": ["id"]
	};

	getHistoryInput = {
		"id": "/getHistory",
		"type": "object",
		"properties": {
			"id": {"type": "string"},
		},
		"required": ["id"]
	};

	gitCommitSchema = {
		"id": "/GitCommit",
		"type": "object",
		"properties": {
			"hash": {"type": "string"},
			"parent": {"type": ["string", "null"]}
		},
		"required": ["hash"]
	};

	gitRefSchema = {
		"id": "/GitRef",
		"type": "object",
		"properties": {
			"name": {"type": "string"},
			"hash": {"type": "string"}
		}
	};

	gitSummarySchema = {
		"id": "/gitSummary",
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
	

	constructor(){
		// any supporting types need to be added to validator here
		// so like in the getFilesSchema, since I say the json is an array of /FilesSummary, I need to add /FileSummary to validator so it knows that type
		this.validator = new Validator();
		this.validator.addSchema(this.fileSummarySchema, "/FileSummary");
		this.validator.addSchema(this.gitCommitSchema, "/GitCommit")
		this.validator.addSchema(this.gitRefSchema, "/GitRef")
	}

}
