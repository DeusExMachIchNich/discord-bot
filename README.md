



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/DanielSpindler/discord-bot">
    <h3 align="center">Simple Discord Appointment Bot</h3>
  </a>
  <p align="center">
    An Bot to create Appointments and get Notifications
    <br />
</div>

<!-- ABOUT THE BOT -->
## About The Bot


This is a simple Discord-bot to create appointments and get notifications from the Bot if the appointment is in a specified time range, can be changed in the .env file.
You can delete appointments and with a set role you can also use commands for the pm2 to restart the bot from afar or to stop it.

A new feature is the embed Reply. you can choose whenever you want a basic text-reply or a embed reply.

Most Messages can be changed in the .env file. More incoming.

The bot includes a Sqlite3 filebased Database to store Appointments. The Appointments will be deleted automatical after they expired.




<!-- GETTING STARTED -->
## Getting Started



### Prerequisites
Added a Discordbot via the discord page to your server so that u have a discord-bot-Token, BOT ID and "Guild" ID .. aka Server ID 

node v18.x

### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/DeusExMachIchNich/discord-bot.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. copy .env-example and name it .env & edit it after !IMPORTANT!
   ```env
   as instructed in the .env   
   ```
4. Run
   ```sh
   npm run start
   ```



<!-- USAGE EXAMPLES -->
## Usage

Add your first Appointment with /add . Support format 00.00.0000 00:00 & 00/00/0000 00:00

## In the Future

update exsisting appointments

Got any more input? reach out to us or create a issue / request
