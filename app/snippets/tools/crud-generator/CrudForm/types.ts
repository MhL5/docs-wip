export type Options = {
  method: "post" | "get" | "delete" | "put" | "patch";
  name: string;
  route: string;
  queryHook: "useSuspenseQuery" | "useQuery";
  nameLabel: string;
};
