Hello, {successResult.slackUserName} and welcome to the Collibra skill.

**Some things you might want to know:**
- You are currently logged in as user `{successResult.collibraUsername}` in Collibra. 
{if successResult.isCannedUser}
- Because you are logged in as a demo user, you will only see assets in the `{successResult.domainName}`.
{endif}
- The `datacitizen` Collibra user was created specifically for this demo, to allow you to try out the system. As `datacitizen`, you can find and create assets within the `{successResult.domainName}`. You can also start a simple approval workflow for these assets.

**Some useful commands you can type:**
- `...find business term` – Find the definition for a business term or add a new one
- `...find acronym` – Find the definition for an acronym or add a new one
- `...find report` – Find the definition for a report or add a new one
- `...find business steward` – Find the business steward for a community
- `...find definition for <search query>` – Find the definition for an asset matching <search query>
- `...add new demo asset` - Add a new asset to the demo domain
- `...list demo assets` – List all the assets in the demo domain
- `...collibra intro` – See the intro message again

Here are some shortcuts for common use cases: