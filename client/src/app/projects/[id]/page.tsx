"use client";

import React, { use, useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import { Status } from "@/state/api";

type ProjectProps = {
  params: Promise<{ id: string }>;
};

enum Tabs {
  board = "Board",
  list = "List",
  timeline = "Timeline",
  table = "Table",
}

const Project = ({ params }: ProjectProps) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState(Tabs.board as string);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<Status | undefined>(undefined);

  return (
    <div>
      <ModalNewTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
        defaultStatus={defaultStatus}
      />

      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === Tabs.board && (
        <Board 
          id={id} 
          setIsModalOpen={setIsModalOpen}
          setDefaultStatus={setDefaultStatus}
        />
      )}

      {activeTab === Tabs.list && (
        <List id={id} setIsModalOpen={setIsModalOpen} />
      )}

      {activeTab === Tabs.timeline && (
        <Timeline id={id} setIsModalOpen={setIsModalOpen} />
      )}

      {activeTab === Tabs.table && (
        <Table id={id} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Project;
