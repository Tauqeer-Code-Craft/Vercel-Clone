module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.3s ease-out",
      },
      keyframes: {
        fadeInUp: {
           "0%": { opacity: 0, transform: "translateY(20px)" },
           "100%": { opacity: 1, transform: "translateY(0)" },
       },
     },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
     },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
