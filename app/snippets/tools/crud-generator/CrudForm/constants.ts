const methods = ["post", "get", "delete", "put", "patch"] as const;
const queryHooks = ["useSuspenseQuery", "useQuery"] as const;
const apiDefaultErrorMessage =
  "مشکلی در هنگام دریافت X رخ داده است! لطفا دوباره تلاش کنید.";

export { methods, queryHooks, apiDefaultErrorMessage };
