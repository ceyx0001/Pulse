import Modal from "@/components/Modal";
import { useDeleteProjectMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
};

const ModalDeleteProject = ({ isOpen, onClose, id, name }: Props) => {
  const [deleteProject] = useDeleteProjectMutation();
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (input === `delete ${name}`) {
      await deleteProject(Number(id));
      onClose();
      setInput("");
      router.push("/");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Delete Project">
      <div className="flex flex-col gap-10 p-4">
        <p className="text-center text-lg font-semibold text-gray-800 dark:text-white">
          Are you sure you want to delete {name}? This will delete all
          associated tasks,boards, and comments. Type &apos;delete {name}&apos;
          to confirm.
        </p>
        <input
          type="text"
          className="rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={`w-[25%] self-center rounded bg-red-700 p-2 text-white hover:bg-red-800 ${input !== `delete ${name}` ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={handleDelete}
          disabled={input !== `delete ${name}`}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeleteProject;
