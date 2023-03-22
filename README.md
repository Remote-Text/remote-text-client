## Prerequisites

You will need `nodejs` installed.

Node comes with its own package manager, `npm`. This will help us keep track of dependecies, which are annoying but unavoidable.

Some basics
- package.json is what tells npm what dependencies to install, how to build, and more. the package-lock.json makes sure everyone who builds has the same version of each package
  - You can add external packages by saying  `npm install <name> --save` (save will add it to package.json). Best to never edit package or package-lock manually
- eslint is a linter, which will look over javascript to make sure it follows conventions

## Getting Started


First, run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The button on the page will call an external api (see `api/hello.js`). This is how we will call the external API to do the git commands. You'll notice that we load the url by saying `process.env.<name>`. This is using an environment variable. This means varibles floating around in the shell when this app is run. You have tons of variables in your shell environment. You can look at them by running the `printenv` command.

To load the url into your environment, make a file called `.env` in the root directory. Then, put this line in

```
REMOTE_TEXT_API_URL=...
```


## Learn More

I would read some mozilla tutorials on html, css, and javascript. Also reading an intro to react would help

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
