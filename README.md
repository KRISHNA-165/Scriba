# Svelte + Tailwind Notes App

A fast, fully responsive, offline-first notes application built using **Svelte 5**, **TypeScript**, and **TailwindCSS v4**.

## 🔗 Links
- **GitHub Repository**: [https://github.com/KRISHNA-165/Scriba](https://github.com/KRISHNA-165/Scriba.git)
- **Video Walkthrough**: [Link to Video (1-3 min)]
- **Live Demo**: [Link to Deployed App (Vercel/Netlify)]

## ✨ Features
- **Full CRUD**: View, create, edit, and delete notes.
- **Offline-First via LocalStorage Queue**: App works seamlessly offline. Mutations are queued and synced automatically upon reconnection with optimistic UI.
- **Resilient Sync**: Improved error handling ensures that even if the API returns 404 or other errors, the user's data is preserved in the local queue and the UI remains updated.
- **Soft Deletes**: Deleting a note offers a 10-second `Undo` window before permanently removing it.
- **Search & Sort**: Real-time debounced search, along with sorting functionality (Date, Title, ID) powered by MockAPI.
- **Dark Mode**: Fully supports Tailwind's class-based dark mode, persisting preference in localStorage.
- **Pagination**: Navigate through notes 20 items at a time.
- **Keyboard Shortcuts**: Power-user features (`Ctrl+N` for new note, `Esc` to close modals).

## 🚀 How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Build & Deploy**
   - For production build: `npm run build`
   - To preview the build: `npm run preview`
   - For deployment (e.g., to Vercel), simply connect the repository to the platform; it will auto-detect the Vite build.

## 🤔 Reflection & Trade-offs

### Approach
I approached this project by prioritizing a clean user experience and robust data management. Using Svelte 5 allowed for reactive and concise state management, while TailwindCSS v4 provided a modern, premium aesthetic. The core focus was on the "offline-first" experience, ensuring the app is usable even with a flaky backend.

### Trade-offs & Assumptions
- **Storage**: Chose `localStorage` for the action queue to keep the app lightweight. For larger datasets, `IndexedDB` would be more appropriate.
- **Optimistic UI vs. Reliability**: I implemented an optimistic UI for instant feedback, but added a fallback mechanism that queues failed "online" requests to the offline queue, striking a balance between speed and reliability.
- **API Implementation**: Assumed a RESTful MockAPI structure. In case of API failure (like the 404 errors encountered), the app maintains state locally to prevent data loss.

### Additional Dependencies
- **lucide-svelte**: Used for high-quality, lightweight icons.
- **svelte-sonner**: Added for premium, accessible toast notifications to provide user feedback on sync and errors.
- **date-fns**: Used for robust and human-readable date formatting.

## 🔮 What I'd Do With More Time
- **Markdown Support**: Implement a rich-text or Markdown editor for better note formatting.
- **IndexedDB**: Scale the offline storage using `localforage` or similar to handle thousands of notes.
- **E2E Testing**: Add Playwright tests to verify complex offline/online transitions and the undo logic.
- **Collaboration**: Add basic room/sharing support using a real-time backend like Supabase or Socket.io.
