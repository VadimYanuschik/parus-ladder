import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {ThemeProvider} from "@mui/material";
import theme from "./theme";
import {BrowserRouter as Router} from "react-router-dom";
import './firebase/firebase.config';
import {Provider} from "react-redux";
import {store} from "./redux/store";


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <ThemeProvider theme={theme}>
                    <App/>
                </ThemeProvider>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
