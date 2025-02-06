/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["timeline/**/*.{tsx,ts}"],
  theme: {
    extend: {
      boxShadow: {
        dynamics:
          "rgba(0, 0, 0, 0.12) 0px 0px 2px, rgba(0, 0, 0, 0.14) 0px 2px 4px",
      },
      fontFamily: {
        dynamics:
          '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      },
      colors: {
        "dynamics-text": "rgb(36, 36, 36)",
      },
    },
  },
  plugins: [],
};
