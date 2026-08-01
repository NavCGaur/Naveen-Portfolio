# Patch for AnalyticsDashboard.tsx

Apply these changes to wire up the new VisitorJourney click-through.
Three small edits, all additive — nothing existing is removed except
where noted.

---

## 1. Imports — add these two lines near the top, with the other imports

```tsx
import VisitorJourney from "./VisitorJourney";
import { normalizePages } from "./types";
```

---

## 2. Component state — add inside AnalyticsDashboard(), alongside the
##    other useState calls (e.g. right after `const [isLive, ...]` block)

```tsx
const [selectedSession, setSelectedSession] = useState<VisitorSession | null>(null);
```

---

## 3. Visitors tab table row — make the row clickable and normalize pages

FIND this block (inside `{activeTab === "Visitors" && (...)}`, in the
`<tbody>`):

```tsx
{(data.sessions as VisitorSession[]).map((s, i) => (
  <motion.tr
    key={`${s.ip}-${i}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: i * 0.025 }}
  >
```

REPLACE with (adds onClick + cursor + hover affordance, nothing else changes):

```tsx
{(data.sessions as VisitorSession[]).map((s, i) => (
  <motion.tr
    key={`${s.ip}-${i}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: i * 0.025 }}
    onClick={() => setSelectedSession(s)}
    style={{ cursor: "pointer" }}
    className="dash-visitor-row"
  >
```

---

FIND the pages cell inside the same row:

```tsx
<td>
  <div className="dash-pages-list">
    {s.pages.slice(0, 3).map((p, pi) => (
      <span key={pi} className="dash-page-chip" title={p}>{p.length > 28 ? p.slice(0, 28) + '…' : p}</span>
    ))}
    {s.pages.length > 3 && (
      <span className="dash-page-chip dash-page-chip-more">+{s.pages.length - 3}</span>
    )}
  </div>
</td>
```

REPLACE with (uses normalizePages so this works whether `pages` is the
old string[] shape or the new PageVisit[] shape — `.path` instead of
the raw string):

```tsx
<td>
  <div className="dash-pages-list">
    {normalizePages(s.pages).slice(0, 3).map((p, pi) => (
      <span key={pi} className="dash-page-chip" title={p.path}>
        {p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path}
      </span>
    ))}
    {normalizePages(s.pages).length > 3 && (
      <span className="dash-page-chip dash-page-chip-more">+{normalizePages(s.pages).length - 3}</span>
    )}
  </div>
</td>
```

---

## 4. Render the modal — add this right before the closing `</div>` of
##    `dash-root` (i.e. just above the `<footer>` or just after it,
##    either works since it's a fixed-position overlay)

```tsx
{selectedSession && (
  <VisitorJourney
    session={selectedSession}
    onClose={() => setSelectedSession(null)}
  />
)}
```

---

## 5. Optional CSS — add a hover affordance for the now-clickable rows.
##    Add this inside the `dashStyles` template string, anywhere with
##    the other `.dash-table` rules:

```css
.dash-visitor-row:hover td {
  background: rgba(255,0,122,0.04) !important;
}
```

---

That's the entire integration. VisitorJourney.tsx and the updated
types.ts are self-contained — no other files need to change.
