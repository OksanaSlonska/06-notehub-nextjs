"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  noteId: string;
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({ noteId }) => {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
