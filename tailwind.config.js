module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      'ph': '360px',
      // => @media (min-width: 360px) = for phones
      'sm': '500px',
      // => @media (min-width: 500px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1068px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
}