import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface HtmlComponentProps {
  value: string;
  style?: React.CSSProperties;
}

const HtmlComponent: React.FC<HtmlComponentProps> = ({ value, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [externalScripts, setExternalScripts] = useState<string[]>([]);
  const [externalStyles, setExternalStyles] = useState<string[]>([]);
  const [inlineStyles, setInlineStyles] = useState<string[]>([]);
  const [cleanedHtml, setCleanedHtml] = useState<string>(value);
  const [hasFontAwesome, setHasFontAwesome] = useState(false);

  useEffect(() => {
    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = value;
    
    // Check if FontAwesome is used
    const fontAwesomeDetected = value.includes('font-awesome') || 
                               value.includes('fontawesome') || 
                               value.includes('fa-') || 
                               value.includes('fas ') || 
                               value.includes('fab ') || 
                               value.includes('far ');
    
    setHasFontAwesome(fontAwesomeDetected);
    
    // Extract external scripts but don't remove them
    const scripts: string[] = [];
    tempContainer.querySelectorAll('script[src]').forEach((script) => {
      const src = script.getAttribute('src');
      if (src) {
        scripts.push(src);
      }
    });
    setExternalScripts(scripts);
    
    // Extract external stylesheets but don't remove them
    const styles: string[] = [];
    tempContainer.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        styles.push(href);
      }
    });
    setExternalStyles(styles);
    
    // Extract inline styles but don't remove them
    const inlineStylesArr: string[] = [];
    tempContainer.querySelectorAll('style').forEach((styleTag) => {
      inlineStylesArr.push(styleTag.innerHTML);
    });
    setInlineStyles(inlineStylesArr);
    
    // Set the HTML content without removing anything
    setCleanedHtml(value);
  }, [value]);

  // Execute inline scripts after the component is mounted
  useEffect(() => {
    if (!containerRef.current) return;

    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.innerHTML = script.innerHTML;
      script.parentNode?.replaceChild(newScript, script);
    });
    
    // Re-initialize FontAwesome if it's used
    if (hasFontAwesome && typeof window !== 'undefined') {
      // Try to find and reload FontAwesome if it exists
      if (window.FontAwesome) {
        try {
          // @ts-ignore
          window.FontAwesome.dom.i2svg();
        } catch (error) {
          console.error('Error reinitializing FontAwesome:', error);
        }
      }
    }
  }, [cleanedHtml, hasFontAwesome]);

  return (
    <>
      <Head>
        {/* Ensure FontAwesome is loaded if detected */}
        {hasFontAwesome && !externalStyles.some(href => href.includes('fontawesome')) && (
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            key="fontawesome-css"
          />
        )}
        
        {/* Load external stylesheets */}
        {externalStyles.map((href, index) => (
          <link key={`style-${index}`} rel="stylesheet" href={href} />
        ))}
        
        {/* Inline styles */}
        {inlineStyles.map((css, index) => (
          <style key={`inline-style-${index}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </Head>
      
      {/* Use Next.js Script component for better script loading */}
      {externalScripts.map((src, index) => (
        <Script key={`script-${index}`} src={src} strategy="afterInteractive" />
      ))}
      
      {/* Ensure FontAwesome JS is loaded if detected */}
      {hasFontAwesome && !externalScripts.some(src => src.includes('fontawesome')) && (
        <Script
          key="fontawesome-js"
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            // Re-initialize FontAwesome after script loads
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
      
      <div 
        ref={containerRef}
        style={style} 
        className="text-editor-css" 
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    </>
  );
};

export default HtmlComponent; 