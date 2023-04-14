import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ColorDropperApp from './ColorDropperApp';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ColorDropperApp />
    </React.StrictMode>
);
