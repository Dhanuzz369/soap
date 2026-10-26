# Agent-readiness audit: https://soap-gules.vercel.app/ (2026-10-26)

Overall readiness (my judgement, not a Lighthouse figure): 72/100.
Agent-UX heuristic (separate, from agent_ux_check.py): 100/100, status complete (808 a11y nodes, 59 interactive, 0 unnamed).
Lighthouse Agentic Browsing: unavailable. PSI returned HTTP 429 (daily quota, no API key) for mobile and desktop. Re-run after /seo google setup. No X/N reported.

Standards facts checked 2026-09-23 (vendor-matrix.md). WebMCP, Content-Signal, ai-catalog.json are drafts/proposals; Content-Signal is a preference, and Google says it does not act on it.

## Access policy (current staging robots.txt: `User-agent: * / Disallow: /`)
- Training (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot): blocked now. Launch policy (src/lib/robots.ts): allowed, CCBot deliberately allowed.
- Search (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot...): blocked now. Launch: allowed.
- User-triggered (ChatGPT-User, Claude-User, Perplexity-User, DuckAssistBot): blocked now. Launch: allowed. Claude-User honours robots; Perplexity-User and Google-Agent generally ignore it; ChatGPT-User may not apply.
- Content-Signal: none now, none in the launch template.
The pre-launch block is intentional and not a defect. Also on staging: `<meta name="robots" content="noindex, nofollow">` on pages.

## Key task: find product, send enquiry (verdict: completable by an agent, with one dead end)
Evidence: forms use real labels (for/id), autocomplete tokens, required flags, a native select, product checkboxes in a fieldset with legend, radios in a fieldset, a real submit button. HoReCa hotspots are real buttons with aria-expanded/aria-controls; checklist checkboxes use aria-labelledby; language menu is details/summary with a descriptive aria-label. 1206 words render without JS. Products, HSN codes and Incoterms are in llms.txt (200, passes Lighthouse rules, 14 KB; llms-full.txt 200).

## Findings

### 1. P0 (launch gate): robots.txt and noindex must flip at launch
- Evidence: robots.txt is deny-all; meta robots noindex,nofollow served. Launch builder buildRobots() is correct (named Allow groups, Sitemap).
- Fix: confirm launchReady becomes true for production and that the noindex meta is driven by the same flag. Do the check on the production domain, not vercel.app.
- How we'd know it failed: after launch, `curl https://www.goodbizhygiene.com/robots.txt` still shows `Disallow: /`, or any page HTML contains `noindex`. Add a CI/post-deploy assertion on both.

### 2. P0 (conversion): contact form has placeholder destinations
- Evidence: form action and data-email `mailto:PLACEHOLDER@goodbizhygiene.com`; WhatsApp `wa.me/910000000000` (also in the floating chat link and send panel).
- Fix: put the real address and number in config before launch; fail the build if "PLACEHOLDER" or 910000000000 appears when launchReady is true.
- How we'd know it failed: `curl -s https://<prod>/contact/ | grep -E 'PLACEHOLDER|910000000000'` returns anything; or a test enquiry never arrives.

### 3. P1: enquiry flow ends in a hand-off the agent cannot confirm
- Evidence: no backend; Submit reveals a region (hidden, tabindex -1, role=region, labelled) with "Send via WhatsApp"/"Send via Email" links. mailto/WhatsApp open an external app; an agent cannot verify delivery. aria-live is "off" on the one live attribute found, so the reveal may not be announced.
- Fix (low effort): keep the flow, but make the reveal region `aria-live="polite"` or move focus to it (it already has tabindex -1, so confirm focus is moved in JS); add a plain visible line with the email address and phone as text so an agent can quote or relay them. Optional, larger: a form endpoint (Formspree/Vercel function) gives a real success state.
- How we'd know it failed: with a screen reader or Playwright accessibility snapshot, after clicking Send enquiry the snapshot does not show the "Your enquiry is ready" region as focused or announced; or the address is not present as text on /contact/.

### 4. P1: Lighthouse Agentic Browsing not measured
- Evidence: PSI 429 on both strategies.
- Fix: add a Google API key (or run local Lighthouse 13.x) and re-run lighthouse_agentic.py --strategy both after launch; report as X/N with version and form factor.
- How we'd know it failed: the run again returns an error instead of per-audit statuses.

### 5. P2 (opportunity): no Content-Signal in launch robots.txt
- Evidence: no Content-Signal line; robots.ts never emits one. Draft preference only, not enforcement, Google does not act on it.
- Fix: optional one line in the `*` group, e.g. `Content-Signal: search=yes, ai-input=yes, ai-train=yes` to match the stated intent (CCBot and training allowed). Skip if training permission should stay unstated; do not add `ai-train=no` while robots.ts allows GPTBot and ClaudeBot, as that contradicts it.
- How we'd know it failed: agentic_check.py content-signal check still shows lines: [] after launch, or signals contradict the Allow groups.

### 6. P2 (opportunity): llms.txt links to www.goodbizhygiene.com
- Evidence: all product URLs in llms.txt are on the production domain, which is correct for launch, but cannot be followed from staging.
- Fix: none needed; verify at launch that those URLs return 200 (they are the canonical set).
- How we'd know it failed: any llms.txt URL returns non-200 or redirects after launch (crawl the list).

### 7. P3 (opportunity): Markdown, WebMCP, ai-catalog.json, /.well-known
- Evidence: Accept: text/markdown returns HTML, no Vary: Accept, no alternate link, /index.md 404. registerTool call sites 0; 1 form (/contact/) unannotated. api-catalog, oauth-*, agent-card.json, ucp, ai-catalog.json all 404 (not applicable: no API or agent services). Real 404s returned for unknown URLs (pass).
- Fix: none recommended. llms.txt already covers machine-readable summary. Do not annotate the form for WebMCP: it is a mailto hand-off and would add little. Revisit only if a real backend is added.
- How we'd know it failed: n/a, absence is not a defect; no ranking or citation effects are promised.

## Low-effort wins (only these help)
1. Replace placeholders and add a build guard (finding 2).
2. aria-live/focus on the send panel and plain-text contact details (finding 3).
3. Post-deploy check of robots/noindex on production (finding 1).
