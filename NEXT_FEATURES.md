# Creddit Next Features

This document lists discrete feature ideas that can be added one at a time on top of the current Reddit-like app.

Current baseline:

- Users can register and log in through backend API endpoints.
- Authenticated users can create posts and comments through API endpoints.
- The feed lists posts, supports newest/popular sorting, and has client-side search.
- Post detail pages show the post body, vote totals, and similar posts.
- Backend vote endpoints exist for posts.

## Feature List

[done] ### 1. Login Form UI 

Add a working login form on the frontend.

Scope:

- Build email and password inputs in `frontend/src/pages/Login.jsx`.
- Submit credentials to `POST /api/auth/login`.
- Store the returned token with the existing `useAuth`/localStorage pattern.
- Redirect the user to the feed after successful login.
- Show validation and API error messages.

Done when:

- A registered user can log in from the browser.
- The token is persisted in `localStorage`.
- Failed login attempts show a clear error without leaving the page.

[done] ### 2. Register Form UI

Add a working registration form on the frontend.

Scope:

- Build username, email, password, and confirm-password inputs in `frontend/src/pages/Register.jsx`.
- Submit new accounts to `POST /api/auth/register`.
- Store the returned token after successful registration.
- Redirect the user to the feed after successful registration.
- Show duplicate email/username and password mismatch errors.

Done when:

- A new user can create an account from the browser.
- The user is logged in immediately after registration.
- Form validation catches obvious input mistakes before submission.

[done] ### 3. Auth-Aware Navbar

Update the navbar based on whether the user is logged in.

Scope:

- Show `Login` and `Register` only when logged out.
- Show the current username if available.
- Add a `Logout` button that clears the token.
- Keep `Home` visible for everyone.

Done when:

- Logged-out users see auth links.
- Logged-in users see account state and can log out.
- Logging out immediately updates the navbar without a page refresh.

[done] ### 4. Create Post UI

Add a frontend flow for creating posts.

Scope:

- Add a `Create Post` page or inline composer.
- Require login before submitting.
- Send title and content to `POST /api/posts`.
- Redirect to the new post detail page after success.
- Add loading, success, and error states.

Done when:

- Logged-in users can create a post from the browser.
- Logged-out users are guided to log in.
- Empty title/content submissions are blocked.

### 5. Comments UI

Show and create comments on the post detail page.

Scope:

- Fetch comments from `GET /api/posts/:id/comments`.
- Render comments under the post detail.
- Add a comment form for logged-in users.
- Submit comments to `POST /api/posts/:id/comments`.
- Refresh or append the new comment after submission.

Done when:

- Users can read comments for a post.
- Logged-in users can add comments.
- Comments display author and creation date.

### 6. Post Voting UI

Connect the existing post vote API to the frontend.

Scope:

- Add upvote and downvote buttons on feed cards and post detail.
- Call `POST /api/posts/:id/vote` with `{ "type": "up" }` or `{ "type": "down" }`.
- Update vote counts after a successful response.
- Disable vote buttons while a vote request is in progress.

Done when:

- Logged-in users can vote from the feed and detail page.
- The displayed score updates without a full page reload.
- Logged-out users are prompted to log in before voting.

### 7. One Vote Per User

Replace raw post vote counters with per-user vote tracking.

Scope:

- Update the `Post` model to store voter IDs and vote direction.
- Prevent the same user from repeatedly increasing a vote count.
- Allow users to change or remove their vote.
- Return the current user's vote state in post API responses.

Done when:

- Repeated upvotes from the same user do not inflate the score.
- Users can switch between upvote, downvote, and no vote.
- Existing frontend vote buttons can reflect active vote state.

### 8. Comment Voting

Add voting support for comments.

Scope:

- Add backend routes for voting on comments.
- Reuse the same vote semantics chosen for posts.
- Add upvote and downvote controls to rendered comments.
- Sort comments by newest first initially.

Done when:

- Logged-in users can vote on comments.
- Comment scores update in the UI.
- Vote validation matches post voting behavior.

### 9. User Profile Page

Add public profile pages for users.

Scope:

- Add backend endpoint to fetch a user profile by username.
- Include basic profile data, recent posts, and recent comments.
- Add frontend route `/u/:username`.
- Link usernames in posts and comments to profile pages.

Done when:

- Clicking a username opens that user's profile.
- The page shows recent activity.
- Missing users show a friendly not-found state.

### 10. Server-Side Search

Move post search from client-side filtering to the backend.

Scope:

- Add a `q` query parameter to `GET /api/posts`.
- Search post title, content, and author username.
- Keep existing `sort` support.
- Update the frontend search box to request filtered results from the API.

Done when:

