module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#4b8494",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-primary": {
          color: "#4b8494",
        },
        ".bg-primary": {
          backgroundColor: "#4b8494",
        },
        ".border-primary": {
          borderColor: "#4b8494",
        },
      });
    },
  ],
};
