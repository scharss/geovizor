// eslint-disable-next-line
const colors = require('tailwindcss/colors');
// eslint-disable-next-line
const plugin = require('tailwindcss/plugin');
// eslint-disable-next-line
const postcss = require('postcss');

module.exports = {
  jit: 'enable',
  content: ['./{components,app,pages}/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    data: {
      'state-checked': 'state="checked"',
      'state-active': 'state="active"',
      'state-on': 'state="on"',
      'state-open': 'state="open"'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Source Code Pro', 'monospace']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      slate: colors.slate,
      purple: colors.purple,
      yellow: colors.yellow,
      red: colors.red,
      mint: {
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        900: '#134e4a'
      },
      ink: {
        900: '#070a0f',
        850: '#0b1017',
        800: '#101720',
        700: '#151e29',
        600: '#23303d',
        500: '#334457'
      }
    },
    extend: {
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      colors: {
        'mb-purple': {
          500: '#a78bfa',
          700: '#7c3aed'
        },
        'mb-blue': {
          300: '#5eead4',
          500: '#14b8a6',
          700: '#0f766e',
          900: '#134e4a'
        },
        'mb-green': {
          500: '#34d399'
        },
        'mb-orange': {
          500: '#fbbf24'
        },
        'mb-gray-dark': '#070a0f'
      },
      boxShadow: {
        panel: '0 18px 50px rgba(0, 0, 0, 0.35)',
        float: '0 12px 40px rgba(0, 0, 0, 0.45)',
        mint: '0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 30px rgba(0, 0, 0, 0.35)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(({ addVariant, e }) => {
      function addPointerVariant(ruleName, params) {
        addVariant(ruleName, ({ container, separator }) => {
          const pointerRule = postcss.atRule({
            name: 'media',
            params
          });
          pointerRule.append(container.nodes);
          container.append(pointerRule);
          pointerRule.walkRules((rule) => {
            rule.selector = `.${e(
              `${ruleName}${separator}${rule.selector.slice(1)}`
            )}`;
          });
        });
      }
      addPointerVariant('pointer-coarse', '(pointer: coarse');
      addPointerVariant('pointer-fine', '(pointer: fine');
      addPointerVariant('pointer-none', '(pointer: none');
      addVariant('hover-hover', ({ container, separator }) => {
        const hoverHover = postcss.atRule({
          name: 'media',
          params: '(hover: hover)'
        });
        hoverHover.append(container.nodes);
        container.append(hoverHover);
        hoverHover.walkRules((rule) => {
          rule.selector = `.${e(
            `hover-hover${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
      addVariant('hover-none', ({ container, separator }) => {
        const hoverNone = postcss.atRule({
          name: 'media',
          params: '(hover: none)'
        });
        hoverNone.append(container.nodes);
        container.append(hoverNone);
        hoverNone.walkRules((rule) => {
          rule.selector = `.${e(
            `hover-none${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    })
  ]
};
