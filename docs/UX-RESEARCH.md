# FEE Comment Assistant: benchmark and UX/UI research

Date: 2026-11-26. Purpose: decide how to redesign the review screen so a new intern can use it without training.

How to read this: findings marked **Sourced** come from the pages linked at the bottom. Findings marked **My recommendation** are design judgment applied to our case. Contrast numbers were computed by me with the WCAG formula.

Limits of the research: most competitor material is vendor documentation and marketing, not independent usability studies. I found no official design documents for Front or Linear, and nothing on how Statusbrew's inbox looks in practice. Superhuman's speed claims are marketing and unverified.

---

## 1. Benchmark: what comparable tools do

| Tool | What it does that matters to us | Source |
|---|---|---|
| Sprout Social (Smart Inbox) | One inbox for comments, mentions and DMs. Saved replies, internal tags, "cases" that assign a message to a person, bulk "mark complete", hide comments with an undo banner. | Sprout support pages |
| Agorapulse (Inbox) | Rules that triage, label, hide or assign incoming items automatically. Pressing Send marks the item reviewed and checks it off the to-do list. Filters by label and by action taken. | Agorapulse support pages |
| Hootsuite (Inbox 2.0) | AI "Smart Replies" for comments, backed by a store of approved FAQs and policies. Option to delay and vary Instagram comment replies. Redesign added a unified toolbar, a simpler resolve button, and clear labels for public vs private messages. | Hootsuite "what's new" pages |
| ManyChat / Meta Business Suite | Keyword triggers on a chosen post. Match modes: contains, full word, begins with. Reported limits: first comment per person only; large Reels can back up; keyword-only comments sometimes get hidden by Meta. | ManyChat help, Planoly, SocialPilot |
| Front, Linear | List on the left, selected item on the right, so you can act without losing the queue. | Front blog, Linear changelog, SaaSUI |
| Superhuman | Single-key triage (E done, R reply), J/K to move, command palette. | Superhuman help |

### Patterns every serious tool shares
1. A queue on one side and the selected item on the other.
2. A visible state for each item (new, done, assigned).
3. Reusable or suggested replies.
4. A way to hide or ignore junk.
5. Bulk actions.

### Where we can be better (I did not find these combined in any source)
- **Per-post CTA sending driven by the caption.** Keyword tools make you configure a trigger before the post goes live. Ours reads the keyword from the caption and replies to everyone who already commented, for the last 5 posts.
- **A single approve-and-post flow for AI drafts**, with the post context beside the button.
- **Two accounts with a loud, unmistakable "which account am I on" signal.**

---

## 2. UX principles that apply

### Layout and flow
- **Queue + detail pane (Sourced).** Rows should carry only the fields needed to triage. The selected item should not jump when new items arrive. Front and Linear both use this layout. *We already use it.*
- **After an action, move to the next item (Sourced: Agorapulse, Superhuman).** We already do this.
- **Progressive disclosure and fewer choices (Sourced, secondary).** Show what is needed now, hide the rest. Our "longer version" link is an example.
- **Fitts's law (Sourced: NN/g).** Bigger and closer targets are faster to hit. Keep the main button large and next to the text it acts on.

### One main action
- **One primary action per screen (Sourced, secondary).** Separate primary from secondary with color, size and placement.
  **My recommendation:** "Approve and post" is the only filled button on the review panel. Skip, Redraft and the longer-version link stay quiet.

### Safety when AI writes and a human approves
- **Make accept, edit, undo and override easy; scale review support to the stakes (Sourced, secondary summary of human-AI guidelines).**
- **Show source context beside the confirm control, and make "Approve" say exactly what it does (Sourced: Vercel guide).**
  **My recommendation:** the button reads "Approve and post as @feeonline", with the account in the account's own color. With two accounts, posting from the wrong one is the biggest mistake to design out.
- **Prefer undo to confirmation for reversible actions; confirm with specifics for severe or irreversible ones; do not confirm routine actions (Sourced: NN/g, plus secondary sources).**
  **My recommendation:**
  - Single reply: no dialog. Show a 10-second "Posting... Undo" bar before the reply is actually sent.
  - CTA bulk send: keep a confirmation that names the post, the keyword, the number of people and a sample of the reply (NN/g praises confirmations that name the list and the count).

### Speed for people who do this daily
- **Keyboard shortcuts and a command palette speed up triage (Sourced: Superhuman, FlowMail).** Vendor speed numbers are unverified, so treat them as direction only.
  **My recommendation:** J/K for next and previous, S to skip, Ctrl/Cmd+Enter to approve. Do not use a bare single key for approve, because posting is live.

### Pace, spam filters and honesty about volume
- **Repeated identical replies can trigger Instagram's spam filters. Vendors advise varied wording and human-plausible volume (Sourced: vendor help pages; no official Meta threshold found).** Rate-limit figures in vendor sources conflict, so check Meta's documentation before choosing numbers.
  **My recommendation:** the CTA screen shows an estimated send time, a progress bar, and a result summary (sent, failed, retried). Rotate reply wording only because the variations are real, not to disguise a bot.

---

## 3. Color and contrast with the FEE palette

Colors stay as FEE specifies. What changes is how we use shades and tints of them.

