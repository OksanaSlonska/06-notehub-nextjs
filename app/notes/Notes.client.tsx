"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import type { FetchNotesResponse, CreateNoteDTO } from "@/lib/api";
import css from "./Notesclient.module.css";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    placeholderData: () => queryClient.getQueryData(["notes", 1, ""]),
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const createNoteMutation = useMutation({
    mutationFn: (note: CreateNoteDTO) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            createMutation={createNoteMutation}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {isLoading && <p>Loading, please wait...</p>}

      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={() =>
            queryClient.invalidateQueries({
              queryKey: ["notes", page, debouncedSearch],
            })
          }
        />
      )}

      <NoteList
        notes={notes}
        onDelete={(id: string) => deleteNoteMutation.mutate(id)}
      />
    </div>
  );
}
