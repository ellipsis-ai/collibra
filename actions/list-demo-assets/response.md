The assets in the demo domain are:
{for ea in successResult.list}
- [{ea.name}]({ea.link})
{endfor}

{if successResult.isLimited}
(limited to the first {successResult.limit} results)
{endif}