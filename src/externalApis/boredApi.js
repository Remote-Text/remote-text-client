// this is an example of calling an external api
const https = require('https');
const axios = require('axios');

module.exports = class BoredApi{

	constructor(){
		this.url = `${process.env.BORED_API_URL}`
	}

	getActivities(){
		axios.get(this.url)
			.then(response => {
			// access parsed JSON response data using response.data field
				var data = response.data
				console.log(data)
			})
			.catch(error => {
				if (error.response) {
				  //get HTTP error code
				  console.log(error.reponse.status)
				} else {
				  console.log(error.message)
				}
			})

	}
}
