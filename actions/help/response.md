Hello, {successResult.slackUserName} and welcome to the Collibra skill.

**Some things you might want to know:**
- You are currently logged in to Collibra as user `{successResult.collibraUsername}` on the [Brandywine Development Collibra instance]({successResult.collibraInstanceUrl}). 
{if successResult.isCannedUser}
- Because you are logged in as a demo user, you will only see assets in the domain `{successResult.domainName}`.
{endif}
- As `{successResult.collibraUsername}`, you can find assets in the domain `{successResult.domainName}`. 

**Some useful commands you can type:**
- `...find business term` – Find the definition for a business term or add a new one
- `...find acronym` – Find the definition for an acronym or add a new one
- `...find report` – Find the definition for a report or add a new one
- `...find business steward` – Find the business steward for a community
- `...find definition for <search query>` – Find the definition for an asset matching <search query>
- `...list demo assets` – List all the assets in the demo domain
- `...collibra intro` – See the intro message again

Here are some shortcuts for common use cases: