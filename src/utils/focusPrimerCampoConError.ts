const SELECTOR_CAMPOS_INVALIDOS =
  'input.is-invalid, textarea.is-invalid, select.is-invalid';

export function focusPrimerCampoConError(container?: ParentNode | null) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const root = container ?? document;
      const campo = root.querySelector<HTMLElement>(SELECTOR_CAMPOS_INVALIDOS);
      if (!campo) return;

      campo.focus({ preventScroll: false });
      campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
