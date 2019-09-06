{for asset in successResult.assets}


**Collibra asset:** {asset.name}:


**Definitions:**


{for def in asset.definitions}
- {def}
{endfor}
{if asset.hasDictionaryMatches}


**Related Wiktionary definitions:**
{endif}
{for match in asset.dictionary}


- {match.word}: {match.definition}
{endfor}


====================================
{endfor}