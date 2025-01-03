import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthUser, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export type Project = {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export type User = {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
};

export type Attachment = {
  id: number;
  fileUrl: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
};

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export type Task = {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
};

export type SearchResults = {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
};

export type Team = {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
};

export type AuthUserResponse = {
  user: AuthUser;
  userSub: string;
  userDetails: User;
};

export type Comment = {
  id: number;
  text: string;
  taskId: number;
  userId: number;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Comments"],
  endpoints: (build) => ({
    getAuthUser: build.query<AuthUserResponse, void>({
      queryFn: async (_args, _api, _extraOptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if (!session) throw new Error("No session found");
          if (!user) throw new Error("No user found");

          const { userSub } = session;
          if (!userSub) throw new Error("No user sub found");
          const userDetailsResponse = await fetchWithBQ({
            url: `users/${userSub}`,
            method: "GET",
          });
          const userDetails = userDetailsResponse.data as User;

          return { data: { user, userSub, userDetails } };
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: "Internal Server Error",
              data: (error as Error).message,
            },
          };
        }
      },
    }),
    getProjects: build.query<Project[], void>({
      query: () => ({
        url: `projects`,
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    deleteProject: build.mutation<Project, number>({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects", "Tasks"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, _, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: (result) => [
        "Tasks",
        { type: "Tasks", id: result?.projectId }, 
        { type: "Tasks", id: result?.assignedUserId },
      ],
    }),
    deleteTask: build.mutation<Task, { taskId: number; userId: number }>({
      query: ({ taskId, userId }) => ({
        url: `tasks/${taskId}/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    updateTaskPoints: build.mutation<Task, { taskId: number; points: number }>({
      query: ({ taskId, points }) => ({
        url: `tasks/${taskId}/points`,
        method: "PATCH",
        body: { points },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    deleteComment: build.mutation<
      Comment,
      { commentId: number; taskId: number }
    >({
      query: ({ commentId, taskId }) => ({
        url: `comments/${commentId}/task/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Tasks", id: args.taskId },
        { type: "Comments" },
      ],
    }),
    createComment: build.mutation<Comment, Comment>({
      query: (comment) => ({
        url: `comments`,
        method: "POST",
        body: {
          id: comment.id,
          text: comment.text,
          taskId: comment.taskId,
          userId: comment.userId,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Tasks", id: args.taskId },
        { type: "Comments" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskPointsMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = api;
