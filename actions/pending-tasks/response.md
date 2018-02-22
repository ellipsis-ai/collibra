Pending tasks for `{successResult.username}`:
{for task in successResult.tasks}
- [{task.title}]({task.link}) is due {task.dueDate}
{endfor}