import { useEffect } from 'react';

interface ReftaggerProviderProps {
  language: 'english' | 'spanish';
}

// Define window.refTagger type
declare global {
  interface Window {
    refTagger?: {
      settings: {
        bibleVersion: string;
        bibleReader: string;
        tagChapters?: boolean;
        roundCorners?: boolean;
        addLogosLink?: boolean;
        convertHyperlinks?: boolean;
        socialSharing?: string[];
        customStyle?: {
          heading: {
            backgroundColor: string;
            color: string;
          };
          body: {
            color: string;
            moreLink: {
              color: string;
            };
          };
        };
      };
      tag?: () => void;
    };
    _refTaggerCallback?: (() => void);
  }
}

export function ReftaggerProvider({ language }: ReftaggerProviderProps) {
  useEffect(() => {
    // Remove any existing Reftagger scripts
    const oldScript = document.getElementById('refTaggerScript');
    if (oldScript) {
      document.body.removeChild(oldScript);
    }
    
    // Set up Reftagger with language-appropriate settings
    window.refTagger = {
      settings: {
        bibleVersion: language === 'english' ? 'NASB' : 'NBLA',
        bibleReader: 'bible.logos.com',
        tagChapters: true,
        roundCorners: true,
        customStyle: {
          heading: {
            backgroundColor: '#333',
            color: '#fff',
          },
          body: {
            color: '#333',
            moreLink: {
              color: '#0a7cff',
            },
          },
        },
      },
    };
    
    // Define a callback to execute after script loads
    window._refTaggerCallback = function() {
      console.log(`Reftagger initialized with ${language} version`);
      if (typeof window.refTagger !== 'undefined' && 
          typeof window.refTagger.tag === 'function') {
        window.refTagger.tag();
      }
    };
    
    // Load the Reftagger script
    const script = document.createElement('script');
    script.src = 'https://api.reftagger.com/v2/RefTagger.js';
    script.id = 'refTaggerScript';
    script.async = true;
    document.body.appendChild(script);
    
    // Clean up when the component unmounts
    return () => {
      // Remove the callback
      delete window._refTaggerCallback;
    };
  }, [language]);
  
  return null;
}

export default ReftaggerProvider;