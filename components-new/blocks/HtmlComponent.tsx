import React, { useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface HtmlComponentProps {
  value: string;
  style?: React.CSSProperties;
}

const HtmlComponent: React.FC<HtmlComponentProps> = ({ value, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize extraction logic to prevent unnecessary recalculations
  const { externalScripts, externalStyles, inlineStyles, cleanedHtml, hasFontAwesome } = useMemo(() => {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = value;

    const fontAwesomeDetected = /font-awesome|fontawesome|fa-|fas |fab |far /i.test(value);

    const scripts = Array.from(tempContainer.querySelectorAll('script[src]'))
      .map((script) => script.getAttribute('src'))
      .filter(Boolean) as string[];

    const styles = Array.from(tempContainer.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => link.getAttribute('href'))
      .filter(Boolean) as string[];

    const inlineStylesArr = Array.from(tempContainer.querySelectorAll('style')).map((styleTag) => styleTag.innerHTML);

    return { externalScripts: scripts, externalStyles: styles, inlineStyles: inlineStylesArr, cleanedHtml: value, hasFontAwesome: fontAwesomeDetected };
  }, [value]);

  // Execute inline scripts once after mounting
  useEffect(() => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      containerRef.current?.querySelectorAll('script').forEach((script) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.innerHTML = script.innerHTML;
        script.parentNode?.replaceChild(newScript, script);
      });

      // Reinitialize FontAwesome if necessary
      if (hasFontAwesome && typeof window !== 'undefined' && window.FontAwesome) {
        try {
          // @ts-ignore
          window.FontAwesome.dom.i2svg();
        } catch (error) {
          console.error('Error reinitializing FontAwesome:', error);
        }
      }
    });
  }, [cleanedHtml, hasFontAwesome]);

  return (
    <>
      <Head>
        {/* Load FontAwesome if detected but not already included */}
        {hasFontAwesome && !externalStyles.some(href => href.includes('fontawesome')) && (
          <link key="fontawesome-css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        )}

        {/* Load external styles */}
        {externalStyles.map((href, index) => (
          <link key={`style-${index}`} rel="stylesheet" href={href} />
        ))}

        {/* Inject inline styles */}
        {inlineStyles.length > 0 && <style dangerouslySetInnerHTML={{ __html: inlineStyles.join('\n') }} />}
      </Head>

      {/* Load external scripts using Next.js Script for better performance */}
      {externalScripts.map((src, index) => (
        <Script key={`script-${index}`} src={src} strategy="afterInteractive" />
      ))}

      {/* Load FontAwesome JS if detected but not already included */}
      {hasFontAwesome && !externalScripts.some(src => src.includes('fontawesome')) && (
        <Script
          key="fontawesome-js"
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.FontAwesome) {
              try {
                // @ts-ignore
                window.FontAwesome.dom.i2svg();
              } catch (error) {
                console.error('Error initializing FontAwesome:', error);
              }
            }
          }}
        />
      )}

      {/* Render sanitized HTML content */}
      <div ref={containerRef} style={style} className="text-editor-css" dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
    </>
  );
};

export default HtmlComponent;
