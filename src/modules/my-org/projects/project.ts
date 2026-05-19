type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignees: Assignee[];
};
