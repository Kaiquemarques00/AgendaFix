"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { addOrderNote } from "@/lib/actions/orders";
import { addNoteSchema } from "@/lib/validations/orders";
import type { OrderNote } from "@/types/database";

import { formatHistoryDateTime } from "./order-list";

export const NOTE_MAX_LENGTH = 500;

export type NoteFormValidation = {
  valid: boolean;
  error?: string;
  remaining: number;
};

export function validateNoteContent(content: string): NoteFormValidation {
  const result = addNoteSchema.safeParse({ content });
  const remaining = NOTE_MAX_LENGTH - content.length;

  if (result.success) {
    return { valid: true, remaining };
  }

  return {
    valid: false,
    error: result.error.issues[0]?.message ?? "Observação inválida",
    remaining,
  };
}

const textareaClassName =
  "flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type NoteFormProps = {
  orderId: string;
  notes: OrderNote[];
};

export function NoteForm({ orderId, notes }: NoteFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = validateNoteContent(content);
  const isOverLimit = content.length > NOTE_MAX_LENGTH;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!validation.valid) {
      setError(validation.error ?? "Observação inválida");
      return;
    }

    setIsSubmitting(true);
    const result = await addOrderNote(orderId, content);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setContent("");
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="note-content" className="text-sm font-medium text-[#0F172A]">
            Nova observação
          </label>
          <textarea
            id="note-content"
            rows={4}
            value={content}
            aria-invalid={isOverLimit || error ? true : undefined}
            className={textareaClassName}
            placeholder="Mensagem visível para o cliente no portal"
            onChange={(event) => {
              setContent(event.target.value);
              if (error) {
                setError(null);
              }
            }}
          />
          <div className="flex items-center justify-between gap-3 text-xs text-[#64748B]">
            <span className={isOverLimit ? "text-destructive" : undefined}>
              {content.length}/{NOTE_MAX_LENGTH}
            </span>
            {error ? (
              <span className="text-destructive" role="alert">
                {error}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim() || isOverLimit}
        >
          {isSubmitting ? "Adicionando…" : "Adicionar observação"}
        </Button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#0F172A]">Observações</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-[#64748B]">Nenhuma observação registrada.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-3"
              >
                <p className="text-sm text-[#0F172A]">{note.content}</p>
                <p className="mt-2 text-xs text-[#64748B]">
                  {formatHistoryDateTime(note.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
