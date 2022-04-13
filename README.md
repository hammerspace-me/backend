<div id="top"></div>
<br />
<div align="center">
  <a href="https://github.com/Metaverse-Backpack/backpack-backend">
    <img src="images/logo.png" alt="Logo" width="200">
  </a>

<h3 align="center">Backpack Backend</h3>
  <p align="center">
    Backend service for Metaverse Backpack - a virtual backpack for your Metaverse assets
  </p>
</div>

## About The Project

The backpack backend is a service that creates a virtual backpack for your assets stored on IPFS and makes them available for third-party applications.

## Getting Started

### Prerequisites

* npm

  Install npm as the service is based on NodeJS and uses npm as a package manager.
  *NOTE:* This installation command requires [brew](https://brew.sh/) and only runs on Mac.

  ```sh
  $ brew install node
  ```

* Docker

  Install docker as the service requires a database for persistent storage.
  *NOTE:* This installation command requires [brew](https://brew.sh/) and only runs on Mac.

  ```sh
  brew cask install docker
  ```

* Environment

  Rename the environment file and add your credentials. Environment file is read by NestJS and Docker.
  ```sh
  mv .env.example .env
  ```

* Web3.Storage account and API token

  In order to use web3.storage you need an API key. First, head over to [web3.storage](https://web3.storage) to login with your email address. You will receive an email with a magic link that signs you in – no password needed. After you successfully logged in, go to API Keys via the account section of the navigation bar. You will find a button to Create a new token. When prompted for an API key name, you can freely choose one or use “Backpack”. Copy the content of the key column to your .env file.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Metaverse-Backpack/backpack-backend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage

The backpack backend consists of two components: the backend service and the database. First start the database with the following command:
```bash
# Start up the development database
$ npm run start:db
```
When the database is running, start the backend service with the following command:
```bash
# Start service in watch mode (automatically reload if files change)
$ npm run start:dev
```

There are further commands that can be used to start the backend service, e.g., for development mode without watching file changes and production mode:

```bash
# Build service in development mode and run (does not automatically reload)
$ npm run start

# Build service in production mode and run
$ npm run start:prod
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

Benedikt Wölk - [@web3woelk](https://twitter.com/web3woelk) - benedikt.woelk@protocol.ai

Tobias Petrasch - [@TPetrasch](https://twitter.com/TPetrasch) - tobias.petrasch@protocol.ai

Project Link: [https://github.com/bwtp-sandox/backpack-backend](https://github.com/bwtp-sandox/backpack-backend)

## Acknowledgments

* [Protocol Labs](https://www.protocol.ai)
