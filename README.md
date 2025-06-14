<h1 align="center"> YouTube Music Bot for Discord </h1>

As the repo name states `simple`, it is very basic and quickly written (about 2 evenings) bot for Discord that can play music from youtube. Originally, it was created as side hustle (not having much of free time to spend on it), for my friends to be able to listen to music from youtube on discord, so it may have a lot of bugs and shortcomings, but it does what it was "designed" to do.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Run](#run)
- [Usage](#usage)
- [List of Commands](#list-of-commands)
- [Discord Commands Example](#discord-commands-example)

## Requirements

- nodejs and npm

## Installation

- copy this repository into desired localization
- open terminal inside downloaded repository
- run `npm update`
- open `config.json` file
	- type your desired prefix you'll have to put before every command typed into discord
	- paste your private access token generated by Discord Developer -> Applications (remember to add bot to your discord server)

## Run

In terminal in downloaded repository run command `node .`. Bot after connecting to discord servers will inform you in terminal displaying messsage `Bot connected`.

## Usage

This section assumes bot is running, is successfully connected to discord, is added to your discord server, and have appropriate priviliges on this server.
To use bot, you have to be on voice channel, and send command as discord message on text channel. Bot will read your command from message history of this channel, but only new messages that occured while bot was connected.
Below, is list of commands, but without prefixes. Remember to put your chosen prefix before each command when you execute it.

## List of commands

WITHOUT PREFIXES

- `play` -> Plays music from given link (starts with `http`) or searches for given title (if not starting with `http`) and plays it. If any song is already playing, new song is added to queue
- `playlist` -> Plays given playlist
- `skip` -> Skips current song, and jumps to next one
- `pause` -> Pauses playback
- `stop` -> Stops playing music, cleares queue, and leaves voice channel
- `resume` -> Resumes paused music
- `repeat` -> Sets `repeat` option for the queue. Available options: `all`, `one`, `none`

## Discord Commands Example

For purpose of this example, `prefix` in `config.json` is set as `!`.

Steps:
1. Start playing first song
2. Add 2nd song to queue
3. Pause
4. Resume
5. Skip to next song
6. Stop playing music and clear queue

Keep in mind, that every new line is another discord message.
```
!play Firelink Shrine Theme
!play Majula Theme
!pause
!resume
!skip
!stop
```
