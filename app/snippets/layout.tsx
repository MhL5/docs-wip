import Aside from "@/app/snippets/_components/Aside";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl gap-5 px-4 md:grid-cols-[14rem_1fr]">
      <Aside />

      <article>{children}</article>
    </div>
  );
}
