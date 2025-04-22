"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export default function CopyButton({
  content,
  ...props
}: { content: string } & ButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Button
      className="border"
      variant="outline"
      size="xs"
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? (
        <CheckIcon className="h-3 w-3 stroke-green-500" />
      ) : (
        <CopyIcon className="stroke-foreground h-3 w-3" />
      )}
    </Button>
  );
}
