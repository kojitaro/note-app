import { Html, Head, Main, NextScript } from 'next/document'
import Header from '../components/header'

export default function Document() {
  return (
    <Html lang="ja">
      <Head />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_TAG_ID}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_TAG_ID}');
          `
        }}/>
      <body>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
