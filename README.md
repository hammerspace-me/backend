<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/bwtp-sandox/backpack-service">
    <img src="images/logo.png" alt="Logo" width="200">
  </a>

<h3 align="center">Metaverse Backpack</h3>
  <p align="center">
    A virtual backpack for all your metaverse assets
    <br />
    <br />
    <a href="https://github.com/bwtp-sandox/backpack-service/issues">Report Bug</a>
    ·
    <a href="https://github.com/bwtp-sandox/backpack-service/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

The metaverse backpack is a service that creates a virtual backpack for your assets stored on IPFS and makes them available for third-party applications.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm

  Install npm as the service is based on NodeJS.
  ```sh
  npm install npm@latest -g
  ```

* Docker

  Install docker to start a database easily.
  ```sh
  brew cask install docker
  ```

* Environment

  Rename the environment file and add credentials. Environment file is read by NestJS and Docker.
  ```sh
  mv .env.example .env
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/backpack-service.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage

```bash
# development database
$ npm run start:db

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Benedikt Wölk - [@web3woelk](https://twitter.com/web3woelk) - benedikt.woelk@protocol.ai

Tobias Petrasch - [@TPetrasch](https://twitter.com/TPetrasch) - tobias.petrasch@protocol.ai

Project Link: [https://github.com/bwtp-sandox/backpack-service](https://github.com/bwtp-sandox/backpack-service)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Protocol Labs](https://www.protocol.ai)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bwtp-sandox/backpack-service.svg?style=for-the-badge
[contributors-url]: https://github.com/bwtp-sandox/backpack-service/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bwtp-sandox/backpack-service.svg?style=for-the-badge
[forks-url]: https://github.com/bwtp-sandox/backpack-service/network/members
[stars-shield]: https://img.shields.io/github/stars/bwtp-sandox/backpack-service.svg?style=for-the-badge
[stars-url]: https://github.com/bwtp-sandox/backpack-service/stargazers
[issues-shield]: https://img.shields.io/github/issues/bwtp-sandox/backpack-service.svg?style=for-the-badge
[issues-url]: https://github.com/bwtp-sandox/backpack-service/issues
[license-shield]: https://img.shields.io/github/license/bwtp-sandox/backpack-service.svg?style=for-the-badge
[license-url]: https://github.com/bwtp-sandox/backpack-service/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
