import { prisma } from "../lib/prisma";
import { TaskStatus } from "../generated/prisma/client";

interface CreateTaskInput {
  title: string;
  description?: string;
  createdById: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
}

export const createTask = async ({
  title,
  description,
  createdById,
}: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      title,
      description,
      createdById,
      status: TaskStatus.TODO,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getTasks = async (userId: string, isAdmin: boolean) => {
  if (isAdmin) {
    return prisma.task.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return prisma.task.findMany({
    where: {
      OR: [
        {
          createdById: userId,
        },
        {
          assignedToId: userId,
        },
      ],
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTaskById = async (taskId: string) => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput
) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteTask = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
};

export const assignTaskToSelf = async (
  taskId: string,
  userId: string
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.assignedToId) {
    throw new Error("Task is already assigned");
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedToId: userId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const assignTask = async (
  taskId: string,
  assignedToId: string | null
) => {
  if (assignedToId) {
    const user = await prisma.user.findUnique({
      where: {
        id: assignedToId,
      },
    });

    if (!user) {
      throw new Error("Assigned user not found");
    }
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedToId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};