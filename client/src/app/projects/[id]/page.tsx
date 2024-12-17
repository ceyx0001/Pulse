"use client";

import React, { use, useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";

type ProjectProps = {
  params: Promise<{ id: string }>;
};

enum Tabs {
  board = "board",
}

const Project = ({ params }: ProjectProps) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState(Tabs.board as string);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === Tabs.board && (
        <Board id={id} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Project;
