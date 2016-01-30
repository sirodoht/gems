/**
 * Colors
 */
var colors = module.exports = {
  yellow: {rgb: "#f00"},
  magenta: {rgb: "#f0f"},
  cyan: {rgb: "#0ff"},
  grey: {rgb: "#888"},
  darkRed: {rgb: "#800"},
  lightRed: {rgb: "#f88"},
  darkGreen: {rgb: "#800"},
  lightGreen: {rgb: "#8f8"},
  darkGreen: {rgb: "#080"},
  lightBllue: {rgb: "#88f"},
  darkBllue: {rgb: "#008"},
};

colors.red= {
	rgb: "#f00",
	combine: {
		dark: "darkRed",
		light: "lightRed",
		green: "yellow",
		blue: "magenta"
	}
}

colors.green = {
	rgb: "#0f0",
	combine: {
		dark: "darkGreen",
		light: "lightGreen",
		red: "yellow",
		blue: "cyan"
	}
}

colors.blue = {
	rgb: "#00f",
	combine: {
		dark: "darkBlue",
		light: "lightBlue",
		red: "magenta",
		green: "cyan"
	}
}

colors.dark = {
	rgb: "#000",
	combine: {
		red: "darkRed",
		green: "darkGreen",
		blue: "darkBlue",
		lght: "grey"
	}
}

colors.light = {
	rgb: "#000",
	combine: {
		red: "lightRed",
		green: "lightGreen",
		blue: "lightBlue",
		dark: "grey"
	}
}