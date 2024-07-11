import { createTheme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import CustomTheme from "../CustomTheme/CustomTheme";

const AppThemeProvider = ({ children }) => {
  const AppTheme = useSelector((state) => state.theme.theme);

  const darkTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: CustomTheme.CustomColor.Common.dark,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: CustomTheme.CustomColor.BlueGrey.dark,
            },
          },
        },
      },
      // MuiFormLabel: {
      //   styleOverrides: {
      //     root: {
      //       "&.Mui-focused": {
      //         color: 'blue',
      //       },
      //     },
      //   },
      // },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .header-cell": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].darker,
            },
            "& .MuiDataGrid-row": {
                backgroundColor: CustomTheme.CustomColor.Common.dark,
                color: AppTheme === "Dark" ? "#ffffff" : ""
              },
            "& .MuiDataGrid-row:hover": {
                backgroundColor: CustomTheme.CustomColor[AppTheme].hover,
              },
            "& ::-webkit-scrollbar-thumb": {
              backgroundColor: CustomTheme.CustomColor.Common.black, //"#36363c"
            },
            "& ::-webkit-scrollbar-track": {
              backgroundColor: CustomTheme.CustomColor.Common.dark,
            },
            "& ::-webkit-scrollbar-thumb:hover": {
              backgroundColor: CustomTheme.CustomColor.Common.black,
            },
            // "& .css-nwipjp-MuiButtonBase-root-MuiButton-root": {
            //   color: CustomTheme.CustomColor.Common.white
            // },
            "& .MuiDataGrid-columnHeader": {
              color: CustomTheme.CustomColor.Common.dullWhite
            },
            "& .MuiDataGrid-columnSeparator": {
              color: CustomTheme.CustomColor.Common.dullWhite,
              visibility: "visible"
            },
            "& .MuiDataGrid-cell": {
              color: CustomTheme.CustomColor.Common.dullWhite
            },
          },
        },
      },
    },
    palette: {
      mode: 'dark',
      primary: {
        ...CustomTheme.CustomColor[AppTheme],
      },
      secondary: {
        ...CustomTheme.CustomColor.Secondary,
      },
      error: {
        ...CustomTheme.CustomColor.Error,
      },
    },
  } );

  const theme = createTheme({
    components: {
      MuiAlert: {
        styleOverrides: {
          root: {
            color: CustomTheme.CustomColor.Common.black,
          },
          filledSuccess: {
            backgroundColor: CustomTheme.CustomColor.Alert.success,
          },
          filledError: {
            backgroundColor: CustomTheme.CustomColor.Alert.error,
          },
          filledWarning: {
            backgroundColor: CustomTheme.CustomColor.Alert.warning,
          },
          filledInfo: {
            backgroundColor: CustomTheme.CustomColor.Alert.info,
          },
        },
      },
      // MuiSvgIcon: {
      //   styleOverrides: {
      //     root: {
      //       color: CustomTheme.CustomColor.Common.dullWhite,
      //     },
      //   },
      // },
      MuiFormLabel: {
        styleOverrides: {
          root: {},
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            ":hover": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].light,
              color: CustomTheme.CustomColor.Common.black,
            },
            "&.Mui-selected": {
              // backgroundColor: "#536dfee6",
              color: CustomTheme.CustomColor.Common.black,
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: CustomTheme.CustomColor.Common.black,
            borderTop: "1px solid #F1F1F1",
            borderBottom: "1px solid #F1F1F1",

            ":hover": {
              borderRadius: 6,
              backgroundColor: CustomTheme.CustomColor[AppTheme].light,
              color: CustomTheme.CustomColor.Common.black,
              "& .MuiSvgIcon-root": {
                color: CustomTheme.CustomColor.Common.black,
              },
            },
            "&.Mui-selected": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].light,
              color: CustomTheme.CustomColor.Common.black,
              borderTop: "none",
              borderBottom: "none",
              borderLeft: "5px solid",
              borderColor: CustomTheme.CustomColor[AppTheme].main,
              "& .MuiSvgIcon-root": {
                color: CustomTheme.CustomColor.Common.black,
              },
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            // backgroundColor: CustomTheme.CustomColor[AppTheme].main
            "& .header-cell": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].main,
            },
            "& .MuiDataGrid-row:hover": {
                backgroundColor: CustomTheme.CustomColor[AppTheme].lighter,
              },
            "& ::-webkit-scrollbar-thumb": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].main,
            },
            "& ::-webkit-scrollbar-thumb:hover": {
              backgroundColor: CustomTheme.CustomColor[AppTheme].dark,
            },
            "& .MuiDataGrid-columnSeparator": {
              color: CustomTheme.CustomColor.Common.white,
              visibility: "visible"
            },
            "& .header-cell .MuiButtonBase-root": {
              color: CustomTheme.CustomColor.Common.white,
            },
          },
        },
      },
    },
    palette: {
      primary: {
        ...CustomTheme.CustomColor[AppTheme],
      },
      secondary: {
        ...CustomTheme.CustomColor.Secondary,
      },
      error: {
        ...CustomTheme.CustomColor.Error,
      },
    },
  });

  return <ThemeProvider theme={AppTheme === "Dark" ? darkTheme : theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;
