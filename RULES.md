# Project Rules & Conventions

## Routing

- When creating a collection route (e.g., for projects, blog, etc.), use the `+` suffix in the folder name (e.g., `projects_+`, `blog_+`).
- This is required for dynamic routes (like `$slug.tsx`) to work correctly in this codebase.
- Example structure:
  - `app/routes/projects_+/index.tsx` for the list page (`/projects`)
  - `app/routes/projects_+/$slug.tsx` for the detail page (`/projects/:slug`)

## Why?

- Without the `+`, Remix may not correctly match dynamic routes inside the collection folder, leading to 404s or incorrect route resolution.
- This convention is used in this codebase to ensure reliable routing for collections. 