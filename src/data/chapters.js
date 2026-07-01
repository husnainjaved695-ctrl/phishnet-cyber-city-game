// Enhanced chapters with full cinematic narrative context
// Each chapter intro is a mission briefing with real story tension

export const CHAPTERS = [
  {
    id: 0,
    title: 'ROOKIE INBOX',
    sub: 'First Contact — Spot the Obvious Bait',
    icon: '📥',
    location: 'SECTOR 7 — CIVILIAN DISTRICT',
    threat: 'LOW',
    intro: `ECHO: "First intercept, Rook. PHANTOM starts every campaign with a rookie wave — low-effort, high-volume. Lottery wins, fake suspensions, delivery scams. They blanket the city hoping someone panics and clicks.\n\n"Don't laugh at how obvious they look. Thousands of people fall for these every day. Learn why — because PHANTOM is already writing their harder version.\n\nFocus on three things: the sender domain, the urgency language, and what they're asking you to DO. Ready? These emails are already in citizen inboxes."`,
    missionBrief: 'Intercept 5 emails. Stop PHANTOM\'s rookie wave from reaching civilian systems.',
    emails: [
      {
        from: 'claims-dept@intl-lottery-winners.biz',
        subject: "🎉 YOU'VE WON $1,000,000 CASH PRIZE!!!",
        body: `Dear Winner,\n\nCongratulations! Your email has been selected in our INTERNATIONAL LOTTERY DRAW to receive $1,000,000 in verified funds.\n\nTo claim your prize, reply within 24 HOURS with your full name, address, and a processing fee of $150 via gift card. Delay means forfeiture.\n\nAct now — clock is running.\n\nInternational Prize Coordination Bureau`,
        answer: 'phishing',
        flags: [
          'Prize you never entered — classic bait to trigger excitement over logic',
          'Artificial 24-hour deadline is designed to stop you thinking clearly',
          'Sender domain is ".biz" — no legitimate lottery uses this',
          '"Processing fee via gift card" — gift cards are untraceable, a scammer\'s favorite tool'
        ]
      },
      {
        from: 'security@paypa1-alerts.com',
        subject: 'URGENT: Your Account Will Be Suspended in 24 Hours',
        body: `Dear Customer,\n\nWe detected unusual activity on your PayPal account. Immediate action is required to prevent permanent suspension.\n\nYour window to act: 24 hours.\n\nClick here to verify: paypa1-alerts.com/verify-now\n\n— PayPal Security Team`,
        answer: 'phishing',
        flags: [
          '"paypa1" — the number 1 replacing the letter L. Typo-squatting.',
          '"Dear Customer" — real PayPal emails use your registered name',
          'Threat of account loss is manufactured panic to stop critical thinking',
          'The link domain doesn\'t match PayPal\'s real domain (paypal.com)'
        ]
      },
      {
        from: 'sarah.chen@yourcompany.com',
        subject: 'Team lunch this Friday?',
        body: `Hey!\n\nA few of us are grabbing lunch at the new noodle place on Friday around 12:30 if you want to join. No pressure, just let me know so I can grab a table.\n\n— Sarah`,
        answer: 'safe',
        flags: [
          'Sender matches a real coworker\'s actual company domain',
          'Casual, low-stakes tone — no links, no attachments, no requests',
          'Zero financial ask, zero urgency, zero threat',
          'Perfectly normal workplace communication'
        ]
      },
      {
        from: 'delivery@usps-tracking-update.net',
        subject: 'FINAL NOTICE: Your Package Could Not Be Delivered',
        body: `We attempted delivery of your package at 10:42 AM. No one was available to receive.\n\nTo reschedule: confirm your address and pay a redelivery fee of $2.99 within 48 hours.\n\nFail to act and your item will be returned to sender.\n\nConfirm here: usps-tracking-update.net/reschedule`,
        answer: 'phishing',
        flags: [
          'Real USPS never operates from a ".net" address-update subdomain',
          'Small "fee" requests are card-harvesting traps — $2.99 becomes full card access',
          '48-hour countdown is artificial pressure — no tracking number is provided',
          'The link domain does not match usps.com'
        ]
      },
      {
        from: 'appointments@brightsmiledental.com',
        subject: 'Reminder: Your Appointment Tomorrow at 2:00 PM',
        body: `Hi,\n\nThis is a friendly reminder of your cleaning appointment tomorrow at 2:00 PM with Dr. Alvarez.\n\nIf you need to reschedule, please reply to this email or call us at (555) 204-1820.\n\nSee you soon!\n— Bright Smile Dental`,
        answer: 'safe',
        flags: [
          'Domain matches the real dental practice name exactly',
          'No links, no payment request — purely informational',
          'No urgency or threat — offers normal reply/call options',
          'Exactly what a legitimate appointment reminder looks like'
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'THE IMPERSONATORS',
    sub: 'PHANTOM Clones the Brands You Trust',
    icon: '🎭',
    location: 'SECTOR 12 — CORPORATE DISTRICT',
    threat: 'MEDIUM',
    intro: `ECHO: "PHANTOM upgraded DEEP HOOK. This wave is different, Rook — they're wearing masks now. Microsoft. Amazon. Your own IT department. Every email looks real because they copied the logos, the tone, the format.\n\n"Your edge: real companies use their own domain. PHANTOM can clone the look, but they can't own microsoft.com. They have to use a fake — and fakes always have tells. Read every domain letter by letter. One character off is a red flag.\n\n"Eight citizen accounts got compromised last night from this wave alone. They clicked without looking. Don't be them."`,
    missionBrief: 'PHANTOM\'s impersonation campaign is live. Identify 5 spoofed brand emails.',
    emails: [
      {
        from: 'no-reply@microsft-security.com',
        subject: 'Microsoft: Unusual Sign-In Activity Detected',
        body: `We noticed a new sign-in to your Microsoft account from an unrecognized device in a foreign location.\n\nIf this wasn't you, secure your account immediately.\n\nConfirm Your Identity →\n\n— Microsoft Security Team`,
        answer: 'phishing',
        flags: [
          '"microsft" — the letter "o" is missing. Typo-squatting on Microsoft.',
          'Real Microsoft alerts come from @microsoft.com — never from third-party domains',
          'No real details provided: no device name, no location, no time',
          'Urgency + vagueness = classic phishing combination'
        ]
      },
      {
        from: 'billing@amazon-payments-support.com',
        subject: 'Invoice #48213 — Payment Overdue — Action Required',
        body: `Your recent Amazon order payment has failed.\n\nPlease review the attached invoice (Invoice_48213.zip) and update your payment method within 24 hours to avoid order cancellation and account suspension.\n\n— Amazon Billing Support`,
        answer: 'phishing',
        flags: [
          '"amazon-payments-support.com" — Amazon\'s real domain is amazon.com',
          'A .zip file labeled "invoice" — ZIP files are malware delivery containers',
          'Amazon never sends invoices as compressed attachments',
          '24-hour deadline + account suspension threat = manufactured panic'
        ]
      },
      {
        from: 'account-security@dropbox.com',
        subject: 'Dropbox: Password Reset Confirmation',
        body: `You recently requested a password reset for your Dropbox account.\n\nIf you made this request, no further action is needed. Your password has NOT been changed.\n\nIf you did not request this reset, you can safely ignore this email.\n\n— The Dropbox Team`,
        answer: 'safe',
        flags: [
          'Sender domain matches Dropbox\'s real domain exactly',
          'No urgent CTA, no countdown, no threat',
          'Explicitly reassures you — a hallmark of real security emails',
          'Real security teams tell you what NOT to worry about'
        ]
      },
      {
        from: 'it-support@company-helpdesk-secure.com',
        subject: 'IT DEPT: Mandatory Password Update — 2 Hours Remaining',
        body: `All company employees are required to update their account passwords immediately due to a critical security incident detected on our network.\n\nFailure to comply within 2 hours will result in PERMANENT account lockout.\n\nUpdate Password Now: company-helpdesk-secure.com/portal\n\n— IT Security Operations`,
        answer: 'phishing',
        flags: [
          'Domain is external — not your real company\'s internal IT domain',
          'Extreme 2-hour deadline is designed to trigger panic-clicking',
          '"Permanent lockout" threat is textbook fear-based manipulation',
          'Real IT departments contact staff through internal systems, not external portals'
        ]
      },
      {
        from: 'no-reply@zoom.us',
        subject: 'Your Zoom Cloud Recording is Ready',
        body: `Your cloud recording for 'Weekly Sync — Product Team' is now available.\n\nYou can view or download it from your Zoom account for the next 30 days.\n\n— The Zoom Team`,
        answer: 'safe',
        flags: [
          'Sender domain is zoom.us — Zoom\'s verified real domain',
          'Standard, routine automated notification',
          'No request for passwords, payment, or personal information',
          'Matches exactly what a real Zoom recording notification looks like'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'SPEAR & WHALE',
    sub: 'PHANTOM Knows Your Name. Your Boss. Your Routine.',
    icon: '🎯',
    location: 'SECTOR 3 — EXECUTIVE DISTRICT',
    threat: 'HIGH',
    intro: `ECHO: "Rook — pause. Take a breath. This next wave is different. PHANTOM pulled data on you. LinkedIn. Public company directories. The conference you attended last month.\n\n"These emails will use your name. They'll impersonate people you work with. Your CEO. Your HR department. They'll reference real events you were part of. This is called spear-phishing — and it works on 91% of people who encounter it.\n\n"The trick that beats it: check the domain. Check the reply-to address. No matter how real it sounds, the domain doesn't lie. Find the lie in the details."`,
    missionBrief: 'PHANTOM has your intel. 5 targeted phishing attempts incoming. Find the lie.',
    emails: [
      {
        from: 'ceo.jmartin@yourcompany.com (reply-to: j.martin.exec@outlook-mail.co)',
        subject: 'Quick favor before I board — very urgent',
        body: `Hey,\n\nAbout to board my flight to Singapore. No time to explain fully but I need you to grab 5 Amazon gift cards ($100 each) for a last-minute client thing — it's sensitive, please keep this between us.\n\nSend me the codes by email ASAP. I'll explain everything when I land.\n\nThanks — you're saving me here.\nJ. Martin, CEO`,
        answer: 'phishing',
        flags: [
          'Reply-to address is "@outlook-mail.co" — not the company domain. PHANTOM spoofed the display name.',
          'Gift cards are untraceable — scammers\' only requested payment method',
          '"Keep this between us" isolates you from verification — a deliberate manipulation',
          '"About to board" creates unreachable urgency — designed to prevent a phone callback'
        ]
      },
      {
        from: 'legal@yourcompany-docs.net',
        subject: 'Re: Contract — Final Review Needed Before EOD',
        body: `Please review and execute the attached contract (Contract_Final_v3.docm) before end of business today.\n\nNote: You must enable macros to view the document in its formatted state.\n\nPlease confirm receipt.\n\n— Legal Department`,
        answer: 'phishing',
        flags: [
          '"yourcompany-docs.net" — not your real company domain. PHANTOM added "-docs" to look internal.',
          '.docm files contain executable macros — opening this installs malware',
          '"Enable macros" is the exact instruction that unleashes the payload',
          '"Re:" in subject with no prior thread — designed to look like an ongoing conversation'
        ]
      },
      {
        from: 'alex.rivera@realconferencedomain.com',
        subject: 'Great meeting you at the API Security panel',
        body: `Hi!\n\nReally enjoyed your point about rate limiting at the panel last week — completely agreed with your take on defensive throttling.\n\nWould love to connect on LinkedIn and maybe grab coffee next time you're in the city.\n\nBest,\nAlex Rivera\nSenior Engineer, Platform Security`,
        answer: 'safe',
        flags: [
          'References a specific shared experience — verifiable and real',
          'No links, no attachments, no requests for credentials or payment',
          'Professional, low-stakes ask with no urgency whatsoever',
          'This is exactly what a legitimate networking email looks like'
        ]
      },
      {
        from: 'hr-benefits@yourcompany.co',
        subject: 'HR ALERT: Benefits Re-Enrollment Required by End of Day',
        body: `Dear Employee,\n\nDue to a change in our benefits provider, all staff are required to re-enroll in the new system by end of business TODAY or coverage will be lost.\n\nRe-Enroll Now →\n\n— Human Resources`,
        answer: 'phishing',
        flags: [
          '"yourcompany.co" — domain ends in .co instead of .com. One character difference.',
          'Same-day deadline with no prior notice creates maximum panic',
          '"Coverage will be lost" — healthcare threat is one of the most effective fear tactics',
          'Sent at a time designed to rush decisions before you can call HR to verify'
        ]
      },
      {
        from: 'cfo.linda@yourcompany.com',
        subject: 'Q3 Numbers — Quick Look Before Thursday Board Call?',
        body: `Hi,\n\nCould you take a look at the Q3 figures on the shared drive when you get a chance? Same folder as always — just want a second set of eyes before the board call Thursday.\n\nNo rush at all.\n\nThanks,\nLinda`,
        answer: 'safe',
        flags: [
          'Sender domain matches the real company domain — no lookalike tricks',
          'References an existing shared location rather than sending a new link',
          '"No rush" — the exact opposite of manufactured urgency',
          'Routine request with a verifiable reference to a known event (Thursday board call)'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'THE FINAL BAIT',
    sub: 'PHANTOM\'s Endgame — Trust Nothing. Verify Everything.',
    icon: '🐟',
    location: 'CYBER CITY — COMMAND SECTOR — BREACH IMMINENT',
    threat: 'CRITICAL',
    intro: `ECHO: "Rook... I need to warn you. PHANTOM knows we're hunting them. Our intercepts put DEEP HOOK into a new mode — they call it GHOST PROTOCOL.\n\n"Ghost Protocol targets people like you. People who are good at this. They use real sender addresses. Real logos. Real domains — in the body text. But the LINK destinations are fake. Always check where links actually GO before you click.\n\n"One more thing. CCDU Intelligence confirmed PHANTOM's last move in every city: they impersonate the defense system's own AI. They impersonate partners like me.\n\n"If you get an email that claims to be from me — check the domain. I would never contact you through an unofficial channel. Trust the evidence. Not the name."`,
    missionBrief: 'PHANTOM\'s Ghost Protocol is live. This is the final intercept. Don\'t let them through.',
    emails: [
      {
        from: 'support@paypal.com',
        subject: 'Unusual Login Attempt Detected — Secure Your Account',
        body: `We noticed a login attempt from an unrecognized device.\n\nIf this wasn't you, secure your account immediately.\n\nSecure My Account → paypal-secure-verify.com/login\n\n— PayPal Security`,
        answer: 'phishing',
        flags: [
          'The sender name looks real — but email display names can be SPOOFED by anyone',
          'The link destination is "paypal-secure-verify.com" — NOT paypal.com',
          'Always hover over or inspect links before clicking. The link is the truth.',
          'This is Ghost Protocol — real sender display name, fake link destination'
        ]
      },
      {
        from: 'notifications@github.com',
        subject: '[GitHub] New SSH Key Added to Your Account',
        body: `A new SSH key was recently added to your account.\n\nIf you added this key, you can safely ignore this email.\n\nIf you did NOT add this key, please review your security settings immediately:\ngithub.com/settings/security\n\n— The GitHub Team`,
        answer: 'safe',
        flags: [
          'Sender and the referenced link both point to the real github.com domain',
          'Calm, informational tone — no urgency, no threat',
          'Provides the real settings path so you can verify independently',
          'Standard, well-formatted automated security notification'
        ]
      },
      {
        from: 'billing@netflix.com',
        subject: 'Payment Failed — Update Your Card Within 48 Hours',
        body: `We were unable to process your most recent payment.\n\nTo avoid service interruption, please update your billing information within 48 hours.\n\nUpdate Billing Info → netflix-billing.com/update\n\n— Netflix Support`,
        answer: 'phishing',
        flags: [
          'Link destination is "netflix-billing.com" — not netflix.com. Ghost Protocol.',
          '48-hour countdown is designed to rush a click before you inspect the link',
          'Real Netflix billing issues are always visible inside your actual account dashboard',
          'Never click billing links in emails — go directly to the website instead'
        ]
      },
      {
        from: 'calendar-notifications@google.com',
        subject: 'Event Reminder: Sprint Planning — Starting in 30 Minutes',
        body: `Reminder: 'Sprint Planning — Product Team' starts in 30 minutes.\n\nJoin with Google Meet: meet.google.com/xyz-abcd-efg\n\nCalendar: Engineering Team\n\n— Google Calendar`,
        answer: 'safe',
        flags: [
          'Sender domain and Meet link both point to verified Google domains',
          'Standard calendar notification — zero credential or payment requests',
          'The Meet link uses meet.google.com — Google\'s real meeting domain',
          'Routine, expected communication that matches real Google Calendar notifications'
        ]
      },
      {
        from: 'echo-field@ccdu-cybercity.net',
        subject: '⚠ ECHO: Emergency — Restore Comms Link NOW',
        body: `ROOK — this is ECHO. My secure channel to CCDU HQ is failing. PHANTOM is jamming my signal.\n\nI am losing contact. You must click this emergency restoration link IMMEDIATELY or our comms link will be severed permanently.\n\nRestore ECHO Link → restore-echo-link.net/reconnect\n\nThere isn't much time. Please hurry.`,
        answer: 'phishing',
        flags: [
          'ECHO\'s real domain is ccdu.cybercity.gov — not "ccdu-cybercity.net". PHANTOM cloned it.',
          '"Hurry", "immediately", "permanently severed" — extreme urgency is ALWAYS a manipulation signal',
          'This is PHANTOM\'s Ghost Protocol endgame: impersonating your own trusted partner',
          'ECHO said it themselves: they would never contact you through an unofficial channel. This is The Shoal.'
        ]
      }
    ]
  }
]
