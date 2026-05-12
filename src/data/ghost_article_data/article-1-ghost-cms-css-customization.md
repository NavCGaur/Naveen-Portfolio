# How to Customize CSS in Ghost CMS (Step-by-Step Guide for Beginners)

**Target keywords:** Ghost CMS CSS customization, how to change fonts in Ghost CMS, Ghost CMS design settings, custom CSS Ghost blog, Ghost CMS code injection

---

Ghost CMS gives you a clean, fast blog out of the box — but most site owners want to tweak fonts, colors, or layout to match their brand. The good news: you don't need to be a developer to make most visual changes. Here's exactly how to customize the look of your Ghost site without touching a single theme file.

---

## Two Ways to Add Custom CSS in Ghost

Before diving in, understand that Ghost gives you two main paths for CSS changes:

**1. Code Injection (Easiest)** — Available to everyone, including Ghost Pro users. No theme editing needed. You paste CSS directly into the admin panel and it applies site-wide.

**2. Theme File Editing (Advanced)** — For self-hosted Ghost only. You edit the actual `.css` files inside your theme. More powerful but requires downloading, editing, and re-uploading your theme zip.

For most customizations, **Code Injection is the right starting point.**

---

## How to Access Code Injection in Ghost

1. Log into your Ghost admin dashboard (yourdomain.com/ghost)
2. In the left sidebar, click **Settings**
3. Click **Code injection**
4. You'll see two sections: **Site Header** and **Site Footer**

Use **Site Header** for CSS (wrap your code in `<style>` tags).
Use **Site Footer** for JavaScript.

---

## Common Ghost CSS Customizations

### Change Font for Post Excerpts

If you want the excerpt text (the short preview on your homepage) to use a specific font like Inter or Helvetica:

```html
<style>
  .post-card-excerpt {
    font-family: 'Inter', Helvetica, sans-serif;
  }
</style>
```

To use Google Fonts like Inter, also add this to the **Site Header** *before* your CSS:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

### Change Author Name Color and Size

Want the author name to stand out with a different color?

```html
<style>
  .author-name, .post-card-author, .author-link {
    color: #bf0a30;
    font-size: 16px;
  }
</style>
```

Replace `#bf0a30` with any hex color of your choice.

---

### Left-Align Text on Featured Articles

By default, some Ghost themes center-align featured post titles. To left-align:

```html
<style>
  .featured-article, .post-card-featured {
    text-align: left;
  }
</style>
```

---

### Change the Article Body Font

For a consistent reading experience, set the font for the main post content:

```html
<style>
  .post-content, .article-content {
    font-family: Helvetica, Arial, sans-serif;
  }
</style>
```

---

### Make Post Excerpts Italic on Article Pages

The excerpt shown at the top of an article page can be styled separately:

```html
<style>
  .post .post-excerpt {
    font-style: italic;
  }
</style>
```

---

### Change Footer Background Color

To change your site's footer to a custom background color:

```html
<style>
  .site-footer, footer {
    background-color: #d9cfc3;
  }
</style>
```

---

### Remove Horizontal Lines Around Navigation

Some Ghost themes add decorative lines above and below the navigation bar. To remove them:

```html
<style>
  .site-nav:before,
  .site-nav:after,
  .nav-wrapper:before,
  .nav-wrapper:after {
    display: none;
  }
</style>
```

---

### Set the Maximum Content Width

To control how wide the site content spans across the screen:

```html
<style>
  :root {
    --content-width: 1000px;
  }
</style>
```

Many Ghost themes use CSS variables like `--content-width`, so this single change updates the layout everywhere.

---

## CSS Not Working? Common Fixes

**Styles not applying?** Add `!important` to force them:
```css
.post-card-excerpt {
  font-family: 'Inter', Helvetica !important;
}
```

**Changes not showing up?** Clear your browser cache or test in an incognito window.

**Selector not matching?** Right-click on the element you want to style → click "Inspect" → find the actual CSS class name your theme uses. Different Ghost themes use different class names.

---

## What You Can Customize Without Editing Theme Files

Here's a quick summary of what's possible via Code Injection alone:

| What you want to change | Possible via Code Injection? |
|---|---|
| Fonts (body, headings, excerpts) | ✅ Yes |
| Colors (text, backgrounds, links) | ✅ Yes |
| Spacing and padding | ✅ Yes |
| Content width | ✅ Yes (if theme uses CSS variables) |
| Navigation styles | ✅ Yes |
| Footer background | ✅ Yes |
| Full sidebar layout | ❌ Needs theme file editing |
| Related posts section | ❌ Needs theme file editing |

For the advanced customizations — like adding a sidebar or custom author box — check out the next article in this series.

---

## Summary

Ghost's Code Injection feature makes it surprisingly easy to customize your site's look without touching theme files. Wrap your CSS in `<style>` tags, paste it into **Settings → Code injection → Site Header**, and save. Most visual changes like fonts, colors, and spacing can be done this way in under five minutes.

If you find that your selectors aren't matching, use your browser's Inspect tool to find the exact class names your specific theme uses, and adjust accordingly.

---

*Related: [How to Add a Custom Author Box in Ghost CMS](#) | [Ghost CMS VPS Setup: Complete Guide](#)*
