import React from "react";
import { getShippingSteps, STATUS } from "../../utils/productStatus";

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function StepCard({ label, state, isLast }) {
  const isDone    = state === "done";
  const isCurrent = state === "current";

  const containerClass = isDone
    ? "bg-green-500/15 border-green-500/30 text-green-400"
    : isCurrent
    ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
    : "bg-surface-raised border-surface-border text-content-muted";

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className={`flex-1 rounded-xl border px-4 py-4 flex items-center gap-3 transition-all duration-300 ${containerClass}`}>
        {/* Icon */}
        <div className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center border ${
          isDone
            ? "bg-green-500/20 border-green-500/40"
            : isCurrent
            ? "bg-amber-500/20 border-amber-500/40"
            : "bg-surface-border/50 border-surface-border"
        }`}>
          {isDone ? (
            <CheckIcon />
          ) : isCurrent ? (
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-surface-border" />
          )}
        </div>

        {/* Label */}
        <div>
          <p className="text-xs font-bold tracking-wide">{label}</p>
          {isCurrent && (
            <p className="text-xs opacity-70 mt-0.5">In progress</p>
          )}
          {isDone && (
            <p className="text-xs opacity-70 mt-0.5">Completed</p>
          )}
        </div>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <svg className="h-4 w-4 text-content-muted flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}

function ShippingProgress({ status }) {
  const steps = getShippingSteps(status);

  return (
    <div className="mt-8">
      <h2 className="text-xs font-semibold text-content-muted uppercase tracking-widest mb-4">
        Shipping Progress
      </h2>

      {status === STATUS.PENDING && (
        <p className="text-sm text-content-muted mb-5 bg-surface-raised rounded-lg px-4 py-3 border border-surface-border">
          No order placed yet. Shipping progress updates after a consumer places an order.
        </p>
      )}

      <div className="flex items-stretch gap-1 flex-wrap sm:flex-nowrap">
        {steps.map((step, index) => (
          <StepCard
            key={step.label}
            label={step.label}
            state={step.state}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default ShippingProgress;
