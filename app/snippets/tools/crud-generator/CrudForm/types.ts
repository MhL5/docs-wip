type Options = {
  method: "post" | "get" | "delete" | "put" | "patch";
  name: string;
  defaultErrorMessage: string;
  route: string;
  queryHook: "useSuspenseQuery" | "useQuery";
  mutationSuccessMessage: string;
};
