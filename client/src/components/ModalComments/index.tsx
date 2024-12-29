import Modal from "@/components/Modal";
import { Task } from "@/state/api";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

type Comment = {
  text: string;
};

const ModalComments = ({ isOpen, onClose, task }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Comments">
      <div className="space-y-4">
        {task.comments?.map((comment, i) => (
          <div key={"task-" + task.id + "-comment-" + i}>
            <p className="text-gray-500 dark:text-white">
              {(comment as unknown as Comment).text}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ModalComments;
