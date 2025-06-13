import { zodFetcher } from "@/app/_test/zod-fetch/zodFetcher";
import ky from "ky";
import { z } from "zod/v4";

z.config(z.locales.fa());

const mySchemas = z.string();

async function getTest() {
  return ky
    .get("http://localhost:3000/api/testing", {
      timeout: 2000,
    })
    .json();
}

export default async function Test() {
  const res = await zodFetcher(getTest(), mySchemas);

  return (
    <section className="grid min-h-dvh w-full place-items-center">
      <div className="mx-auto w-full max-w-7xl">
        <pre
          dir="auto"
          className="text-base text-wrap break-words [word-break:break-word] [direction:ltr] [word-wrap:break-word]"
        >
          {JSON.stringify(res, null, 2)}
        </pre>
      </div>
    </section>
  );
}
