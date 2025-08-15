interface UserRelationProps {
  id: string;
  userId: string;
  userFullName: string;
  profileGroupId: string;
  profileGroupName: string;
}

export type UserRelationFormValues = { userId: string; profileGroupId: string };

export default UserRelationProps;
