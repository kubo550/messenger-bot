<div align="center">
  <a href="https://github.com/kubo550/messenger-bot">
    <img src="https://raw.githubusercontent.com/othneildrew/Best-README-Template/master/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Messenger Chat Bot</h3>

  <p align="center">
    An awesome messenger chat bot to manage a group of students at Cracow Economic University!
    <br />
  </p>
</div>

<div align="center">

  <a href="https://github.com/kubo550/messenger-bot/actions"><img alt="Tests Passing" src="https://github.com/kubo550/messenger-bot/workflows/Test/badge.svg" /></a>
<a href="https://github.com/kubo550/messenger-bot/stargazers"><img src="https://img.shields.io/github/stars/kubo550/messenger-bot" alt="Stars Badge"/></a>
<a href="https://github.com/kubo550/messenger-bot/network/members"><img src="https://img.shields.io/github/forks/kubo550/messenger-bot" alt="Forks Badge"/></a>
<a href="https://github.com/kubo550/messenger-bot/pulls"><img src="https://img.shields.io/github/issues-pr/kubo550/messenger-bot" alt="Pull Requests Badge"/></a>
<a href="https://github.com/kubo550/messenger-bot/issues"><img src="https://img.shields.io/github/issues/kubo550/messenger-bot" alt="Issues Badge"/></a>
<a href="https://github.com/kubo550/messenger-bot/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/kubo550/messenger-bot?color=2b9348"></a>
<a href="https://github.com/elangosundar/awesome-README-templates/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kubo550/messenger-bot?color=2b9348" alt="License Badge"/></a>

  <br />
  
  [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
  [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
  [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
  [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=bugs)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
  [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)

  
</div>

## :server: Deployment

Server is deployed on 
<a href="https://messenger-api-bot.herokuapp.com/health"> ![heroku](https://img.shields.io/badge/-heroku-05122A?style=flat&logo=heroku) </a>


<!-- GETTING STARTED -->

## :runner: Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### :nut_and_bolt: Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm `v >= 16.0.0`
  ```sh
  npm install npm@latest -g
  ```
  Or by NVM
  ```sh
  nvm use 16
  ```
- ngrok
  ```sh
  npm install -g ngrok
  ```

### :arrow_down: Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone git@github.com:kubo550/messenger-bot.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create .env file
   ```sh
   mv .env.example .env
   ```
4. Enter all environment variables in .env 

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## :computer: Usage

Before you start you need to create a special tunnel between your localhost and the network. Open terminal and type

```sh
./ngrok http 3000
```

then copy the forwarding url **remeber to use HTTPS protocol** and paste it to .env file as _appUrl_ **without slash at the end** and as _shopUrl_
**with slash at the end**. Now if you are using node v >= 16.x you can simply enter

```sh
npm run start
```

<p align="right">(<a href="#top">back to top</a>)</p>

## :pencil: License

This project is licensed under [MIT](https://opensource.org/licenses/MIT) license.



## :man_astronaut: Show your support

Give a ⭐️ if this project helped you!


## ℹ️ Fun Facts

  [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=kubo550_messenger-bot&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=kubo550_messenger-bot)
