import React from 'react';
import Header from '../../components/Header'
import {IComponentProps} from "../../models/generic";

import './CoreLayout.scss';

/**
 * @author Rory Malone <rory.malone@arm.com>
 */
export default function CoreLayout({children}: IComponentProps) {
    return (
        <>
            <Header/>
            <main role="main">
                <div className="container">
                    {children}
                </div>
            </main>
        </>
    )
}
