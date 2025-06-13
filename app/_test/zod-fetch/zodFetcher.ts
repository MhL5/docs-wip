import { HTTPError } from "ky";
import { ZodError, ZodSchema, z } from "zod";
import { _getLocalizedErrorMessage } from "./_getLocalizedErrorMessage";
import type { ZodType } from "zod/v4";

type ReturnType<DataResponse, ErrorResponse> = Promise<
  | {
      success: false;
      localizedErrorMessage: string;
      status: number;
      error: ErrorResponse;
    }
  | {
      success: true;
      data: z.infer<ZodSchema<DataResponse>>;
    }
>;

export const isHTTPError = (error: unknown): error is HTTPError =>
  (error as { name: string })?.name === "HTTPError";

const errorLogger = (err: unknown) => {};

export async function zodFetcher<DataResponse, ErrorResponse = Error>(
  promise: Promise<DataResponse>,
  schema: ZodType<DataResponse>,
  options: {
    mutateResponse?: (response: DataResponse) => DataResponse;
    mutateErrorLocalizedMessage?: (
      error: ErrorResponse,
      status: number,
    ) => string;
  } = {},
): ReturnType<DataResponse, ErrorResponse> {
  try {
    const response = await promise;
    const mutateResponse = options.mutateResponse
      ? options.mutateResponse(response)
      : response;

    const parsed = await schema.safeParseAsync(mutateResponse);

    if (!parsed.success) throw parsed.error;

    return { success: true, data: parsed.data };
  } catch (err) {
    errorLogger(err);

    let status = 500;
    let error: ErrorResponse | Error = new Error("مشکلی پیش آمده است");

    // there is 3 error types
    // 1. HTTP error by ky
    // 2. Js Errors
    // 3. ky errors
    // 4. lastly unknown errors
    switch (true) {
      // zod errors only happen in development and we want the entire error object
      case err instanceof ZodError:
        break;

      case isHTTPError(err):
        try {
          const response = err.response;
          status = response.status;
          const responseError = await response.json();
          const message =
            (responseError as { message?: string })?.message ||
            (responseError as { error?: string })?.error ||
            undefined;
          error = new Error(message || "خطای ناشناخته از سمت سرور");
        } catch {}
        break;

      case err instanceof Error:
        error = err as ErrorResponse;
        break;

      default:
        error = new Error("مشکلی پیش آمده است");
    }

    const localizedErrorMessage =
      options.mutateErrorLocalizedMessage?.(error as ErrorResponse, status) ||
      _getLocalizedErrorMessage({
        errorName: (error as { name?: string })?.name || "",
        status,
      });

    return {
      success: false,
      status,
      error: error as ErrorResponse,
      localizedErrorMessage,
    };
  }
}
