import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ContextsProvider from './contexts/ContextsProvider';
import Routes from './routes/Routes';
import { ThemeProvider, createMuiTheme } from "@material-ui/core"
import "App.css"
import { FirebaseAuthProvider } from '@react-firebase/auth';
import firebase from 'firebase/app';
import { firebaseConfig } from 'firebase/config';
import 'firebase/firestore';
import 'firebase/database'
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ADD8E6",
      contrastText: "#FFF",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0,
        // fontWeight: theme.typography.fontWeightMedium,
        // fontFamily: theme.typography.fontFamily,
        // padding: theme.spacing(2, 4),
        // fontSize: theme.typography.pxToRem(14),
        boxShadow: 'none',
        '&:active, &:focus': {
          boxShadow: 'none',
        },
        '&:disabled': {
          backgroundColor: "grey",
        }
      },
      // sizeSmall: {
      //   padding: theme.spacing(1, 3),
      //   fontSize: theme.typography.pxToRem(13),
      // },
      // sizeLarge: {
      //   padding: theme.spacing(2, 5),
      //   fontSize: theme.typography.pxToRem(16),
      // },
    }
  }
})

function App() {
  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s"
        />
        <ContextsProvider>
          <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            <ThemeProvider theme={theme}>
              <Routes />
            </ThemeProvider>
          </FirebaseAuthProvider>
        </ContextsProvider>
      </HelmetProvider>
    </React.Fragment>
  );
}

export default App;
