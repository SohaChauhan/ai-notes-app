import { supabase } from "./supabaseClient";

export const getNotes = async (
  userId: string,
  tagFilter = "",
  onlyFavorites = false
) => {
  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (tagFilter) query = query.contains("tags", [tagFilter]);
  if (onlyFavorites) query = query.eq("is_favorite", true);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createNote = async ({
  userId,
  title,
  content,
  tags = [],
}: {
  userId: string;
  title: string;
  content: string;
  tags?: string[];
}) => {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ user_id: userId, title, content, tags }]);
  if (error) throw error;
  return data;
};

export const updateNote = async ({
  id,
  title,
  content,
  tags,
}: {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, tags })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string) => {
  const { data, error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return data;
};

export const toggleFavorite = async (id: string, isFavorite: boolean) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ is_favorite: !isFavorite })
    .eq("id", id);
  if (error) throw error;
  return data;
};
