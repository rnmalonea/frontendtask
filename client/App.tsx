import React from 'react';

export default function App() {

    /*
    * Start here
    *
    * */
    window
        .fetch('/api/contracts', { method: 'GET' })
        .then(() => {/*  */
        });

    return (
        <></>
    );
}
