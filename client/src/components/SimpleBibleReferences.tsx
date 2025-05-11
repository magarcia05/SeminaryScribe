import { useEffect } from 'react';

interface SimpleBibleReferencesProps {
  language: 'english' | 'spanish';
}

export default function SimpleBibleReferences({ language }: SimpleBibleReferencesProps) {
  useEffect(() => {
    // Add the Bible Ref Tagger script when the component mounts
    const script = document.createElement('script');
    script.src = 'https://api.reftagger.com/v2/RefTagger.js';
    script.async = true;
    
    // Configure the Bible references based on language
    window.refTagger = {
      settings: {
        bibleVersion: language === 'english' ? 'NASB' : 'NBLA',
        bibleReader: 'bible.logos.com',
        addLogosLink: true,
        tagChapters: true,
        convertHyperlinks: false,
        roundCorners: true
      }
    };
    
    document.body.appendChild(script);
    
    // Cleanup when the component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[src="https://api.reftagger.com/v2/RefTagger.js"]');
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, [language]);
  
  return null;
}

// Add global type definition for RefTagger
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
  }
}