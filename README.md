  # UI Assignment November 22


 # Hi, I’m Prabhanjan 👋
I thoroughly enjoyed working on this UI assignment — it was interesting, well-structured, and a great opportunity to demonstrate UI engineering and state-management skills.

The project follows all the criteria mentioned in the assignment and has been deployed successfully on Netlify.

🔗 Live Demo: https://lifesightprojectdemo.netlify.app/

# 🚀 Tech Stack

React

Redux Toolkit

Reselect (Memoized Selectors)

React Lazy + Suspense

CSS (Responsive Dashboard Layout)

Error Boundaries

Netlify Deployment


# Supports searching by:

Channel

Region

Combined inputs → e.g. "facebook us", "google europe", "instagram india"

Search tokens match either field, allowing extremely flexible filtering.

Built with Redux Toolkit selectors and memoized using Reselect for optimized performance.

# ⚡ 2. Redux Toolkit + Memoization

State is globally managed using RTK slices.

Expensive computations (filtered data, KPIs, charts) are memoized:

Faster UI updates

No unnecessary re-renders

Smooth UX even with large data sets

# 🛡️ 3. Error Boundary Integration

Custom Error Boundary implemented to safely catch rendering errors.

Prevents UI crashes and displays a clean fallback message.

Ensures dashboard reliability.

# 💤 4. Lazy Loading for Performance

Non-critical components (charts, filters, tables) are lazy-loaded.

Improves:

Initial load time

Dashboard responsiveness

Resource usage

# 📊 5. Dashboard with Enhanced UX

Sticky header + scrollable content layout.

KPI, Charts, Filters, and Table respond dynamically to search/filter changes.

Data table has its own scroll container for clean browsing.

Fully responsive layout.

🌐 6. Deployment

The project is deployed on Netlify for fast, reliable hosting.

# 🔗 Live Application URL: https://lifesightprojectdemo.netlify.app/

