import React from "react";
import Document, { Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
    render () {
        return (
            <html lang='en-US'>
                <Head>
                    
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </html>
        );
    }
}