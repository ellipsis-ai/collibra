I found {successResult.count} matches for "{assetName}".

They are:

{for result in successResult.results}
- [{result.asset.name}]({result.link}) {if result.hasDefinition}has definition "{result.definition}"{else}has no definition yet{endif}

{endfor}