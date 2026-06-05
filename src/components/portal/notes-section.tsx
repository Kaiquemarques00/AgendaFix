import { formatHistoryDateTime } from "@/components/orders/order-list";
import type { OrderNote } from "@/types/database";

export const NOTES_EMPTY_MESSAGE =
  "Nenhuma mensagem da assistência ainda";

export function sortNotesChronologically(notes: OrderNote[]): OrderNote[] {
  return [...notes].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

type NotesSectionProps = {
  notes: OrderNote[];
};

export function NotesSection({ notes }: NotesSectionProps) {
  const sortedNotes = sortNotesChronologically(notes);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
        Mensagem da assistência
      </h2>
      {sortedNotes.length === 0 ? (
        <p className="text-sm text-[#64748B]">{NOTES_EMPTY_MESSAGE}</p>
      ) : (
        <ul className="space-y-3">
          {sortedNotes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            >
              <p className="break-words text-sm text-[#0F172A]">{note.content}</p>
              <p className="mt-2 text-xs text-[#64748B]">
                {formatHistoryDateTime(note.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
