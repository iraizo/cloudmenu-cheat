module.exports = {
    purge: ['./pages/**/*.tsx'],
   options: {
       defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
   },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};