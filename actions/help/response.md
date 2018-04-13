Hello, {successResult.slackUserName} and welcome to the Collibra skill.

**Some things you might want to know:**
- You are currently logged in as user `{successResult.collibraUsername}` in Collibra. 
{if successResult.isCannedUser}
- Because you are logged in as a demo user, you will only see assets in the `Ellipsis Demo Domain`.
{endif}
- The `datacitizen` and `datasteward` Collibra users were created specifically for this demo, to allow you to try out the system in two different roles: 
- As `datacitizen`, you can find and create assets within the `Ellipsis Demo Domain`. You can also start a simple approval workflow for these assets.
- As `datasteward`, you can approve or reject the proposed assets within the simple approval workflow

**Some useful commands you can type:**
- `...find definition for <search query>` – Find the definition for an asset matching <search query>
- `...add new demo asset` - Add a new asset to the demo domain
- `...become datasteward` – Become a Collibra user with the Data Steward role for the demo domain
- `...resign` – Go back to the default Data Citizen role
- `...login to collibra` – Log in as another user
- `...check for next collibra task` - Start on the next collibra task, if any.
- `...list demo assets` – List all the assets in the demo domain
- `...collibra intro` – See the intro message again

A good way to try out this skill is to find an existing definition or add a new one.