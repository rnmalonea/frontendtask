import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer as HotLoaderContainer} from 'react-hot-loader';
import {CoreLayout} from './layouts';
import App from "./App";

import './styles/main.scss';

const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(<HotLoaderContainer>
        <CoreLayout>
            <App/>
        </CoreLayout>
    </HotLoaderContainer>,
    MOUNT_NODE);

