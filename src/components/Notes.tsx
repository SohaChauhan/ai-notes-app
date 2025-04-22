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

export default function Notes() {
  const user = useUser();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const summarize = useSummarize();
  const [currentSummary, setCurrentSummary] = useState("");

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", filterLabel, onlyFavorites],
    queryFn: () => getNotes(user!.id, filterLabel, onlyFavorites),
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
    const labelArray = tags.split(",").map((label) => label.trim());
    createMutation.mutate({
      userId: user!.id,
      title,
      content,
      tags: labelArray,
    });
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Notes</h2>

      {/* Input Section */}
      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button onClick={handleSubmit}>Add Note</Button>
      </div>

      {/* Filters */}
      <div className="space-x-2 mt-4">
        <Input
          placeholder="Filter by label..."
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value)}
          className="inline w-auto"
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
          <div key={note.id} className="border rounded p-2 space-y-2">
            <div className="flex justify-between">
              <h3 className="font-semibold">{note.title}</h3>
              <Button
                variant={note.is_favorite ? "secondary" : "outline"}
                onClick={() =>
                  toggleFavoriteMutation.mutate({
                    id: note.id,
                    isFavorite: note.is_favorite,
                  })
                }
              >
                {note.is_favorite ? "Unfavorite" : "Favorite"}
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
                  onSuccess: (summary) => setCurrentSummary(summary),
                })
              }
            >
              Summarize
            </Button>
            {currentSummary && (
              <div className="mt-2 text-sm italic text-gray-600 border-t pt-2">
                <strong>Summary:</strong> {currentSummary}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
