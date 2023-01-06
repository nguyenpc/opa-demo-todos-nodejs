import express from "express";
import { TaskService, ITaskCreate, ITaskUpdate } from "../../services";
import { pdpCall } from "../../auth/authz.service";
import { permissions } from "../../auth/constant";

const router = express.Router({ mergeParams: true });

router.get(
  "",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // call rego to check if user has permission create_task
    // console.log(req.activeUser.permissions)
    const isPermitted = await pdpCall(req.activeUser, {}, "task", permissions.read_task);
    if(!isPermitted) {
      return res.status(401).json({message: "unauthorized"});
    }
    TaskService.getAllInBoard(req.board.id)
      .then((tasks) => {
        return res.json(tasks.map((t) => t.toJSON()));
      })
      .catch(next);
  }
);

router.get(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;
    TaskService.get(taskId, req.board.id)
      .then(async (task) => {

        if (!task) {
          return res.status(404).send("task not found!");
        }
        const isPermitted = await pdpCall(req.activeUser, task, "task", permissions.read_task);
        if(!isPermitted) {
          return res.status(401).json({message: "unauthorized"});
        }
        return res.json(task.toJSON());
      })
      .catch(next);
  }
);

router.post(
  "",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {

    const isPermitted = await pdpCall(req.activeUser, null, "task", permissions.create_task);
    if(!isPermitted) {
      return res.status(401).json({message: "unauthorized"});
    }
    const userId: string = req.activeUser.id; 
    const email: string = req.activeUser.email;
    // "validation"
    if (!req.body.title) {
      return res.status(422).json({ errors: { title: "can't be blank" } });
    }

    const taskData: ITaskCreate = {
      boardId: req.board.id,
      title: req.body.title,
      userId,
      email,
    };
    TaskService.create(taskData)
      .then((task) => {
        return res.json(task.toJSON());
      })
      .catch(next);
  }
);

router.put(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;

    const update: ITaskUpdate = {};
    if (req.body.title) {
      update.title = req.body.title;
    }
    if (req.body.description) {
      update.description = req.body.description;
    }
    if (req.body.checked !== null && req.body.checked !== undefined) {
      update.checked = req.body.checked;
    }
    const taskDetail = await TaskService.get(taskId, req.board.id);

    const isPermitted = await pdpCall(req.activeUser, taskDetail, "task", permissions.update_task);
    if(!isPermitted) {
      return res.status(401).json({message: "unauthorized"});
    }

    const task = await TaskService.update(taskId, update);
    if (task === null) {
      return res.status(404).send("task not found!");
    } else {
      return res.json(task.toJSON());
    }
  }
);

router.delete(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;
    const task = await TaskService.get(taskId, req.board.id);

    if (!task) {
      return res.status(404).send("task not found!");
    }
    const isPermitted = await pdpCall(req.activeUser, task, "task", permissions.delete_task);
    if(!isPermitted) {
      return res.status(401).json({message: "unauthorized"});
    }

    TaskService.remove(taskId)
      .then(() => {
        return res.sendStatus(204);
      })
      .catch(next);
  }
);

export default router;
