# Audio Streaming Server

> An audio streaming server who can index files with their metadata, send a raw or transcoded stream, expose a REST-API, manage user's likes, and more.

## What is it?

Deniseaudio is a powerful yet minimal audio streaming server.

It can index your local music files, and expose a REST-API to interact with them such as generating a raw or transcoded audio stream.

The server also has the ability to manage a user's likes, search files or songs by their metadata, and much more.

This project was originally made for a Synology NAS, but it can be used on any Linux machine.

The main goal of this project was to have the ability to stream raw music files (such as `.flac`) directly in the browser _without any transcoding_ while still having a somewhat _great_ web user-interface.

However, the project has evolved and contains a lot more features and should be production ready.

## Architecture of the project

Inside this project, there are 2 main folders:

- `src/indexer`: contains the source-code related to the file-indexer which interact with a local SQLite database using Prisma ORM.
- `src/api`: contains the source-code related to the REST-API which expose the endpoints to interact with the database, generate a (transcoded or raw) stream from an audio file, manage users, and more.

The REST-API is entirely tested with Jest inside the folder `src/__tests__`. Currently, there are no written tests for the file indexer.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) _(v16 LTS or higher)_
- [FFmpeg](https://ffmpeg.org/) _(make sure it's available in the global `PATH`)_.

### Installation

1. Install dependencies with npm: `npm install`
2. Copy the `.env.example` file to `.env.<environment>.local` and fill the variables with your own values.
  - Valid environments are `development`, `production` and `test`.
3. Build the project: `npm run build`
4. Run the server with pm2: `npx pm2 start ecosystem.config.js`
5. Save pm2 state: `npx pm2 save`
  - You may also want to enable pm2 to start on boot: `npx pm2 startup`

#### Reverse-proxy

It is recommended to use a reverse-proxy such as nginx to proxy the API requests and support SSL.

However, if you are using this server with a Synology NAS, DSM software already has [a built-in reverse-proxy setting](https://kb.synology.com/en-us/DSM/help/DSM/AdminCenter/application_appportalias?version=6).

Example configuration on a Synology NAS:

- Source (incoming trafic): **HTTPS** `*:3000`
- Destination (redirected trafic): **HTTP** `localhost:3001` _(or the port you set in the `.env.production.local` file)_

## LICENSE

Please, see the [LICENSE](LICENSE) file for more information.
