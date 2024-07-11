import {
  blue,
  green,
  deepOrange,
  indigo,
  lightGreen,
  orange,
  red,
  teal,
  blueGrey,
  pink,
  brown,
  lightBlue
} from "@mui/material/colors";

const CustomColor = {
  Common: {
    black: "#000000",
    white: "#ffffff",
    textblue: "#4F46E5",
    dark: "#202020",
    gray900: "#111827",
    dullWhite: "#89939d",
  },
  Indigo: {
    main: indigo.A200,
    light: indigo[100],
    lighter: "#E6E5FB",
    dark: indigo.A400,
    darker: indigo.A700,
    contrastText: "#ffffff",
  },
  Green1: {
    main: green.A200,
    light: green.A100,
    lighter: green[50],
    dark: green.A400,
    darker: green.A700,
    contrastText: "#ffffff",
  },
  DeepOrange: {
    main: deepOrange.A200,
    light: deepOrange[100],
    lighter: deepOrange[50],
    dark: deepOrange.A400,
    darker: deepOrange.A700,
    contrastText: "#ffffff",
  },
  Primary: {
    main: "#30A7CD",
    light: lightBlue[100],
    lighter: lightBlue[50],
    dark: "#178EB4",
    newcolor:"#d6eef6",
    indigoLight: "#E6E5FB",
    contrastText: "#ffffff",
  },
  Secondary: {
    main: "#ef5b0c",
    light: deepOrange[100],
    lighter: deepOrange[50],
    dark: "#b52700",
    contrastText: "#ffffff",
  },
  Error: {
    main: "#D32F2F",
    light: red[100],
    lighter: red[50],
    dark: "#D32F2F",
    contrastText: "#FFFFFF",
  },
  Black: {
    main: "#121212",
    light: "#a9a9a9",
    lighter: "#d3d3d3",
    dark: "#000000",
    contrastText: "#ffffff",
  },
  Mixed: {
    main: green[900], //#242424 // Main dark color
    light: lightBlue[300], // Lighter shade of dark
    lighter: indigo[300],
    dark: "#ffffff", // Darkest shade of dark
    contrastText: "#ffffff", // Text color for contrast
  },
  Fade: {
    main: "#333333",
    light: "#555555",
    lighter: "#555555",
    dark: "#111111",
    contrastText: "#ffffff",
  },
  Teal: {
    main: teal[500],
    light: teal[100],
    lighter: teal[50],
    dark: teal[700],
    darker: teal[800],
    contrastText: "#ffffff",
  },
  Orange: {
    main: orange[500],
    light: orange[100],
    lighter: orange[50],
    dark: orange[700],
    darker: orange[800],
    contrastText: "#ffffff",
  },
  Pink: {
    main: pink[500],
    light: pink[100],
    lighter: pink[50],
    dark: pink[700],
    darker: pink[800],
    contrastText: "#ffffff",
  },
  BlueGrey: {
    main: blueGrey[500],
    light: blueGrey[100],
    lighter: blueGrey[50],
    dark: blueGrey[700],
    darker: blueGrey[800],
    contrastText: "#ffffff",
  },
  Green: {
    main: green[500],
    light: green[100],
    lighter: green[50],
    dark: green[700],
    darker: green[800],
    contrastText: "#ffffff",
  },
  Brown: {
    main: brown[900],
    light: brown[100],
    lighter: brown[50],
    dark: brown[700],
    darker: brown[800],
    contrastText: "#ffffff",
  },
  Dark: {
    main: "#2b2b2b",
    light: "#374045",
    lighter: "#242424",
    dark: "#202020",
    darker: "#000000",
    hover: "#31313130",
    contrastText: "#ffffff",
  },
  Blue: {
    main: blue[500],
    light: blue[100],
    lighter: blue[50],
    dark: blue[700],
    darker: blue[800],
    contrastText: "#ffffff",
  },
  Alert: {
    success: lightGreen[200],
    error: red[200],
    warning: orange[200],
    info: blue[200],
  },
  Site: {
    bgColor: "#F9F9F9",
    lbText: "#F6AE84",
    lbAdminText: "#fafafa",
  },
};

const CustomTheme = {
  CustomColor,
};

export default CustomTheme;
