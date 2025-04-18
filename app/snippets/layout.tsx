import Aside from "@/app/snippets/_components/Aside";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl gap-5 px-4 lg:grid-cols-[14rem_1fr]">
      <Aside />

      <article className="mb-16 w-full overflow-x-auto">{children}</article>
    </div>
  );
}
