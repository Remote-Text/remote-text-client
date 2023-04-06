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

	test("createFile returns expected object", async () => {
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
	});

	test("getFile returns expected object", async () => {
		expectedResponse = {
			name: "READMETOO.md",
			id: "0".repeat(32),
			content: "hello world 2."
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		})
		getFileInput = {
			id: "0".repeat(32),
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		}
		const getFileResult = await remoteTextApi.getFile(getFileInput.id, getFileInput.hash)
		expect(getFileResult).toMatchObject(expectedResponse)
	});

	test("saveFile returns expected object", async () => {
		expectedResponse = {
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		}
		saveFileInput = {
			name: "foo.txt",
			id: "aec23664ae26d76ab66cedfb1206b9c9",
			content: "hello world!",
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});

		//saveFileInput = "aec23664ae26d76ab66cedfb1206b9c972b1"
		const saveFileResult = await remoteTextApi.saveFile(saveFileInput);
		expect(saveFileResult).toMatchObject(expectedResponse);
	})

	test("previewFile returns expected object", async () => {
		expectedResponse = {
			state: "SUCCESS",
			log: "nothing to see here :)"
		}
		previewFileInput = {
			id: "aec23664ae26d76ab66cedfb1206b9c9",
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		})
		const getPreviewResult = await remoteTextApi.getPreview(previewFileInput.id, previewFileInput.hash);
		expect(getPreviewResult).toMatchObject(expectedResponse);
	})

	test("getPreview returns expected object", async () => {
		expectedResponse = {
			name: "foo.txt" //Not checking all the data, can though if needed, but not sure how that format works
		}
		getPreviewInput = {
			id: "aec23664ae26d76ab66cedfb1206b9c9",
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		//getPreviewInput = "aec23664ae26d76ab66cedfb1206b9c972b1"
		const getPreviewResult = await remoteTextApi.getPreview(getPreviewInput.id, getPreviewInput.hash);
		expect(getPreviewResult).toMatchObject(expectedResponse);
	});

	test("getHistory returns expected object", async () => {
		expectedResponse = {
			commits: [{hash: "some_git_hash"},
				{hash: "some_other_git_hash",
				parent: "some_git_hash"}],
			refs: [{name: "some_git_name",
				hash: "some_git_hash" },
				{hash: "some_other_git_hash"}]

		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		getHistoryInput = "0".repeat(32)
		const getHistoryResult = await remoteTextApi.getHistory(getHistoryInput);
		expect(getHistoryResult).toMatchObject(expectedResponse)
	});
  
	test("deleteFile returns nothing as expected", async () => {
		axios.put.mockResolvedValue({
			data: {}
		})
		getFileInput = {id: "0".repeat(32)}
		const deleteFileResult = await remoteTextApi.getFile(deleteFileInput.id)
		expect(deleteFileResult).toMatchObject(expectedResponse)
	})
});
