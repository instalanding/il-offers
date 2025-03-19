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
    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = value;
    
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