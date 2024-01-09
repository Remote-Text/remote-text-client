/** @type {import('next').NextConfig} */

require('dotenv').config()
const nextConfig = {
  reactStrictMode: true,
	// there has to be a better way...
	env : {
		REMOTE_TEXT_API_URL:process.env.REMOTE_TEXT_API_URL
	},
    output: 'standalone',
}

module.exports = nextConfig
