import Modal from "@/components/Modal";
import {
  Task,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { useState } from "react";
import { Comment as CommentType } from "@/state/api";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  comments: CommentType[];
  commentCount: number;
  columnStats: { tasksCount: number; totalCommentsCount: number };
  setColumnStats: (columnStats: {
    tasksCount: number;
    totalCommentsCount: number;
  }) => void;
};

const ModalComments = ({
  isOpen,
  onClose,
  task,
  comments,
  commentCount,
  columnStats,
  setColumnStats,
}: Props) => {
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { data: user } = useGetAuthUserQuery();
  const [commentText, setCommentText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = () => {
    if (!user?.userDetails.userId) return;
    const newComment: CommentType = {
      id: commentCount + 1,
      text: commentText,
      taskId: task.id,
      userId: user?.userDetails.userId,
    };
    createComment(newComment);
    setColumnStats({
      ...columnStats,
      totalCommentsCount: columnStats.totalCommentsCount + 1,
    });
  };

  const handleDelete = (commentId: number, taskId: number) => {
    deleteComment({ commentId, taskId });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Comments">
      <div className="flex flex-col gap-7 px-7 pt-5">
        {comments?.map((comment, i) => (
          <div key={"task-" + task.id + "-comment-" + i} className="flex items-center justify-between">
            <p className="text-black dark:text-white">{comment.text}</p>
            <button className="scale-125" onClick={() => handleDelete(comment.id, task.id)}>
              <X className="h-4 w-4 text-white dark:text-white bg-red-700" />
            </button>
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
          className={`w-[25%] self-center rounded-md p-2 text-white ${
            commentText.trim()
              ? "bg-blue-500"
              : "cursor-not-allowed bg-gray-400"
          }`}
          onClick={handleSubmit}
          disabled={!commentText}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default ModalComments;
