module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        monroe: {
          base: "#0B0909",
          surface: "#171314",
          raised: "#231B18",
          gold: {
            primary: "#D6B56D",
            mid: "#B9964A",
            muted: "#8E6E33",
          },
          accent: {
            burgundy: "#5C1F27",
            oxblood: "#4A1419",
          },
          text: {
            primary: "#F3E7D3",
            secondary: "#CDBB9B",
          },
          data: {
            gain: "#8BC4A0",
            loss: "#C48C8C",
          }
        }
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "0.2em",
        ui: "0.13em",
      },
    },
  },
  plugins: [],
}
