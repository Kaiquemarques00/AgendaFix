/** Remove caracteres não numéricos do telefone. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Últimos 4 dígitos do telefone normalizado. */
export function getPhoneLast4(phone: string): string {
  const digits = normalizePhone(phone);
  return digits.slice(-4);
}

/** Compara últimos 4 dígitos (ignora formatação). */
export function phoneEndsWith(phone: string, last4: string): boolean {
  const normalizedLast4 = normalizePhone(last4);
  if (normalizedLast4.length !== 4) {
    return false;
  }
  return getPhoneLast4(phone) === normalizedLast4;
}
