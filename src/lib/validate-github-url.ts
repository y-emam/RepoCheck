export type ParsedGithubUrl =
  | { valid: true; owner: string; repo: string }
  | { valid: false; error: string };

const SEGMENT = /^[A-Za-z0-9._-]+$/;
const RESERVED_OWNERS = new Set([
  "settings",
  "marketplace",
  "explore",
  "topics",
  "trending",
  "collections",
  "events",
  "sponsors",
  "notifications",
  "new",
  "login",
  "join",
  "pricing",
  "features",
  "about",
]);

function stripGitSuffix(repo: string): string {
  return repo.endsWith(".git") ? repo.slice(0, -4) : repo;
}

function validateSegments(
  owner: string,
  repo: string
): ParsedGithubUrl {
  if (!owner || !repo) {
    return { valid: false, error: "Missing owner or repository name" };
  }
  if (!SEGMENT.test(owner)) {
    return { valid: false, error: "Invalid owner name" };
  }
  if (!SEGMENT.test(repo)) {
    return { valid: false, error: "Invalid repository name" };
  }
  if (RESERVED_OWNERS.has(owner.toLowerCase())) {
    return { valid: false, error: "That is a reserved GitHub path, not a repository" };
  }
  return { valid: true, owner, repo };
}

export function parseGithubUrl(input: string): ParsedGithubUrl {
  if (typeof input !== "string") {
    return { valid: false, error: "URL must be a string" };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "URL is required" };
  }

  if (!trimmed.includes("://") && !trimmed.startsWith("//")) {
    const cleaned = trimmed.replace(/^\/+|\/+$/g, "");
    const parts = cleaned.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return validateSegments(parts[0], stripGitSuffix(parts[1]));
    }
    return { valid: false, error: "Expected format: owner/repository" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Not a valid URL" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { valid: false, error: "URL must use http or https" };
  }

  const host = parsed.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") {
    return { valid: false, error: "URL must be on github.com" };
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return { valid: false, error: "URL must include both owner and repository" };
  }

  const [owner, repoSegment] = segments;
  if (!owner || !repoSegment) {
    return { valid: false, error: "URL must include both owner and repository" };
  }

  return validateSegments(owner, stripGitSuffix(repoSegment));
}
