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
			id: "cbe79856-a067-4468-ab78-e158af6a3c3c",
			content: "hello world 2."
		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		})
		getFileInput = {
			id: "cbe79856-a067-4468-ab78-e158af6a3c3c",
			hash: "932434313674be849b6a5c829118c5089837973f"
		}
		const getFileResult = await remoteTextApi.getFile(getFileInput.id, getFileInput.hash)
		expect(getFileResult).toMatchObject(expectedResponse)
	});

	test("saveFile returns expected object", async () => {
		expectedResponse = {
			hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1",
			parent: "932434313674be849b6a5c829118c5089837973f"
		}
		saveFileInput = {
			name: "foo.txt",
			id: "cbe79856-a067-4468-ab78-e158af6a3c3c",
			parent: "932434313674be849b6a5c829118c5089837973f",
			branch: "main",
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
			id: "cbe79856-a067-4468-ab78-e158af6a3c3c",
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
			id: "cbe79856-a067-4468-ab78-e158af6a3c3c",
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
			commits: [{hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"},
				{hash: "aceaaec23664ae26d7nnb66cedfb1206b9c972b1",
				parent: "aceaaec26564ae26d76ab66cedfb1206b9c972b1"}],
			refs: [{name: "some_git_name",
				hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1" },
				{hash: "aceaaec23664ae26d76ab66cedfb1mm6b9c972b1"}]

		}
		axios.put.mockResolvedValue({
			data: expectedResponse
		});
		getHistoryInput = "cbe79856-a067-4468-ab78-e158af6a3c3c"
		const getHistoryResult = await remoteTextApi.getHistory(getHistoryInput);
		expect(getHistoryResult).toMatchObject(expectedResponse)
	});
  
	test("deleteFile returns nothing as expected", async () => {
		axios.put.mockResolvedValue({
			data: {}
		})
		deleteFileInput = "cbe79856-a067-4468-ab78-e158af6a3c3c"
		/*const deleteFileResult = */await remoteTextApi.deleteFile(deleteFileInput)
		// expect(deleteFileResult).toBeUndefined() doesn't really matter what it outputs as long as it doesn't raise errors
	})
});
