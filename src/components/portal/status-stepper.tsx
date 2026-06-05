import { Check } from "lucide-react";

import { getStatusLabel } from "@/lib/domain/status-machine";
import type { ServiceOrderStatus } from "@/types/database";

export const STATUS_STEP_ORDER: readonly ServiceOrderStatus[] = [
  "received",
  "in_analysis",
  "in_repair",
  "waiting_parts",
  "ready_pickup",
  "delivered",
];

export type StepState = "completed" | "current" | "upcoming";

export const STATUS_DESCRIPTIONS: Record<ServiceOrderStatus, string> = {
  received: "Seu equipamento foi recebido pela assistência.",
  in_analysis: "Nossa equipe está analisando o problema.",
  in_repair: "O reparo do seu equipamento está em andamento.",
  waiting_parts: "Estamos aguardando a chegada de peças necessárias.",
  ready_pickup: "Seu equipamento está pronto para retirada!",
  delivered: "Equipamento entregue. Obrigado pela confiança!",
};

export function getStepState(
  currentStatus: ServiceOrderStatus,
  stepStatus: ServiceOrderStatus
): StepState {
  const currentIndex = STATUS_STEP_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_STEP_ORDER.indexOf(stepStatus);

  if (stepIndex < currentIndex) {
    return "completed";
  }

  if (stepIndex === currentIndex) {
    return "current";
  }

  return "upcoming";
}

type StatusStepperProps = {
  currentStatus: ServiceOrderStatus;
};

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E2E8F0] bg-[#EFF6FF] p-4">
        <p className="text-sm font-medium text-[#2563EB]">
          {getStatusLabel(currentStatus)}
        </p>
        <p className="mt-1 text-sm text-[#64748B]">
          {STATUS_DESCRIPTIONS[currentStatus]}
        </p>
      </div>

      <ol className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-2">
        {STATUS_STEP_ORDER.map((stepStatus, index) => {
          const state = getStepState(currentStatus, stepStatus);
          const isLast = index === STATUS_STEP_ORDER.length - 1;

          return (
            <li
              key={stepStatus}
              className="flex flex-1 items-start gap-3 md:flex-col md:items-center md:text-center"
            >
              <div className="flex flex-col items-center md:w-full">
                <StepIndicator state={state} />
                {!isLast ? (
                  <span
                    className="mt-2 hidden h-px w-full bg-[#E2E8F0] md:block"
                    aria-hidden
                  />
                ) : null}
                {!isLast ? (
                  <span
                    className="ml-3 h-full w-px flex-1 bg-[#E2E8F0] md:hidden"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="pb-2 md:pb-0 md:pt-2">
                <p
                  className={`text-sm font-medium ${
                    state === "current"
                      ? "text-[#2563EB]"
                      : state === "completed"
                        ? "text-[#15803D]"
                        : "text-[#94A3B8]"
                  }`}
                >
                  {getStatusLabel(stepStatus)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepIndicator({ state }: { state: StepState }) {
  if (state === "completed") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
        <Check className="size-3.5" aria-hidden />
        <span className="sr-only">Concluído</span>
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB]">
        <span className="size-2 rounded-full bg-white" aria-hidden />
        <span className="sr-only">Etapa atual</span>
      </span>
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#CBD5E1] bg-white">
      <span className="sr-only">Pendente</span>
    </span>
  );
}
