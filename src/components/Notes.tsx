"use client";

import { useUser } from "@/hooks/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  toggleFavorite,
} from "@/lib/notesService";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EditNoteModal from "./EditNoteModal";
import { useSummarize } from "@/lib/useSummarize";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, HeartOff } from "lucide-react";

export default function Notes() {
  const user = useUser();
  const queryClient = useQueryClient();
  const [addNote, setAddNote] = useState(false);
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("Content");
  const [tags, setTags] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const summarize = useSummarize();
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", filterTag, onlyFavorites],
    queryFn: () => getNotes(user!.id, filterTag, onlyFavorites),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleSubmit = () => {
    const tagArray = tags.split(",").map((tag) => tag.trim());
    createMutation.mutate({
      userId: user!.id,
      title,
      content,
      tags: tagArray,
    });
    setTitle("");
    setContent("");
    setTags("");
    setAddNote(false);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <Dialog open={addNote} onOpenChange={setAddNote}>
        <DialogTrigger asChild>
          <Button variant="default">Add a new Note</Button>
        </DialogTrigger>
        <DialogContent className="space-y-0.5">
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button onClick={handleSubmit}>Save</Button>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="space-x-2 mt-4">
        <Input
          placeholder="Filter by tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="inline w-auto bg-background"
        />
        <Button
          variant="outline"
          onClick={() => setOnlyFavorites(!onlyFavorites)}
        >
          {onlyFavorites ? "Show All" : "Show Favorites"}
        </Button>
      </div>

      {/* Notes */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        notes?.map((note) => (
          <div
            key={note.id}
            className="border rounded-xl p-5 space-y-2 bg-accent"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">
                {note.title}
                <p className="text-sm flex gap-1 font-normal">
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>{" "}
                  |{" "}
                  <span>{new Date(note.created_at).toLocaleTimeString()}</span>
                </p>
              </h3>
              <Button
                variant={note.is_favorite ? "destructive" : "default"}
                onClick={() =>
                  toggleFavoriteMutation.mutate({
                    id: note.id,
                    isFavorite: note.is_favorite,
                  })
                }
              >
                {note.is_favorite ? <HeartOff /> : <Heart />}
              </Button>
            </div>

            <p>{note.content}</p>
            {note.tags?.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Tags:</strong> {note.tags.join(", ")}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(note.id)}
              >
                Delete
              </Button>
              <EditNoteModal
                note={note}
                onSave={(updatedNote) =>
                  updateMutation.mutate({
                    id: updatedNote.id,
                    title: updatedNote.title,
                    content: updatedNote.content,
                    tags: updatedNote.tags,
                  })
                }
              />
            </div>
            <Button
              onClick={() =>
                summarize.mutate(note.content, {
                  onSuccess: (summary) =>
                    setSummaries((prev) => ({
                      ...prev,
                      [note.id]: summary,
                    })),
                })
              }
            >
              Summarize
            </Button>
            {summaries[note.id] && (
              <div className="mt-2 text-sm italic text-gray-600 border-t pt-2">
                <strong>Summary:</strong> {summaries[note.id]}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