### What passes and what fails (computed)

| Pairing | Ratio | Verdict |
|---|---|---|
| Navy on white | 9.32 | Passes |
| Navy on Newsprint | 8.38 | Passes |
| Navy on Monumental Slate | 6.42 | Passes |
| White on Vintage Sunrise (our button now) | 3.14 | **Fails for normal text** (needs 4.5; passes only for large text) |
| Navy on Vintage Sunrise | 2.97 | **Fails** |
| Navy on Ticonderoga | 5.01 | Passes |
| Slate panel border on white | 1.45 | Fine as decoration, too faint for controls |
| Navy at 70% opacity (our "muted" text now) | 4.19 | **Fails** |

Our current orange buttons use 13px text, which counts as normal text, so they fail.

### Proposed shades (all derived from the brand colors)

| Use | Value | Check |
|---|---|---|
| Primary button fill (20% darker Vintage Sunrise) | `#C15227` | White text 4.66, passes |
| Primary button hover | `#A94722` | White text 5.81 |
| Brand orange `#F16631` | unchanged | Keep for large accents, rules, counts, highlights |
| Muted text (80% navy) | `#4D68A7` | 5.45 on white, 4.90 on Newsprint |
| Control borders (60% navy) | `#7A8EBD` | 3.27 on white, meets the 3:1 UI rule |
| Surface tints for grouping | `#E9ECF4`, `#DEE3EE`, `#D3D9E9` | Navy text 7.89, 7.25, 6.60 |

The brand guidelines allow white or navy text on Vintage Sunrise at large sizes only, so the darker orange for the button is a departure worth showing to whoever owns the brand.

### Account color-coding (My recommendation)
- @feeonline: navy header chip. @feeenlinea: Monumental Slate header chip with navy text. Both show the handle in text so color is never the only signal.

---

## 4. Proposed redesign

1. **Two modes at the top: "Replies" and "CTA sends".** One-by-one reviewing and batch sending are different jobs. Splitting them shortens the left column and removes choices (Hick). The account switcher stays global and always visible.
2. **Review panel order:** comment (largest) → post context in one line + "View post" → reply box → one filled button → quiet secondary actions. Account chip sits beside the button.
3. **Redraft as one-tap chips** (Shorter, Warmer, More formal, Custom) instead of an empty text field. *My recommendation; not from a source.*
4. **Undo bar instead of a dialog** for single replies. Confirmation with specifics for CTA sends.
5. **Group with tints, not borders.** Use Newsprint, white and the navy tints to separate regions. Fewer outlines, one border style, one corner radius (6px).
6. **Fewer ALL-CAPS labels.** Keep caps for small tags only. Sentence-case labels read faster.
7. **Mobile:** list first, tap to open the detail as its own screen with a back arrow, instead of stacking both.
8. **Status and trust signals:** "Connected to Instagram, last checked 2 min ago", clear error and empty states, and a "needs reconnecting" warning when the Meta token expires.
9. **Optional keyboard shortcuts** with a "?" cheat sheet.
10. **CTA card per post:** caption snippet, detected keyword (editable), people waiting, a sample of the reply, estimated time, and a progress bar while sending.

---

## 5. Open decisions
- Does "Passed" mean approved and posted? If so, "Posted" may read clearer.
- Is a 10-second undo window right, and can the team delete a posted reply if someone catches an error later?
- Is the darker orange acceptable for buttons?
- Should the AI keyword detection let a person correct it before a bulk send? (I recommend yes.)

---

## Sources
- Sprout Social support: <https://support.sproutsocial.com/hc/en-us/articles/360000576446-Introduction-to-Engagement>
- Agorapulse: <https://support.agorapulse.com/en/articles/14658483-automated-moderation-best-practices>, <https://support.agorapulse.com/en/articles/9574021-inbox-assistant-explained>
- Hootsuite: <https://www.hootsuite.com/whats-new/boost-inbox-efficiency-with-smart-replies>, <https://www.hootsuite.com/whats-new/uxui-design-updates-in-inbox-20>
- ManyChat: <https://help.manychat.com/hc/en-us/articles/14281316989724>; Planoly: <https://www.planoly.com/blog/free-instagram-comment-to-dm-meta-business-suite>
- Front: <https://front.com/blog/the-new-front-inbox>; Linear: <https://linear.app/changelog/2021-12-02-workspace-templates>; SaaSUI: <https://www.saasui.design/blog/saas-email-inbox-ux-patterns>, <https://www.saasui.design/blog/saas-list-detail-master-detail-ux-patterns>
- Superhuman: <https://help.superhuman.com/hc/en-us/articles/45191759067411-Speed-Up-With-Shortcuts>
- NN/g confirmation dialogs: <https://www.nngroup.com/articles/confirmation-dialog/>; Fitts's law: <https://www.nngroup.com/articles/fitts-law/fitts-law/>
- Human-AI guidance: <https://pair.withgoogle.com/guidebook>, <https://vercel.com/i/human-review-enterprise-ai-decisions>
- Meta Comment Moderation API: <https://developers.facebook.com/docs/instagram-platform/comment-moderation>
- Contrast guidance: <https://design.gitlab.com/accessibility/visual>
