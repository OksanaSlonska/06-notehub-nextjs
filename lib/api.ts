import axios from "axios";
import type { Note } from "@/types/note";

export type { Note };

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string;

const BASE_URL = "https://notehub-public.goit.study/api/notes";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  tag: string;
}

export interface CreateNoteResponse {
  note: Note;
}

export interface DeleteNoteResponse {
  note: Note;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    params: { page, perPage, search },
  });

  return {
    notes: Array.isArray(response.data.notes) ? response.data.notes : [],
    totalPages: response.data.totalPages || 1,
  };
};

export const createNote = async (newNote: CreateNoteDTO): Promise<Note> => {
  const response = await axios.post<CreateNoteResponse>(BASE_URL, newNote, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data.note;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete<DeleteNoteResponse>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};
