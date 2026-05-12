# How to Add a Custom Author Box and "Latest Articles" Sidebar in Ghost CMS

**Target keywords:** Ghost CMS custom author box, Ghost CMS sidebar latest articles, Ghost post template customization, Ghost CMS author bio section, add sidebar Ghost blog

---

One of the most common requests for Ghost sites is adding two features that are missing from most default themes: a custom **author bio box** at the bottom of every article, and a **"Latest Articles" sidebar** on the right side of post pages. Here's how to implement both — with options for beginners (Code Injection) and developers (theme file editing).

---

## Option A: Using Code Injection (No Theme Editing Required)

This approach works on Ghost Pro and self-hosted Ghost. It uses JavaScript to inject elements into your post pages after they load.

### Step 1: Add the Author Box via Post Footer

Go to **Settings → Code injection → Site Footer** and paste this code:

```html
<div id="custom-author-box-template" style="display:none;">
  <div class="custom-author-box">
    <div class="author-image">
      <!-- Author image injected by JS -->
    </div>
    <div class="author-info">
      <p class="published-label">Published by:</p>
      <h3 class="author-name"></h3>
      <p class="author-bio"></p>
    </div>
  </div>
</div>

<style>
  .custom-author-box {
    display: flex;
    gap: 1.5rem;
    margin: 50px 0;
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #bf0a30;
  }

  .custom-author-box .author-image img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .custom-author-box .author-name {
    margin: 0 0 8px;
    color: #bf0a30;
    font-size: 1.2rem;
  }

  .custom-author-box .published-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
    margin: 0 0 4px;
  }

  .custom-author-box .author-bio {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
  }
</style>
```

---

### Step 2: Add the Latest Articles Sidebar

In the same **Site Footer** code injection area, add this JavaScript below the HTML above:

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Only run on single post pages
  if (!document.body.classList.contains('post-template')) return;

  const postContent = document.querySelector('.post-full-content') || document.querySelector('.post-content');
  if (!postContent) return;

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'content-sidebar-wrapper';
  postContent.parentNode.insertBefore(wrapper, postContent);
  wrapper.appendChild(postContent);

  // Create sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'latest-articles-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-box">
      <h2 class="sidebar-title">Latest Articles</h2>
      <div id="sidebar-posts">Loading...</div>
    </div>
  `;
  wrapper.appendChild(sidebar);

  // Fetch posts via Ghost Content API
  // Replace YOUR_CONTENT_API_KEY with your key from Settings > Integrations
  fetch('/ghost/api/content/posts/?key=YOUR_CONTENT_API_KEY&limit=5&fields=title,url,feature_image,published_at')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('sidebar-posts');
      container.innerHTML = data.posts.map(post => `
        <div class="sidebar-post-item">
          ${post.feature_image ? `<img src="${post.feature_image}" alt="${post.title}">` : ''}
          <h4><a href="${post.url}">${post.title}</a></h4>
          <span>${new Date(post.published_at).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
        </div>
      `).join('');
    })
    .catch(() => {
      document.getElementById('sidebar-posts').innerHTML = '<p>Could not load articles.</p>';
    });
});
</script>

<style>
  .content-sidebar-wrapper {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .post-full-content, .post-content {
    flex: 1;
    min-width: 0;
  }

  .latest-articles-sidebar {
    width: 280px;
    flex-shrink: 0;
  }

  .sidebar-box {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    position: sticky;
    top: 2rem;
  }

  .sidebar-title {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 2px solid #bf0a30;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }

  .sidebar-post-item {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }

  .sidebar-post-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .sidebar-post-item img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .sidebar-post-item h4 {
    margin: 0 0 4px;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .sidebar-post-item a {
    text-decoration: none;
    color: inherit;
  }

  .sidebar-post-item span {
    font-size: 0.75rem;
    color: #888;
  }

  @media (max-width: 900px) {
    .content-sidebar-wrapper {
      flex-direction: column;
    }
    .latest-articles-sidebar {
      width: 100%;
    }
  }
</style>
```

> **Where to find your Content API Key:** Go to Settings → Integrations → Add custom integration. Copy the Content API Key and replace `YOUR_CONTENT_API_KEY` in the code above.

---

## Option B: Adding the Author Box via Theme Files

This is the cleaner, more reliable method for developers with self-hosted Ghost. It uses Ghost's native Handlebars templating and pulls author data automatically.

### Step 1: Open Your Theme

Download your active theme from **Settings → Design → Customize → Download** (or access theme files via SSH on self-hosted).

### Step 2: Edit `post.hbs`

Find the file `post.hbs` in your theme root. Inside the `{{#post}}` block, after the `{{ content }}` tag, add:

```handlebars
<div class="custom-author-box">
  <div class="author-image">
    {{#if primary_author.profile_image}}
      <img src="{{primary_author.profile_image}}" alt="{{primary_author.name}}">
    {{/if}}
  </div>
  <div class="author-info">
    <p class="published-label">Published by:</p>
    <h3 class="author-name">{{primary_author.name}}</h3>
    {{#if primary_author.bio}}
      <p class="author-bio">{{primary_author.bio}}</p>
    {{/if}}
    <div class="author-links">
      {{#if primary_author.website}}
        <a href="{{primary_author.website}}" target="_blank" rel="noopener">Website</a>
      {{/if}}
      {{#if primary_author.twitter}}
        <a href="{{primary_author.twitter}}" target="_blank" rel="noopener">Twitter</a>
      {{/if}}
    </div>
  </div>
</div>
```

### Step 3: Add the Sidebar Layout

To add the Latest Articles sidebar in the theme, wrap your article content in a flex container:

```handlebars
<div class="content-with-sidebar-container">
  <article class="c-post">
    <div class="c-content">
      {{ content }}
      {{> custom-author-box}}
    </div>
  </article>

  <aside class="article-sidebar">
    <div class="sidebar-box">
      <h2 class="sidebar-title">Latest Articles</h2>
      {{#get "posts" filter="id:-{{id}}" limit="5" include="authors,tags" as |latest_posts|}}
        {{#if latest_posts}}
          {{#foreach latest_posts}}
            <div class="sidebar-post-item">
              <h3><a href="{{url}}">{{title}}</a></h3>
              <span>{{date format="MMMM DD, YYYY"}}</span>
            </div>
          {{/foreach}}
        {{/if}}
      {{/get}}
    </div>
  </aside>
</div>
```

> **Important:** The `{{#get}}` helper for latest posts must be placed *inside* the `{{#post}}...{{/post}}` block in your `post.hbs` to have access to the current post's ID (so it can exclude the current article from the list).

### Step 4: Re-upload Your Theme

Zip your theme folder and upload it via **Settings → Design → Upload theme**.

---

## Troubleshooting

**Author box not showing?** Make sure your staff accounts have a profile image and bio filled in at **Settings → Staff**.

**Sidebar not appearing?** Add this debug CSS temporarily to check if the element exists but is hidden:
```css
.latest-articles-sidebar {
  border: 2px solid red !important;
  display: block !important;
}
```

**Ghost API fetch returning empty?** Double-check that your Content API key is correct and that the key has not been deleted from **Settings → Integrations**.

---

## Summary

Adding an author box and latest articles sidebar makes your Ghost site feel more professional and keeps readers engaged. For Ghost Pro users, the Code Injection method is the easiest path. For developers on self-hosted Ghost, editing `post.hbs` gives you a cleaner, template-native implementation that doesn't rely on JavaScript for layout.

---

*Related: [Ghost CMS CSS Customization Guide](#) | [Understanding Ghost Theme Files: post.hbs, partials, and more](#)*
