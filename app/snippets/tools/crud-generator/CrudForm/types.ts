type Options = {
  method: "post" | "get" | "delete" | "put" | "patch";
  name: string;
  defaultErrorMessage: string;
  route: string;
  version: "legacy" | "latest";
  queryHook: "useSuspenseQuery" | "useQuery";
  mutationSuccessMessage: string;
};
