import Header from "@/components/Header";
import { Task, useGetTasksQuery } from "@/state/api";
import TaskCard from "@/components/TaskCard";
import React from "react";

type ListProps = { id: string; setIsModalOpen: (isOpen: boolean) => void };

const List = ({ id, setIsModalOpen }: ListProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error while fetching tasks.</span>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="List" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export default List;
