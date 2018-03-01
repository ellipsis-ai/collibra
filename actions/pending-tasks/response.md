{if successResult.isEmpty}
You don't have any pending tasks. :thumbsup:
{else}
Pending tasks for `{successResult.username}`:
{for task in successResult.tasks}
- [{task.title}]({task.link}) is due {task.dueDate}
{endfor}
{endif}