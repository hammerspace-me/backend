# hammerspace-me/backend

## About The Project

Hammerspace is a virtual space for all the assets that belong to you. It helps you move and express yourself in the Metaverse. Hammerspace's focus is to enable interoperability and seamlessness. This backend service is a RESTful API to manage your virtual Hammerspace and make it available to third-party applications and technology providers. Feel free to visit the [project website](https://www.hammerspace.me) or our [E2E demo](https://demo.hammerspace.me).

## Getting Started

### Prerequisites

- npm

  Install npm as the service is based on NodeJS and uses npm as a package manager.
  _NOTE:_ This installation command requires [brew](https://brew.sh/) and only runs on Mac.

  ```sh
  $ brew install node
  ```

- Docker

  Install docker as the service requires a database for persistent storage.
  _NOTE:_ This installation command requires [brew](https://brew.sh/) and only runs on Mac.

  ```sh
  brew cask install docker
  ```

- Environment

  Rename the environment file and add your credentials. Environment file is read by NestJS and Docker.

  ```sh
  mv .env.example .env
  ```

- Web3.Storage account and API token

  In order to use web3.storage you need an API key. First, head over to [web3.storage](https://web3.storage) to login with your email address. You will receive an email with a magic link that signs you in – no password needed. After you successfully logged in, go to API Keys via the account section of the navigation bar. You will find a button to Create a new token. When prompted for an API key name, you can freely choose one or use “Hammerspace”. Copy the content of the key column to your .env file.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Hammerspace/backend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage

This backend consists of two components: the backend service and the database. First start the database with the following command:

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

## Documentation

This backend provides a comprehensive Swagger API documentation. It exposes the `/api` endpoint with the documentation of all endpoints and entities associated to the RESTful API. If you are running the backend locally, you can use `http://localhost:3000/api` to visit the Swagger documentation. If you want to use the (official) deployed version, please use `https://backend.hammerspace.me/api` (Note: The deployed version might differ from the latest commit in the repository. Deployment is only done if version provides enough confidence and is stable and tested).

## Known Issues

- Backend service fails to start when changes are made to the database model: Currently there is no proper database migration management implemented. Whenever the database entities are changed, there is the possibility of a crash of the backend service as the database model differs from the database itself. To resolve the issue, the database can be removed and re-deployed, either by removing the old container and starting a new one (`docker-compose stop db`, `docker-compose rm db`, `docker-compose up -d db`) or by using a tool/CLI to interact with the database and purge it completely.

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

## Acknowledgments

- [Protocol Labs](https://www.protocol.ai)