- Search works even when the database has more posts than the first loaded page.
- Search and sorting work together.
- Empty search returns the normal feed.

### 11. Pagination

Add pagination to the post feed.

Scope:

- Add `page` and `limit` query parameters to `GET /api/posts`.
- Return pagination metadata such as `page`, `limit`, `total`, and `hasMore`.
- Add `Load more` or paged navigation in the frontend.
- Keep pagination compatible with sorting and search.

Done when:

- The feed does not fetch every post at once.
- Users can load more posts.
- The UI handles the empty and end-of-list states.

### 12. Communities

Introduce subreddit-style communities.

Scope:

- Add a `Community` model with name, slug, description, and creator.
- Add create/list/detail community endpoints.
- Associate posts with a community.
- Add community pages that list posts in that community.

Done when:

- Users can create communities.
- Posts can belong to one community.
- Community pages have their own feed.

### 13. Community Membership

Allow users to join and leave communities.

Scope:

- Track members for each community.
- Add join and leave endpoints.
- Show membership state on community pages.
- Add a user's joined communities to the navbar or sidebar.

Done when:

- Logged-in users can join and leave communities.
- Membership state persists across reloads.
- Joined communities are easy to revisit.

### 14. Saved Posts

Let users save posts for later.

Scope:

- Add saved-post tracking to the user model or a separate collection.
- Add save/unsave endpoints.
- Add save buttons on feed cards and post detail.
- Add a saved posts page for the current user.

Done when:

- Logged-in users can save and unsave posts.
- Saved posts persist across sessions.
- Users can view their saved posts in one place.

### 15. Edit And Delete Own Posts

Allow post authors to manage their posts.

Scope:

- Add update and delete post endpoints.
- Restrict edits/deletes to the original author.
- Add edit/delete controls on the post detail page for the author.
- Confirm destructive actions before deleting.

Done when:

- Authors can edit their own post title/content.
- Authors can delete their own posts.
- Other users cannot edit or delete someone else's posts.

### 16. Edit And Delete Own Comments

Allow comment authors to manage their comments.

Scope:

- Add update and delete comment endpoints.
- Restrict edits/deletes to the original author.
- Add edit/delete controls on comments for the author.
- Remove deleted comments from the post detail view or show a deleted state.

Done when:

- Authors can edit their own comments.
- Authors can delete their own comments.
- Other users cannot edit or delete someone else's comments.

### 17. Markdown Rendering

Support basic Markdown in posts and comments.

Scope:

- Add Markdown rendering on post detail and comments.
- Sanitize rendered HTML to prevent unsafe content.
- Add a preview toggle in post and comment forms.
- Document supported Markdown syntax.

Done when:

- Basic formatting such as headings, links, lists, blockquotes, and code renders correctly.
- Unsafe HTML or scripts do not execute.
- Users can preview before posting.

### 18. Notifications

Notify users when someone comments on their post.

Scope:

- Add a `Notification` model.
- Create a notification when a comment is added to another user's post.
- Add an authenticated endpoint for the current user's notifications.
- Add a navbar indicator and notifications page.

Done when:

- Post authors receive notifications for new comments.
- Users can view unread notifications.
- Users can mark notifications as read.

### 19. Basic Moderation

Add first-pass moderation tools.

Scope:

- Add a user role field such as `user` and `admin`.
- Add admin-only endpoints to remove posts or comments.
- Add a simple reports model for user-submitted reports.
- Add report buttons on posts and comments.

Done when:

- Users can report problematic content.
- Admin users can review and remove reported content.
- Non-admin users cannot access moderation endpoints.

### 20. Test Coverage Expansion

Add tests around the highest-risk backend behavior.

Scope:

- Add auth controller tests for registration and login.
- Add post API tests for create, list, fetch, and vote.
- Add comment API tests for create and list.
- Add authorization tests for protected endpoints.

Done when:

- `npm test` covers core API behavior beyond similarity matching.
- Tests can run without requiring a developer's local database state.
- Regressions in auth, posting, commenting, and voting are caught early.

## Suggested Order

1. Login Form UI
2. Register Form UI
3. Auth-Aware Navbar
4. Create Post UI
5. Comments UI
6. Post Voting UI
7. One Vote Per User
8. Server-Side Search
9. Pagination
10. User Profile Page
11. Saved Posts
12. Edit And Delete Own Posts
13. Edit And Delete Own Comments
14. Comment Voting
15. Communities
16. Community Membership
17. Markdown Rendering
18. Notifications
19. Basic Moderation
20. Test Coverage Expansion

The first six items mostly expose backend functionality that already exists. Items after that introduce new data model or authorization behavior and should be handled with focused backend tests.
