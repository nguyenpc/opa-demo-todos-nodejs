// export const RESOURCES = [
//   'BOARD',
//   'TASK'
// ];

import _, { map } from "underscore"

// export const ACTIONS = [
//   'create',
//   'read',
//   'update',
//   'delete'
// ]

const  roles = {
  create_board: 'create_board',
  update_board: 'update_board',
  read_board: 'read_board',
  delete_board: 'delete_board',
  create_task: 'create_task',
  read_task: 'read_task',
  update_task: 'update_task',
  delete_task: 'delete_task',
}

const enum userGroups {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER ='VIEWER',
}

const permissionAssignment = [
  {
    group: userGroups.ADMIN,
    permission: Object.values(roles).map((r)=> String(r)),
  },
  {
    group: userGroups.EDITOR,
    permission: [roles.update_board, roles.update_task],
  },
  {
    group: userGroups.EDITOR,
    permission: [roles.read_board, roles.read_task],
  }
  
]

export const userAssignments: Array<{userId: string, groups: Array<string>}> = [
  {
    userId: '5195c633-80e2-450d-8edd-2163db610d99', groups: [String(userGroups.VIEWER), String(userGroups.EDITOR)],
  },
  {
    userId: '', groups: [String(userGroups.EDITOR)],
  },
  {
    userId: '', groups: [String(userGroups.VIEWER)],
  }
]

export const getUserPermission = (user: any) => {
  const userInfo = userAssignments.find(({userId}) => userId === user.id);
  const permissions = permissionAssignment.filter((perma) => userInfo.groups.includes(perma.group));
  return _.uniq(_.flatten(map(permissions, 'permission')));
}