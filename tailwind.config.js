module.exports = {
  content: ['./src/app/**/*.{js,jsx}', './src/components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: 'var(--font-body)',
        heading: 'var(--font-display)',
      },
    },
  },
  plugins: [],
};
