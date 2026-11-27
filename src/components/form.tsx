"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/validation";

const FieldErrorsContext = createContext<FormState["fieldErrors"]>(undefined);
const PendingContext = createContext(false);

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.success) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      action={formAction}
      // Kirim lewat transition agar React tidak mengosongkan isian form saat validasi gagal.
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className={className ?? "space-y-4"}
      noValidate
    >
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      )}
      <PendingContext.Provider value={isPending}>
        <FieldErrorsContext.Provider value={state.fieldErrors}>{children}</FieldErrorsContext.Provider>
      </PendingContext.Provider>
    </form>
  );
}

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30";

export function Field({
  label,
  name,
  hint,
  textarea,
  ...props
}: {
  label: string;
  name: string;
  hint?: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const errors = useContext(FieldErrorsContext)?.[name];
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={3} className={inputClass} {...props} />
      ) : (
        <input id={id} name={name} className={inputClass} {...props} />
      )}
      {hint && !errors && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {errors?.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-600">
          {e}
        </p>
      ))}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText = "Menyimpan…",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "danger";
}) {
  const formPending = useFormStatus().pending;
  const pending = useContext(PendingContext) || formPending;
  const color =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40"
      : "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/40";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 disabled:opacity-60 ${color}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}

/** Tombol hapus dengan konfirmasi browser. */
export function DeleteButton({ action, label = "Hapus" }: { action: () => Promise<void>; label?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Yakin ingin menghapus data ini?")) e.preventDefault();
      }}
    >
      <SubmitButton variant="danger" pendingText="Menghapus…">
        {label}
      </SubmitButton>
    </form>
  );
}
