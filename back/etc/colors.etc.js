/**
 * Colors
 */
var colors = module.exports = {
  yellow: {rgb: '#ff0'},
  magenta: {rgb: '#f0f'},
  cyan: {rgb: '#0ff'},
  grey: {rgb: '#888'},
  darkRed: {rgb: '#800'},
  lightRed: {rgb: '#f88'},
  lightGreen: {rgb: '#8f8'},
  darkGreen: {rgb: '#080'},
  lightBlue: {rgb: '#88f'},
  darkBlue: {rgb: '#008'},
};

colors.red= {
  rgb: '#f00',
  combine: {
    dark: 'darkRed',
    light: 'lightRed',
    green: 'yellow',
    blue: 'magenta'
  },
  basic: true
};

colors.green = {
  rgb: '#0f0',
  combine: {
    dark: 'darkGreen',
    light: 'lightGreen',
    red: 'yellow',
    blue: 'cyan'
  },
  basic: true
};

colors.blue = {
rgb: '#00f',
  combine: {
    dark: 'darkBlue',
    light: 'lightBlue',
    red: 'magenta',
    green: 'cyan'
  },
  basic: true
};

colors.dark = {
  rgb: '#000',
  combine: {
    red: 'darkRed',
    green: 'darkGreen',
    blue: 'darkBlue',
    light: 'grey'
  },
  basic: true
};

colors.light = {
  rgb: '#fff',
  combine: {
    red: 'lightRed',
    green: 'lightGreen',
    blue: 'lightBlue',
    dark: 'grey'
  },
  basic: true
};
