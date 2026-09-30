/** Shared classes for text-like controls (Input, Textarea, Select). Tokens only. */
export const controlClass =
  'block w-full min-h-11 rounded-md border border-line-strong bg-canvas px-3 py-2 text-base font-light text-fg placeholder:text-fg-muted ' +
  'transition-colors duration-150 hover:border-fg-muted ' +
  'focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'aria-[invalid=true]:border-[var(--color-error)]';

export const labelClass = 'block text-sm font-medium text-fg';
