import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <html>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link
                        rel="stylesheet"
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                    />
                    <link
                        rel="stylesheet"
                        href="https://openlayers.org/en/v4.6.5/css/ol.css"
                        type="text/css"
                    />
                    <link rel="stylesheet" href="/static/mc/css/styles.css" />
                    <link rel="stylesheet" href="/static/mc/css/react-datepicker.css" />
                    <style>{`body { margin: 0 } /* custom! */`}</style>
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
