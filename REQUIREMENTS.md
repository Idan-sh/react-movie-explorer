# React Movie Explorer - Requirements Checklist

## Tech Stack
- [ ] React
- [ ] Redux-Saga

## API Integration
- [ ] Use The Movie Database (TMDB) API: https://www.themoviedb.org/documentation/api

---

## Core Features

### Homepage
- [ ] Display all popular movies on the homepage
- [ ] 4 cards per row layout

### Category Filtering
- [ ] Filter by **Popular**
- [ ] Filter by **Airing Now**
- [ ] Filter by **My Favorites**

### Pagination
- [ ] Pagination for Popular movies
- [ ] Pagination for Airing Now movies

### Movie Details Page
- [ ] Clicking a movie opens a separate page (not a new tab)
- [ ] Display movie details
- [ ] Option to add movie to favorites
- [ ] Favorites stored in localStorage (no external API needed)

---

## Search Functionality

- [ ] Search input field for movies
- [ ] Search request only sent if **at least 2 characters** entered
- [ ] Debounce: request only sent if user hasn't typed for **500ms**
- [ ] Rate limiting: maximum **5 requests per 10 seconds**

---

## Keyboard Navigation

- [ ] All site navigation done using keyboard
- [ ] Arrow keys for navigation
- [ ] Enter key for selection/action
- [ ] Escape key for back/close
- [ ] **Tab key must NOT perform any action**
- [ ] Scrolling done via keyboard navigation (not mouse)

---

## Mouse/Scroll Restrictions

- [ ] Disable mouse scrolling (via CSS overflow)

---

## Category Navigation Behavior (Popular / Airing Now)

- [ ] Request sent **on focus after 2 seconds delay**
- [ ] OR request sent **immediately on click**

---

## Code Quality Requirements

### Coding Standards
- [ ] Follow coding principles (DRY, SOLID, etc.)
- [ ] Consistent naming conventions
- [ ] Code readability

### Error Handling
- [ ] Handle timeouts
- [ ] Handle missing fields
- [ ] Handle incorrect fields

### Performance
- [ ] Minimize number of renders
- [ ] Efficient data loading from API
- [ ] Fast overall application loading speed

---

## Deliverables

- [ ] Create a GitHub repository
- [ ] Push completed code to GitHub

---

## Summary Checklist

| Category | Total Items |
|----------|-------------|
| Tech Stack | 2 |
| Core Features | 8 |
| Search | 4 |
| Keyboard Navigation | 6 |
| Mouse Restrictions | 1 |
| Category Navigation | 2 |
| Code Quality | 9 |
| Deliverables | 2 |
| **Total** | **34** |
