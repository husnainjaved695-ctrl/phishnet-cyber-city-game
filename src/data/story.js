// Cinematic story panels — 5-panel intro sequence
// Each panel is rendered as a typewriter dialogue box over the game world

export const STORY_PANELS = [
  {
    eyebrow: '⚠ INTERCEPTED TRANSMISSION — 03:14 UTC',
    text: `CCTV LOG: Mega-Corp CFO opened an email. Subject line: "Invoice Due". One click. Within 4 seconds, $4.2 million was wired to ghost accounts in three countries. The city's East Grid flickered. Six hospitals lost power for 11 minutes.\n\nThis is how The Shoal operates. Not with guns. With words.`,
    sound: 'incomingTransmission',
    speaker: 'CCDU ARCHIVE'
  },
  {
    eyebrow: '🎭 THE SHOAL — THREAT PROFILE',
    text: `CCDU Intel designates them THREAT-APEX. A decentralized syndicate of social engineers led by one operator: codenamed PHANTOM.\n\nPHANTOM runs a platform called DEEP HOOK — a phishing factory that generates 10,000 deception emails per hour. Custom. Believable. Lethal.\n\nCurrent active campaigns: 37 cities. Including ours.`,
    sound: 'villainReveal',
    speaker: 'CCDU INTELLIGENCE'
  },
  {
    eyebrow: '📡 DIRECTOR KOVACS — SECURE CHANNEL',
    text: `"Listen up, Rookie. Our AI filters are failing because they can't learn fast enough. PHANTOM upgrades DEEP HOOK every 72 hours. We need human judgment in the loop.\n\n"That's where you come in. You read their emails. You call it — SAFE or PHISHING. Every correct call trains our city-wide defense grid. One bad call costs a citizen everything.\n\n"No pressure. The city's watching."`,
    sound: 'briefing',
    speaker: 'DIRECTOR KOVACS'
  },
  {
    eyebrow: '🔵 ECHO — AI FIELD PARTNER — ONLINE',
    text: `"Hello, Rook. I'm ECHO. I've processed 12.4 million phishing attempts across 61 countries. I see their patterns in milliseconds — but I can't act without you. Regulations.\n\n"Every phishing email has fingerprints: a wrong domain, a fake deadline, a request that breaks protocol. I'll flag what I see. You make the call.\n\n"One rule: trust evidence. Not panic. Ready when you are."`,
    sound: 'echoOnline',
    speaker: 'ECHO // ONLINE'
  },
  {
    eyebrow: '🌍 THREAT BOARD — ACTIVE BREACHES',
    text: `PHANTOM just pushed a new DEEP HOOK campaign. Cities lighting up: London — 847 active lures. Lagos — 1,203 compromised inboxes. Jakarta — power grid targeting in progress. São Paulo — municipal bank under attack.\n\nCyber City is next on the list.\n\nYour mission starts NOW, Agent. The clock is running. Intercept PHANTOM's emails before they reach civilian inboxes. This city does not fall on your watch.`,
    sound: 'alarmPulse',
    speaker: 'ECHO // THREAT BOARD'
  }
]
