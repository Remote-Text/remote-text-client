const RemoteTextApi = require('./remoteTextApi');
const axios = require('axios');

jest.mock('axios');

// example of how we will test our classes 
// search google 'testing with jest js'
describe('RemoteTextApi', () => {

	const remoteTextApi = new RemoteTextApi();

	test("Url is loaded from env", () => {
		expect(!remoteTextApi.url === "undefined");
	});

	test("listFiles returns expected object", async () => {
		axios.get.mockResolvedValue({
			data: [{
				name: "README.md",
				id: "1",
				edited_time: Date(),
				created_time: Date(),
			}, {
				name: "READMETOO.md",
				id: "3",
				edited_time: Date(),
				created_time: Date(),
			}]
		});
		const listFilesResult = await remoteTextApi.listFiles();
		expect(listFilesResult[0].name).toEqual('README.md');
	}
	);

	test("createFiles returns expected object", async () => {
		expectedResponse = {
			name: "READMETOO.md",
			id: "3",
			edited_time: Date(),
			created_time: Date(),
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		createFileInput = "foo.txt"
		const createFileResult = await remoteTextApi.createFile(createFileInput);
		expect(createFileResult).toMatchObject(expectedResponse);
	}
	);
	test("saveFile returns expected object", async () => {
		expectedResponse = {
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1".to_string(),
			parent: None,
		}
		const saveFileResult = await remoteTextApi.saveFile(saveFileInput);
		expect(saveFileResult).toMatchObject(expectedResponse);
	}

	test("getPreview returns expected object", async () => {
		expectedResponse = {
			name: "README.md".to_string(), //Not checking all the data, can though if needed, but not sure how that format works
			id: obj.id,
		}
		const getPreviewResult = await remoteTextApi.saveFile(getPreviewInput);
		expect(getPreviewResult).toMatchObject(expectedResponse);
	}

});
