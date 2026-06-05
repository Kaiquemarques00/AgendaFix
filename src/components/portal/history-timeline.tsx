import { formatHistoryDateTime } from "@/components/orders/order-list";
import { getStatusLabel } from "@/lib/domain/status-machine";
import type { StatusHistory } from "@/types/database";

export function formatPortalHistoryEvent(entry: StatusHistory): string {
  if (entry.from_status === null) {
    return getStatusLabel(entry.to_status);
  }

  return getStatusLabel(entry.to_status);
}

export function getCurrentHistoryIndex(history: StatusHistory[]): number {
  return history.length > 0 ? history.length - 1 : -1;
}

type HistoryTimelineProps = {
  history: StatusHistory[];
};

export function HistoryTimeline({ history }: HistoryTimelineProps) {
  const currentIndex = getCurrentHistoryIndex(history);

  if (history.length === 0) {
    return (
      <p className="text-sm text-[#64748B]">Nenhuma atualização registrada.</p>
    );
  }

  return (
    <ol className="space-y-4">
      {history.map((entry, index) => {
        const isCurrent = index === currentIndex;

        return (
          <li key={entry.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`size-2.5 rounded-full ${
                  isCurrent ? "bg-[#2563EB]" : "bg-[#15803D]"
                }`}
              />
              {index < history.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-[#E2E8F0]" />
              ) : null}
            </div>
            <div className={`pb-2 ${isCurrent ? "rounded-lg bg-[#EFF6FF] px-3 py-2 -ml-1" : ""}`}>
              <p
                className={`text-sm font-medium ${
                  isCurrent ? "text-[#2563EB]" : "text-[#0F172A]"
                }`}
              >
                {formatPortalHistoryEvent(entry)}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                {formatHistoryDateTime(entry.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
