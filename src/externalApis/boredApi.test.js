const BoredApi = require('./boredApi')

// example of how we will test our classes 
// search google 'testing with jest js'
describe('BoredApi', () =>{
	const boredapi = new BoredApi();
	test("Url is loaded from env", () => {
		expect(!boredapi.url==="undefined");
	});
	// should be a test for get Activites
});
