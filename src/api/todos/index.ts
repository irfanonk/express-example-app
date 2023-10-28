import dbClient from "../../db/db-client";
import { Router } from "express";

import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const todos = await dbClient().select().from(schema.todos);

  if (!todos) {
    res.status(404);
    throw new Error("todos not found");
  }

  res.json({
    data: todos,
  });
});

router.post<
  {},
  {},
  {
    title: string;
  }
>("/", async (req, res, next) => {
  const { title } = req.body;

  try {
    const todo = await dbClient()
      .insert(schema.todos)
      .values({
        title,
        description: "",
      })
      .returning({
        id: schema.todos.id,
        title: schema.todos.title,
        description: schema.todos.description,
        completed: schema.todos.completed,
      });

    res.json({
      data: todo,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.put<
  {
    id: string;
  },
  {},
  {
    title: string;
    description: string;
    completed: boolean;
  }
>("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const todo = await dbClient()
      .update(schema.todos)
      .set({
        title,
        description,
        completed,
      })
      .where(eq(schema.todos.id, id))
      .returning({
        id: schema.todos.id,
        title: schema.todos.title,
        description: schema.todos.description,
        completed: schema.todos.completed,
      });

    res.json({
      data: todo,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.delete<
  {
    id: string;
  },
  {},
  {}
>("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await dbClient()
      .delete(schema.todos)
      .where(eq(schema.todos.id, id))
      .returning({
        id: schema.todos.id,
        title: schema.todos.title,
        description: schema.todos.description,
        completed: schema.todos.completed,
      });

    res.json({
      data: todo,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

export default router;
