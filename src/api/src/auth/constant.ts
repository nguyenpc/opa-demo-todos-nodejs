// export const RESOURCES = [
//   'BOARD',
//   'TASK'
// ];

import _, { map } from "underscore";

// export const ACTIONS = [
//   'create',
//   'read',
//   'update',
//   'delete'
// ]

export const permissions = {
  create_board: "create_board",
  update_board: "update_board",
  read_board: "read_board",
  delete_board: "delete_board",
  create_task: "create_task",
  read_task: "read_task",
  update_task: "update_task",
  delete_task: "delete_task",
};

const enum userGroups {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER ="VIEWER",
}

const permissionAssignment = [
  {
    group: userGroups.ADMIN,
    permission: Object.values(permissions).map((r)=> String(r)),
  },
  {
    group: userGroups.EDITOR,
    permission: [permissions.update_board, permissions.update_task],
  },
  {
    group: userGroups.VIEWER,
    permission: [permissions.read_board, permissions.read_task, permissions.create_task],
  }
  
];

export const userAssignments: Array<{email: string, groups: Array<string>}> = [
  {
    email: "admin@gmail.com", groups: [String(userGroups.ADMIN), String(userGroups.EDITOR)],
  },
  {
    email: "viewer@gmail.com", groups: [String(userGroups.VIEWER)],
  }
];

export const getUserPermission = (user: any): Array<string> => {
  const userInfo = userAssignments.find(({email}) => email === user.email);
  const permissions = permissionAssignment.filter((perma) => (userInfo?.groups || []).includes(perma.group));
  return _.uniq(_.flatten(map(permissions, "permission")));
};