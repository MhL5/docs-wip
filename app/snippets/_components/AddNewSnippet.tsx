"use client";

import { handleSavingSnippet } from "@/app/snippets/_components/AddNewSnippetAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { snippetsLinks } from "@/constants/snippetsLinks";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function () {
  const categories = snippetsLinks.map(({ title }) => title);

  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories?.[0]);
  const [title, setTitle] = useState("");

  if (process.env.NODE_ENV !== "development") return null;

  async function handleSubmit() {
    await handleSavingSnippet({ title, content, category });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-5">
            <PlusCircle /> Add New Snippet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Snippet</DialogTitle>
            <DialogDescription className="sr-only">
              Add a new snippet to collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>title:</Label>
                <Input
                  type="text"
                  dir="auto"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <Select
                onValueChange={(value) => {
                  setCategory(value);
                }}
                defaultValue={category}
              >
                <div className="flex flex-col gap-2">
                  <Label className="">Category:</Label>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={category} />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {categories.map((category) => {
                    return (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="grid gap-2">
                <Label>Content:</Label>
                <textarea
                  className="h-40 rounded-md border p-1"
                  dir="auto"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
