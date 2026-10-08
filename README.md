
# 🛒 বাজার দর | BazarDor

A responsive Bangla market price website that helps users explore daily prices of essential products, compare price changes, browse categories, and view product details.

## 🌐 Live Demo

- **Live Link:
- **GitHub Repository:

## 📌 About the Project

বাজার দর is a market price tracking web application built with Next.js. Users can browse essential products, check today's prices, see price increases and decreases, explore product categories, and view detailed market information.

The application also includes user authentication and profile management.

## ✨ Features

- 📊 View today's prices of essential products.
- 📈 Explore products with increasing prices.
- 📉 Explore products with decreasing prices.
- 🔍 Browse products by category.
- 🛍️ View individual product details.
- 🔐 Sign up and sign in with Better Auth.
- 👤 Manage profile information.
- 🔄 View loading states and friendly error pages.
- 📱 Responsive layout for mobile, tablet, and desktop.
- 🇧🇩 Bangla interface for a familiar local experience.

## 🛠️ Technologies Used

- **Next.js** — React framework and App Router
- **React** — User interface
- **JavaScript** — Application logic
- **Tailwind CSS** — Styling and responsive design
- **Better Auth** — Authentication
- **MongoDB** — Database, if configured for this project
- **REST API** — Product and category data
- **Git & GitHub** — Version control
- **Vercel** — Deployment

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project folder:

   ```bash
   cd bazar-dor
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the required environment variables in `.env.local` according to your Better Auth and database setup.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Production Build

To create an optimized production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## 📡 API

The application uses the Bazar Dor API to retrieve product and category information.

- **Base URL:** `https://api.abcz.workers.dev/api/bazardor`
- **All Products:** `/products`
- **Filter Products:** `/products?category=chal`
- **Single Product:** `/products/1`
- **Categories:** `/categories`
- **Single Category:** `/categories/chal`

## 📁 Project Routes

| Route | Description |
|---|---|
| `/` | Home page and product listings |
| `/category/[slug]` | Category-specific products |
| `/product/[slug]` | Product details |
| `/signin` | User sign-in |
| `/signup` | User registration |
| `/profile` | User profile |
| `/profile/update` | Update profile information |

## 👨‍💻 Author

**Shamim Reja*

---

