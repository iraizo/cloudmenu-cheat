import React from 'react';
import App from 'next/app';
import Head from "next/head";
import "../public/css/style.css";

export default class MyApp extends App {


    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <link href={"https://rawgit.com/minhtranite/react-notifications/next/dist/react-notifications.css"} rel={"stylesheet"}></link>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Component {...pageProps} />
            </>
        )
    }
}