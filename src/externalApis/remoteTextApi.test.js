import {v4 as uuidv4} from 'uuid';

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

	test("getFile returns expected object", async () => {
		expectedResponse = {
			name: "READMETOO.md",
			id: "3",
			edited_time: Date(),
			created_time: Date(),
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		getFileInput = uuidv4()
		const getFileResult = await remoteTextApi.getFile(getFileInput);
		expect(getFileResult).toMatchObject(expectedResponse)
	})

	test("getHistory returns expected object", async () => {
		expectedResponse = [
				{hash: "some_git_hash"},
				{hash: "some_other_git_hash",
				parent: "some_git_hash"}
			]
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		getHistoryInput = uuidv4()
		const getHistoryResult = await remoteTextApi.getHistory(getHistoryInput);
		expect(getHistoryResult).toMatchObject(expectedResponse)
	})

});