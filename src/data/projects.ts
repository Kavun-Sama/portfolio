export type Fact = {
  value: string;
  unit?: string;
  label: string;
};

export type Project = {
  n: string;
  slug: string;
  name: string;
  /** Category, taken from the Work section lead. */
  kind: string;
  stack: string;
  license: string;
  title: string;
  /** Contains a `{hl}` placeholder that is replaced with `highlight`. */
  lead: string;
  highlight: string;
  facts: Fact[];
  url: string;
  live?: { label: string; url: string };
  resume: string;
};

export const projects: Project[] = [
  {
    n: "01",
    slug: "jazztun",
    name: "jazztun",
    kind: "Networking",
    stack: "Go",
    license: "GPL-3.0",
    title: "A tunnel shaped like a video call",
    lead: "Where classic VPN handshakes get fingerprinted and dropped, {hl} — so jazztun carries TCP through a Salute Jazz room over WebRTC data channels, exposed locally as a plain SOCKS5 proxy.",
    highlight: "browser video still passes",
    facts: [
      { value: "33–43", unit: "Mbit/s", label: "single stream" },
      { value: "≈110", unit: "Mbit/s", label: "across 6 peers" },
      { value: "AES-256-GCM", label: "frame encryption" }
    ],
    url: "https://github.com/Kavun-Sama/jazztun",
    resume:
      "TCP tunnel routed through Salute Jazz WebRTC infrastructure, so the transport looks like a browser video session rather than a VPN. Local SOCKS5 proxy, AES-256-GCM frames, credit-based mux flow control, per-stream peer affinity. Measured 33–43 Mbit/s single stream and about 110 Mbit/s aggregate across six peers."
  },
  {
    n: "02",
    slug: "shodan-checker",
    name: "shodan-checker",
    kind: "Crawling",
    stack: "Python",
    license: "MIT",
    title: "Only the hosts that answer",
    lead: "Shodan sits behind Cloudflare, which reads the TLS handshake before the request. No API key, no headless browser: {hl}, then every host is probed for liveness.",
    highlight: "curl_cffi impersonates a real Chrome fingerprint",
    facts: [
      { value: "200", label: "concurrent probes" },
      { value: "Adaptive", label: "backoff" },
      { value: "JSON + TXT", label: "output" }
    ],
    url: "https://github.com/Kavun-Sama/shodan-checker",
    resume:
      "Async crawler for Shodan web search: paginates a dork, parses every host, verifies liveness or specific endpoints with 200 concurrent probes, keeps only what answers. Passes Cloudflare through curl_cffi TLS fingerprinting; adaptive rate limiting with exponential backoff."
  },
  {
    n: "03",
    slug: "midi2lyre",
    name: "midi2lyre",
    kind: "Audio tooling",
    stack: "Python",
    license: "GPL-3.0",
    title: "Three octaves, and the song survives",
    lead: "The Windsong Lyre has {hl}. Instead of dropping the rest, this player folds notes into range and snaps accidentals to the nearest playable key.",
    highlight: "21 keys — C major, three octaves",
    facts: [
      { value: "Two-stage", label: "key detection" },
      { value: "Drift-free", label: "scheduling" },
      { value: "Zero", label: "configuration" }
    ],
    url: "https://github.com/Kavun-Sama/midi2lyre",
    resume:
      "MIDI player for the Windsong Lyre in Genshin Impact. Two-stage automatic key detection, octave folding and accidental snapping instead of dropped notes, chords pressed as one gesture, drift-free scheduling against a monotonic clock."
  },
  {
    n: "04",
    slug: "lucky-try",
    name: "lucky-try",
    kind: "Static frontend",
    stack: "Astro 5",
    license: "MIT",
    title: "A thousand games, prerendered",
    lead: "A browser-games portal rebuilt as static output: {hl}, with URLs mirroring production one-to-one so nothing loses its ranking.",
    highlight: "1,048 prerendered pages in about 3.5 seconds",
    facts: [
      { value: "16", unit: "KB", label: "JS per page" },
      { value: "Tailwind 4", label: "tokens" },
      { value: "try.kkkavun.pw", label: "live site" }
    ],
    url: "https://github.com/Kavun-Sama/lucky-try-frontend",
    live: { label: "try.kkkavun.pw", url: "https://try.kkkavun.pw" },
    resume:
      "Redesigned static frontend for a browser-games portal: 1,048 prerendered pages, about 16 KB of JavaScript on interior pages, full build in roughly 3.5 seconds. Design-token layer over Tailwind, motion isolated to one island behind reduced motion."
  }
];

export type Skill = { title: string; body: string; core: boolean };

export const skills: Skill[] = [
  {
    title: "Reverse engineering & security",
    body: "APK and mobile apps (Unity, IL2CPP, native libraries), MITM, protocol analysis, stripping obfuscation and metadata encryption, Ghidra, IDA.",
    core: true
  },
  {
    title: "Backend, infra, DevSecOps",
    body: "Daemons and services in Python and Go. FastAPI, aiohttp, Flask, gRPC. PostgreSQL, SQLite, MongoDB. systemd, Docker, Kubernetes, CI/CD, Terraform, Ansible. Redis, Kafka, RabbitMQ. Nginx, Caddy, Prometheus, Grafana. JWT and OAuth2, WebSocket and SSE, tunnels and P2P over WebRTC data channels.",
    core: true
  },
  {
    title: "Automation & data",
    body: "Scraping and automation of anything, anti-bot and Cloudflare bypass, TLS and JA3 fingerprinting, full stealth when the task calls for it.",
    core: true
  },
  {
    title: "Bots & LLM integrations",
    body: "Telegram bots of any complexity with mini apps, Claude and OpenAI APIs, AWS Bedrock.",
    core: true
  },
  {
    title: "Frontend",
    body: "Next.js, React, Vue, TypeScript, Tailwind CSS, Telegram Mini Apps SDK, Vite, shadcn/ui, Electron and Tauri.",
    core: false
  },
  { title: "Game dev", body: "C# and Unity.", core: false }
];

export const languages: Array<{ name: string; core: boolean }> = [
  { name: "Python", core: true },
  { name: "Rust", core: true },
  { name: "Go", core: true },
  { name: "JS / TS", core: true },
  { name: "C#", core: false }
];

export const practice: string[] = [
  "Documentation lives in the repository — every project ships a README someone can follow.",
  "CI on every push, tagged releases with checksums, containers wherever a server is involved.",
  "Measured claims only: throughput numbers, page counts and build times come from real runs.",
  "Small surface: no configuration where a default can be inferred, no JavaScript where HTML is enough."
];

export const links = {
  telegram: "https://t.me/kkkavun",
  github: "https://github.com/Kavun-Sama",
  live: "https://try.kkkavun.pw"
};

export const factText = (fact: Fact): string =>
  [fact.value, fact.unit, fact.label].filter(Boolean).join(" ");

export const metaText = (project: Project): string => `${project.stack} · ${project.license}`;
