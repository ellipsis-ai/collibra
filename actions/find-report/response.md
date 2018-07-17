{if successResult.isAddingNew}

{else}
{if successResult.hasDefinition}
[{successResult.name}]({successResult.link}) is defined as:

{for definition in successResult.definitions}
> {definition}
{endfor}
{else}
{successResult.name} doesn't yet have a definition. You can add one now if you like.
{endif}
{endif}
