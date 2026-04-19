export function normalizeName(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function getDisplayName(value, fallback = "Unknown user") {
  const normalized = normalizeName(value);
  return normalized || fallback;
}

export function getInitials(value, fallback = "VC") {
  const normalized = normalizeName(value);

  if (!normalized) {
    return fallback;
  }

  const initials = normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || fallback;
}
