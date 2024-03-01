# discord-commits
A GitHub action that publishes any commits to Discord

# Key Differences
- Webhook avatar matches the commiter's profile picture
- Private commits will be hidden with random blocks
- Commits will be split up under 2000 characters, so all of your commits will show up

# Getting Started
- Create a `.yml` file under `.github/workflows` with this code below
```yml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Discord webhook
      uses: itz-coffee/discord-commits@v2.0.2
      with:
        webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
```
- Add your discord webhook as a secret named `webhookUrl`

![image](https://user-images.githubusercontent.com/36643731/224229138-4efc9094-be0e-4d4a-92b1-43959ed8d9b3.png)

- Any commits starting with a `!` or `$` will be private

<img width="354" alt="image" src="https://github.com/itz-coffee/discord-commits/assets/36643731/a1e3e763-8cef-421d-84f4-273d871a0516">

# Remarks
Currently only push events are supported and the focus of this tool. Pull requests and issues for more ideas/features are more than welcome!
