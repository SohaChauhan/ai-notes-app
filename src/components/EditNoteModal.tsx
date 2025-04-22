"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

export default function EditNoteModal({
  note,
  onSave,
}: {
  note: { id: string; title: string; content: string; tags?: string[] };
  onSave: (updatedNote: {
    id: string;
    title: string;
    content: string;
    tags?: string[];
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags?.join(", ") || "");

  const handleSave = () => {
    const tagArray = tags
      .split(",")
      .map((tags) => tags.trim())
      .filter(Boolean);

    onSave({ id: note.id, title, content, tags: tagArray });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
