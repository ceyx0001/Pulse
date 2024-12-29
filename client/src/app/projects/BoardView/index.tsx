import React, { useState } from "react";
import {
  Status,
  useDeleteTaskMutation,
  useGetAuthUserQuery,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import { Priority as PriorityTypes } from "@/state/api";
import Image from "next/image";
import { ViewProps } from "@/lib/types";
import { Popover } from "@mui/material";
import ModalComments from "@/components/ModalComments";

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const Board = ({
  id,
  setIsModalOpen,
  setDefaultStatus,
}: ViewProps & { setDefaultStatus: (status: Status) => void }) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <span className="text-gray-500">Loading...</span>;
  if (error)
    return <span className="text-red-500">Error while fetching tasks.</span>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={"task-column-" + status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalOpen={setIsModalOpen}
            setDefaultStatus={setDefaultStatus}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setDefaultStatus: (status: Status) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalOpen,
  setDefaultStatus,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const tasksCount = tasks.filter((task) => task.status === status).length;
  const statusColor = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(el) => {
        drop(el);
      }}
      className={`sl-py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status as keyof typeof statusColor]}] rounded-s-lg`}
          style={{
            backgroundColor: statusColor[status as keyof typeof statusColor],
          }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => {
                setIsModalOpen(true);
                setDefaultStatus(
                  Status[status.replace(/\s+/g, "") as keyof typeof Status],
                );
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={"task-component-" + task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));
  const { data: currentUser } = useGetAuthUserQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isModalCommentsOpen, setIsModalCommentsOpen] = useState(false);

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";
  const commentsCount = (task.comments && task.comments.length) || 0;
  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === PriorityTypes.Urgent
          ? "bg-red-200 text-red-700"
          : priority === PriorityTypes.High
            ? "bg-yellow-200 text-yellow-700"
            : priority === PriorityTypes.Medium
              ? "bg-green-200 text-green-700"
              : priority === PriorityTypes.Low
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const userDetails = currentUser?.userDetails;

  const handleTaskClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsDone = () => {
    updateTaskStatus({ taskId: task.id, status: "Completed" });
    setAnchorEl(null);
  };
  const handleDeleteTask = () => {
    if (!userDetails?.userId) return;
    deleteTask({ taskId: task.id, userId: userDetails.userId })
      .unwrap()
      .then(() => {
        setAnchorEl(null);
      })
      .catch((err) => {
        if (err.status === 404) {
        } else {
        }
      });
  };

  return (
    <>
      <ModalComments
        isOpen={isModalCommentsOpen}
        onClose={() => setIsModalCommentsOpen(false)}
        task={task}
      />
      <div
        ref={(el) => {
          drag(el);
        }}
        className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"}`}
      >
        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={`/${task.attachments[0].fileUrl}`}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        )}
        <div className="p4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {task.priority && <PriorityTag priority={task.priority} />}
              <div className="flex gap-2">
                {taskTagsSplit.map((tag) => (
                  <div
                    key={"task-tag-" + tag}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                  >
                    {" "}
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
              onClick={handleTaskClick}
            >
              <EllipsisVertical size={26} />
            </button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div className="flex flex-col gap-2 border border-stroke-dark p-1 dark:bg-dark-bg dark:text-white">
                <button
                  className="rounded p-2 transition-colors duration-100 ease-in-out hover:bg-dark-tertiary"
                  onClick={handleMarkAsDone}
                >
                  Mark as done
                </button>
                <button
                  className="rounded p-1 text-white transition-colors duration-100 ease-in-out hover:bg-red-500"
                  onClick={handleDeleteTask}
                >
                  Delete
                </button>
              </div>
            </Popover>
          </div>

          <div className="my-3 flex justify-between">
            <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
            {typeof task.points === "number" && (
              <div className="text-xs font-semibold dark:text-white">
                {task.points} pts
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
          <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-[6px] overflow-hidden">
              {task.assignee && (
                <Image
                  key={"task-assignee-image-" + task.assignee.userId}
                  src={`/${task.assignee.profilePictureUrl!}`}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}

              {task.author && (
                <Image
                  key={"task-author-image-" + task.author.userId}
                  src={`/${task.author.profilePictureUrl!}`}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
            </div>

            <button
              className={`flex items-center text-gray-500 dark:text-neutral-500 ${commentsCount > 0 ? "transition-[transform, color] duration-200 ease-in-out hover:scale-125 hover:text-blue-500 dark:hover:text-white" : ""}`}
              disabled={commentsCount === 0}
              onClick={() => setIsModalCommentsOpen(true)}
            >
              <MessageSquareMore size={20} />
              <span className="ml-1 text-sm">{commentsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
