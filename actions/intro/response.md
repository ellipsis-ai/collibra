Hello, {successResult.slackUserName} and welcome to the Collibra skill.

Some things you might want to know:
- You are currently logged in as user `{successResult.collibraUsername}` in Collibra.
{if successResult.isCannedUser}
- Because you are logged in as a demo user, you will only see assets in the `Ellipsis Demo Domain`.
{endif}

Here are some useful commands you can type:
- `...find definition for <search query>` – find the definition for an asset matching <search query>
- `...become datasteward` – Become a Collibra user with the Data Steward role for the demo domain
- `...resign` – Go back to the default Data Citizen role
- `...login to collibra` – log in as another user
- `...check for next collibra task` - start on the next collibra task, if any.
- `...list demo assets` – list all the assets in the demo domain
- `...collibra intro` – see the intro message again

A good way to try out this skill is to find an existing definition or add a new one.