This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites

You will need `nodejs` installed.

Node comes with its own package manager, `npm`. This will help us keep track of dependecies, which are annoying but unavoidable.

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
BORED_API_URL=https://www.boredapi.com/api/activity
```

now, when you run `npm run dev`, the variable will be loaded into your environment. Now when you look a the page, you can click the button to hit the bored api, which gives an activity to do when you are bored. To see the output, look in the console (left click on the browser page, hit inspect, and go to console in the dev tools window).

## Learn More

I would read some mozilla tutorials on html, css, and javascript. Also reading an intro to react would help

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
