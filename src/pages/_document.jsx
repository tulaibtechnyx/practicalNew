import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheets } from "@mui/styles"
import PAGE from "config/page.config"
import Script from "next/script"
import createCache from "@emotion/cache"
import { isProductionServer, isStagingServer } from "../helpers/ShortMethods"
import AppDataConstant from "../helpers/AppDataConstant"
const createEmotionCache = () => {
  return createCache({ key: "css", prepend: true })
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps, locale: ctx?.locale || "en", route: ctx }
  }
  render() {
    const direction = this.props.locale === "ar" ? "rtl" : "ltr"

    function addProductJsonLd() {
      return {
        __html: `{
          "@context": "https://schema.org",
          "@type": "Corporation",
          "name": "PractiCal",
          "url": "",
          "logo": "",
          "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+971 58 598 7044",
          "contactType": "customer service",
          "areaServed": "AE",
          "availableLanguage": "en"
          }
        }
    `
      }
    }

    return (
      <Html dir={direction} lang={this.props.locale}>
        <Head>
          <link href={PAGE.favicon} rel="shortcut icon" type="image/x-icon" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="apple-touch-icon" href="/fav/android-icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="PractiCal" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-tap-highlight" content="no" />

          <link
            rel="preload"
            as="image"
            type="image/webp"
            href="https://assets.practical.me/public/banner/bannrWebp-sm.webp"
            media="(max-width: 768px)"
            fetchpriority="high"
          />
          {/* Preload large image for screens > 768px */}
          <link
            rel="preload"
            as="image"
            type="image/webp"
            href="https://assets.practical.me/public/banner/bannrWebp.webp"
            media="(min-width: 769px)"
            fetchpriority="high"
          />
          {/* <link 
            rel="preload"   
            as="image"
            type="image/webp"
            href="https://assets.practical.me/public/banner/bannrWebp-sm.webp" fetchpriority="high"/> */}
          {/* <link
            rel="preload"
            as="image"
            href="/images/banner/bannrWebp-sm.webp"
            fetchpriority="high"
            type="image/webp"
          />
          <link rel="dns-prefetch" href="https://assets.practical.me" />
          <link rel="preconnect" href="https://assets.practical.me" crossOrigin="anonymous" />

          {/* <link
            rel="preload"
            href={AppDataConstant.homeQuizBg}
            as="image"
            fetchpriority="high"
          /> */}
          {/* <link
              rel="preload"
              href="/fonts/EuclidCircularB.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            /> */}
          {this.props.dangerousAsPath == "/" ? (
            <>
              <title>
                Home Delivery Meal Plan | Dubai, Abu Dhabi & UAE | PractiCal
              </title>
              <meta
                name="description"
                content="PractiCal home delivery Meal Plans will help you eat better, every day. Take a look at our custom Meal Plans across Dubai, Abu Dhabi and the UAE. Sign up now."
              />
            </>
          ) : null}
          <Script
            strategy="lazyOnload"
            type="application/ld+json"
            dangerouslySetInnerHTML={addProductJsonLd()}
            key="product-jsonld"
          ></Script>
          {isStagingServer() ? (
            <>
              <meta name="robots" content="noindex"></meta>
              <meta name="googlebot" content="noindex"></meta>
            </>
          ) : null}


          {!isStagingServer() ? (
            <>
              <meta
                name="google-site-verification"
                content="i3sLncR1WRIBB35U0IJQJZaF5TeisV_Dv0EnARZqlfY"
              />
              <meta
                name="facebook-domain-verification"
                content="age46q0vq4k2qqad6txenvcssrulod"
              />
            </>
          ) : null}
        </Head>
        <body
          className="theme-light"
        >
          <Main />
          <NextScript />

        </body>
      </Html>
    )
  }
}

export default MyDocument
// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        sheets.collect(<App emotionCache={cache} {...props} />)
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  }
}
