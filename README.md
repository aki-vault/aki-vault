A simpler version of the amazing Yopass frontend. This version does not support file uploads or custom decryption key.

## Getting Started

First, install dependencies and run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment variables

You have to define one environment variable in order to specify where is located the backend server.

Create an `.env.local` at the root of this project and define your variable :

```
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:1337"
```

Of course, replace the URL with your Yopass Server Backend.

## Build

Simply run the command bellow to build the frontend with Next JS.

```bash
yarn build
```
