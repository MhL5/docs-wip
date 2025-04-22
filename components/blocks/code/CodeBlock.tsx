import CopyButton from "@/components/blocks/buttons/CopyButton";
import Code from "@/components/blocks/code/Code";

export default function CodeBlock({
  data,
  name,
}: {
  data: string;
  name: string;
}) {
  return (
    <div className="bg-code-background relative overflow-y-hidden rounded-lg transition-all duration-500 ease-linear">
      <div className="bg-code-top-bar-background flex min-h-14 w-full items-center justify-between gap-2 p-4 text-white">
        <h2 className="font-mono text-lg font-medium">{name}</h2>
        <CopyButton content={data} />
      </div>
      <div className="p-4">
        <Code lang="tsx">{data}</Code>
      </div>
    </div>
  );
}
