import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

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

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, 'text/html');
    
    // Extract external scripts
    const scripts: string[] = [];
    doc.querySelectorAll('script').forEach((script) => {
      const src = script.getAttribute('src');
      if (src) {
        scripts.push(src);
        script.parentNode?.removeChild(script);
      }
    });
    setExternalScripts(scripts);
    
    // Extract external stylesheets
    const styles: string[] = [];
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        styles.push(href);
        link.parentNode?.removeChild(link);
      }
    });
    setExternalStyles(styles);
    
    // Extract inline styles
    const inlineStylesArr: string[] = [];
    doc.querySelectorAll('style').forEach((styleTag) => {
      inlineStylesArr.push(styleTag.innerHTML);
      styleTag.parentNode?.removeChild(styleTag);
    });
    setInlineStyles(inlineStylesArr);
    
    // Get cleaned HTML without external resources
    setCleanedHtml(doc.body.innerHTML);
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
  }, [cleanedHtml]);

  return (
    <>
      <Head>
        {/* Load external stylesheets */}
        {externalStyles.map((href, index) => (
          <link key={`style-${index}`} rel="stylesheet" href={href} />
        ))}
        
        {/* Load external scripts */}
        {externalScripts.map((src, index) => (
          <script key={`script-${index}`} src={src} async />
        ))}
        
        {/* Inline styles */}
        {inlineStyles.map((css, index) => (
          <style key={`inline-style-${index}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </Head>
      
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