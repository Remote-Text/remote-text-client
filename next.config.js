/** @type {import('next').NextConfig} */

require('dotenv').config()
const nextConfig = {
  reactStrictMode: true,
	// there has to be a better way...
	env : {
		BORED_API_URL:process.env.BORED_API_URL
	}

}

module.exports = nextConfig
