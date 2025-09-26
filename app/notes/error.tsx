"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  return <p>Could not fetch the list of notes. {error.message}</p>;
}
