export type Project = {
  n: string;
  name: string;
  meta: string;
  title: string;
  lead: string;
  highlight: string;
  facts: string[];
  url: string;
  resume: string;
};

export const projects: Project[] = [
  {
    n: "01",
    name: "jazztun",
    meta: "Go · GPL-3.0",
    title: "A tunnel shaped like a video call",
    lead: "Where classic VPN handshakes get fingerprinted and dropped, {hl} — so jazztun carries TCP through a Salute Jazz room over WebRTC data channels, exposed locally as a plain SOCKS5 proxy.",
    highlight: "browser video still passes",
    facts: ["33–43 Mbit/s single stream", "≈110 Mbit/s across 6 peers", "AES-256-GCM"],
    url: "https://github.com/Kavun-Sama/jazztun",
    resume:
      "TCP tunnel routed through Salute Jazz WebRTC infrastructure, so the transport looks like a browser video session rather than a VPN. Local SOCKS5 proxy, AES-256-GCM frames, credit-based mux flow control, per-stream peer affinity. Measured 33–43 Mbit/s single stream and about 110 Mbit/s aggregate across six peers."
  },
  {
    n: "02",
    name: "shodan-checker",
    meta: "Python · MIT",
    title: "Only the hosts that answer",
    lead: "Shodan sits behind Cloudflare, which reads the TLS handshake before the request. No API key, no headless browser: {hl}, then every host is probed for liveness.",
    highlight: "curl_cffi impersonates a real Chrome fingerprint",
    facts: ["200 concurrent probes", "Adaptive backoff", "JSON + TXT output"],
    url: "https://github.com/Kavun-Sama/shodan-checker",
    resume:
      "Async crawler for Shodan web search: paginates a dork, parses every host, verifies liveness or specific endpoints with 200 concurrent probes, keeps only what answers. Passes Cloudflare through curl_cffi TLS fingerprinting; adaptive rate limiting with exponential backoff."
  },
  {
    n: "03",
    name: "midi2lyre",
    meta: "Python · GPL-3.0",
    title: "Three octaves, and the song survives",
    lead: "The Windsong Lyre has {hl}. Instead of dropping the rest, this player folds notes into range and snaps accidentals to the nearest playable key.",
    highlight: "21 keys — C major, three octaves",
    facts: ["Two-stage key detection", "Drift-free scheduling", "Zero configuration"],
    url: "https://github.com/Kavun-Sama/midi2lyre",
    resume:
      "MIDI player for the Windsong Lyre in Genshin Impact. Two-stage automatic key detection, octave folding and accidental snapping instead of dropped notes, chords pressed as one gesture, drift-free scheduling against a monotonic clock."
  },
  {
    n: "04",
    name: "lucky-try",
    meta: "Astro 5 · MIT",
    title: "A thousand games, prerendered",
    lead: "A browser-games portal rebuilt as static output: {hl}, with URLs mirroring production one-to-one so nothing loses its ranking.",
    highlight: "1,048 prerendered pages in about 3.5 seconds",
    facts: ["16 KB JS per page", "Tailwind 4 tokens", "try.kkkavun.pw"],
    url: "https://github.com/Kavun-Sama/lucky-try-frontend",
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

export const links = {
  telegram: "https://t.me/kkkavun",
  github: "https://github.com/Kavun-Sama",
  live: "https://try.kkkavun.pw"
};
