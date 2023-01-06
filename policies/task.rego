package task

import future.keywords.in

default allow = false

default can_modify = false

default read_task = false
default delete_task = false
default create_task = false
default update_task = false


create_task {
  subject := input.subject
	some i, "create_task" in subject.permissions
}

read_task {
  subject := input.subject
	some i, "read_task" in subject.permissions
}

delete_task {
  subject := input.subject
	some i, "delete_task" in subject.permissions
}

delete_task {
  subject := input.subject
  resource := input.resource
  resource.userId = subject.id
}

update_task {
  subject := input.subject
	some i, "update_task" in subject.permissions
}

update_task {
  subject := input.subject
  resource := input.resource
  resource.userId = subject.id
}

