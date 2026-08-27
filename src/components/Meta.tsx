import React, { useEffect } from 'react';

interface MetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const Meta: React.FC<MetaProps> = ({ 
  title, 
  description, 
  canonical, 
  ogImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200', 
  ogType = 'website',
  schema 
}) => {
  useEffect(() => {
    // 1. Document title
    if (title) {
      document.title = title.includes('FuneralFolio') ? title : `${title} | FuneralFolio`;
    }

    // 2. Meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 3. Canonical URL
    const finalCanonical = canonical || window.location.href;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', finalCanonical);

    // 4. Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title ? (title.includes('FuneralFolio') ? title : `${title} | FuneralFolio`) : 'FuneralFolio | Memorial Platform' },
      { property: 'og:description', content: description || 'Create print-ready funeral programs, prayer cards, and memorial documents with our AI-guided suite.' },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: finalCanonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'FuneralFolio' },
    ];

    ogTags.forEach(({ property, content }) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // 5. Twitter card parameters
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title ? (title.includes('FuneralFolio') ? title : `${title} | FuneralFolio`) : 'FuneralFolio | Memorial Platform' },
      { name: 'twitter:description', content: description || 'Create print-ready funeral programs, prayer cards, and memorial documents.' },
      { name: 'twitter:image', content: ogImage },
    ];

    twitterTags.forEach(({ name, content }) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // 6. Dynamic JSON-LD Structured Data Schema
    let scriptEl: HTMLScriptElement | null = null;
    if (schema) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('type', 'application/ld+json');
      scriptEl.setAttribute('data-dynamic-meta', 'true');
      scriptEl.textContent = JSON.stringify(schema);
      document.head.appendChild(scriptEl);
    }

    return () => {
      // Clean up dynamic schema element on route change
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, canonical, ogImage, ogType, schema]);

  return null;
};

export default Meta;
