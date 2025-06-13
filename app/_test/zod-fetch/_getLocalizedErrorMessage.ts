const DEFAULT_MESSAGES = {
  fa: {
    timeout:
      "اتصال اینترنت برقرار نیست. خواهشمندیم پس از رفع مشکل، دوباره تلاش فرمایید.",
    abort: "درخواست شما لغو شد.",
    unknown: "خطای پیش‌بینی‌نشده‌ای رخ داد. لطفاً دوباره تلاش فرمایید.",
  },
  en: {
    timeout:
      "No internet connection. Please check your connection and try again.",
    abort: "The request was aborted.",
    unknown: "Something went wrong! Please try again.",
  },
};

const HTTP_STATUS_MESSAGES: Record<"fa" | "en", Record<number, string>> = {
  fa: {
    400: "کاربر گرامی، متأسفیم؛ درخواست شما قابل پردازش نبود. لطفاً صحت اطلاعات را بررسی کرده و مجدداً اقدام فرمایید.",
    401: "برای استفاده از این بخش، لطفاً ابتدا وارد حساب کاربری خود شوید.",
    403: "کاربر ارجمند، شما دسترسی لازم به این بخش را ندارید. در صورت احساس مغایرت، با پشتیبانی اختصاصی ما تماس حاصل فرمایید.",
    404: "متأسفانه موردی با این مشخصات یافت نشد. لطفاً اطلاعات را بازبینی کرده و دوباره امتحان نمایید.",
    408: "اتصال اینترنت شما کند یا قطع شده است. خواهشمندیم پس از بررسی اتصال، دوباره تلاش فرمایید.",
    409: "تداخل در عملیات رخ داده است. لطفاً صفحه را بازنگری کنید و سپس مجدداً اقدام فرمایید.",
    422: "داده‌های ارسال‌شده معتبر نیستند. لطفاً اطلاعات را اصلاح کرده و دوباره ارسال نمایید.",
    429: "تعداد درخواست‌های شما از حد مجاز فراتر رفته است. لطفاً اندکی صبر نموده و سپس دوباره اقدام فرمایید.",
    500: "با پوزش، مشکلی در سرور رخ داده است. چند لحظه بعد دوباره تلاش کنید و در صورت تداوم مشکل، با پشتیبانی ما در تماس باشید.",
    502: "اختلالی در ارتباط با سرور به‌وجود آمده است. لطفاً کمی بعد دوباره امتحان فرمایید.",
    503: "سرویس موقتاً در دسترس نیست. خواهشمندیم دقایقی دیگر مجدداً تلاش نمایید.",
    504: "پاسخ سرور به‌موقع دریافت نشد. لطفاً اتصال اینترنت خود را بررسی کرده و دوباره اقدام کنید.",
  },
  en: {
    400: "We couldn't process your request. Please check your input and try again.",
    401: "You need to log in to access this resource.",
    403: "You don't have permission to access this resource. If you believe this is a mistake, please contact support.",
    404: "We couldn't find what you're looking for. Please check your information or try again.",
    408: "Your connection is slow or lost. Please check your internet connection and try again.",
    409: "There's a conflict with your request. Please refresh the page and try again.",
    422: "The data you entered isn't valid. Please review and correct your information.",
    429: "You've made too many requests. Please wait a moment and try again.",
    500: "We're having trouble on our end. Please try again later. If the problem continues, contact support.",
    502: "There's a problem connecting to the server. Please try again later.",
    503: "The service is temporarily unavailable. Please try again later.",
    504: "The server took too long to respond. Please check your connection and try again.",
  },
};

type _getErrorParams = {
  status: number | null;
  errorName: string;
  locale?: "fa" | "en";
};

export function _getLocalizedErrorMessage({
  status,
  errorName,
  locale = "fa",
}: _getErrorParams): string {
  // Timeout/network error
  if (status === 408 || errorName === "TimeoutError")
    return DEFAULT_MESSAGES[locale].timeout;

  // Abort error
  if (errorName === "AbortError") return DEFAULT_MESSAGES[locale].abort;

  // Status-based message
  const statusMessages = HTTP_STATUS_MESSAGES[locale];

  if (status && statusMessages?.[status]) return statusMessages[status];

  // Fallback
  return DEFAULT_MESSAGES[locale].unknown;
}
