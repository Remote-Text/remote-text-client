## Prerequisites

- `node` and `npm`
-  This project depends on a [backend server](https://github.com/Remote-Text/remote-text-server) written in rust.

## Getting Started

To run, clone the repository. Move to the project directory and run 

```
npm install
```

The url to the rust server is loaded in through the environment. You will need a `.env` file in the root directory with the url of the server. I.e.

```
REMOTE_TEXT_API_URL=<host>:<port>
```
Once that is set up, you can run the development site via npm

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Running production

To run on production, don't `run dev`. Do

```
npm run build
npm run start
```

## Tests

To run unit tests, run 

```
npm run test
```

To run UI tests, run 

```
npm run cypress
```

## Help and Documentation

[React](https://react.dev/) documentation, which we use for our web interface. 

[Nextjs](https://nextjs.org/docs) documentation, which is a framework for react.

For help on the website, follow the prompts. If something is unclear, there is a help menu in the top right corner of the screen.
