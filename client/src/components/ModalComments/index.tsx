import Modal from "@/components/Modal";
import { Task, useGetAuthUserQuery, useUpdateTaskCommentsMutation } from "@/state/api";
import { useState, useCallback, useMemo } from "react";
import { Comment as CommentType } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

const ModalComments = ({ isOpen, onClose, task }: Props) => {
  const [updateTaskComments, { isLoading }] = useUpdateTaskCommentsMutation();
  const { data: user } = useGetAuthUserQuery();
  const [comments, setComments] = useState(task.comments || []);
  const [commentText, setCommentText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = () => {
    if (!user?.userDetails.userId) return;
    const newComment: CommentType = {
      id: undefined,
      text: commentText,
      taskId: task.id,
      userId: user?.userDetails.userId,
    };
    updateTaskComments({
      taskId: task.id,
      comments: [...comments, newComment],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Comments">
      <div className="flex flex-col gap-5 px-7">
        {comments?.map((comment, i) => (
          <div key={"task-" + task.id + "-comment-" + i}>
            <p className="text-gray-500 dark:text-white">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5 px-5 pb-2 pt-6">
        <textarea
          className="w-full rounded-md border border-gray-300 p-2 dark:bg-dark-bg dark:text-white"
          placeholder="Write your comment here..."
          value={commentText}
          onChange={handleChange}
        />
        <button
          className="w-[25%] self-center rounded-md bg-blue-500 p-2 text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default ModalComments;
