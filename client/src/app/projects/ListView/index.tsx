import Header from "@/components/Header";
import { Task, useGetTasksQuery } from "@/state/api";
import TaskCard from "@/components/TaskCard";
import React from "react";
import { ViewProps } from "@/lib/types";

const List = ({ id, setIsModalOpen }: ViewProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <span className="text-gray-500">Loading...</span>;
  if (error) return <span className="text-red-500">Error while fetching tasks.</span>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          isSmallText
          buttonComponent={
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add Task
            </button>
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => <TaskCard key={"task-card-list-" + task.id} task={task} />)}
      </div>
    </div>
  );
};

export default List;
