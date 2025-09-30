# Upload a file to Neoai with Next.js

This example shows how to upload a file to Neoai using the Neoai TypeScript SDK and Node.js. It uses [Next.js](https://nextjs.org/) to render a simple form with a file input. When the form is submitted, the file is uploaded to Neoai via a Next.js API Route and the Neoai-hosted URL is returned.

> **Note**
> While this example uses Next.js, this approach can be used with any Node.js backend.

To run this example, you'll need a Neoai account and a Neoai API key. You can create an API key from your personal [Neoai settings](https://Khulnasoft.com/settings/account/security). Learn more about authentication in the [Neoai Developer documentation](https://developers.Khulnasoft.com/docs/sdk/getting-started#2.-create-a-neoai-client).

> **Note**
> This example is part of a guide: ["How to upload a file to Neoai"](https://developers.Khulnasoft.com/guides/how-to-upload-a-file-to-neoai).

## Run the example

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to bootstrap the example:

```shell
yarn create next-app --example https://github.com/neopilot-ai/neoai/tree/master/examples/nextjs-file-upload nextjs-file-upload
```

Then rename `.env.local.example` to `.env.local` and add your API key:

```
# Rename .env.local.example → .env.local
NEOAI_API_KEY="YOUR_API_KEY"
```

Finally, `cd` into the directory and run the Next.js development server:

```shell
cd nextjs-file-upload
yarn dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to see the running example.
