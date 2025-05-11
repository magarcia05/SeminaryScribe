import { useEffect, useRef } from 'react';

interface BibleReferenceHandlerProps {
  language: 'english' | 'spanish';
  contentSelector: string;
}

// Regular expressions for matching Bible references
const ENGLISH_REFERENCE_REGEX = /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s+(\d+)(?::(\d+)(?:-(\d+))?)?(?:\s|$|,|;|\.)/gi;

// Enhanced Spanish reference regex with different syntaxes
const SPANISH_REFERENCE_REGEX = /\b(Génesis|Genesis|Éxodo|Exodo|Levítico|Levitico|Números|Numeros|Deuteronomio|Josué|Josue|Jueces|Rut|Ruth|1\s*Samuel|2\s*Samuel|1\s*Reyes|2\s*Reyes|1\s*Crónicas|1\s*Cronicas|2\s*Crónicas|2\s*Cronicas|Esdras|Nehemías|Nehemias|Ester|Esther|Job|Salmo|Salmos|Proverbios|Eclesiastés|Eclesiastes|Cantares|Cantar de los Cantares|Isaías|Isaias|Jeremías|Jeremias|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Amos|Abdías|Abdias|Jonás|Jonas|Miqueas|Nahúm|Nahum|Habacuc|Sofonías|Sofonias|Hageo|Zacarías|Zacarias|Malaquías|Malaquias|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1\s*Corintios|2\s*Corintios|Gálatas|Galatas|Efesios|Filipenses|Colosenses|1\s*Tesalonicenses|2\s*Tesalonicenses|1\s*Timoteo|2\s*Timoteo|Tito|Filemón|Filemon|Hebreos|Santiago|1\s*Pedro|2\s*Pedro|1\s*Juan|2\s*Juan|3\s*Juan|Judas|Apocalipsis)\s+(\d+)(?::(\d+)(?:-(\d+))?)?(?:\s|$|,|;|\.)/gi;

// Map Spanish book names to English for API compatibility
const SPANISH_TO_ENGLISH_BOOKS: Record<string, string> = {
  'Génesis': 'Genesis',
  'Genesis': 'Genesis',
  'Éxodo': 'Exodus',
  'Exodo': 'Exodus',
  'Levítico': 'Leviticus',
  'Levitico': 'Leviticus',
  'Números': 'Numbers',
  'Numeros': 'Numbers',
  'Deuteronomio': 'Deuteronomy',
  'Josué': 'Joshua',
  'Josue': 'Joshua',
  'Jueces': 'Judges',
  'Rut': 'Ruth',
  'Ruth': 'Ruth',
  'Esdras': 'Ezra',
  'Nehemías': 'Nehemiah',
  'Nehemias': 'Nehemiah',
  'Ester': 'Esther',
  'Esther': 'Esther',
  'Salmo': 'Psalm',
  'Salmos': 'Psalms',
  'Proverbios': 'Proverbs',
  'Eclesiastés': 'Ecclesiastes',
  'Eclesiastes': 'Ecclesiastes',
  'Cantares': 'Song of Solomon',
  'Cantar de los Cantares': 'Song of Solomon',
  'Isaías': 'Isaiah',
  'Isaias': 'Isaiah',
  'Jeremías': 'Jeremiah',
  'Jeremias': 'Jeremiah',
  'Lamentaciones': 'Lamentations',
  'Ezequiel': 'Ezekiel',
  'Daniel': 'Daniel',
  'Oseas': 'Hosea',
  'Joel': 'Joel',
  'Amós': 'Amos',
  'Amos': 'Amos',
  'Abdías': 'Obadiah',
  'Abdias': 'Obadiah',
  'Jonás': 'Jonah',
  'Jonas': 'Jonah',
  'Miqueas': 'Micah',
  'Nahúm': 'Nahum',
  'Nahum': 'Nahum',
  'Habacuc': 'Habakkuk',
  'Sofonías': 'Zephaniah',
  'Sofonias': 'Zephaniah',
  'Hageo': 'Haggai',
  'Zacarías': 'Zechariah',
  'Zacarias': 'Zechariah',
  'Malaquías': 'Malachi',
  'Malaquias': 'Malachi',
  'Mateo': 'Matthew',
  'Marcos': 'Mark',
  'Lucas': 'Luke',
  'Juan': 'John',
  'Hechos': 'Acts',
  'Romanos': 'Romans',
  'Corintios': 'Corinthians',
  'Gálatas': 'Galatians',
  'Galatas': 'Galatians',
  'Efesios': 'Ephesians',
  'Filipenses': 'Philippians',
  'Colosenses': 'Colossians',
  'Tesalonicenses': 'Thessalonians',
  'Timoteo': 'Timothy',
  'Tito': 'Titus',
  'Filemón': 'Philemon',
  'Filemon': 'Philemon',
  'Hebreos': 'Hebrews',
  'Santiago': 'James',
  'Pedro': 'Peter',
  'Judas': 'Jude',
  'Apocalipsis': 'Revelation'
};

export function BibleReferenceHandler({ language, contentSelector }: BibleReferenceHandlerProps) {
  const processedRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Log for debugging
    console.log(`BibleReferenceHandler initialized with language: ${language}`);
    console.log(`Looking for content with selector: ${contentSelector}`);
    
    // Process after a delay to ensure content is loaded
    const timer = setTimeout(() => {
      processReferences();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [language, contentSelector]);
  
  const processReferences = () => {
    console.log("Processing Bible references");
    const contentElement = document.querySelector(contentSelector);
    
    if (!contentElement) {
      console.warn(`Content element not found with selector: ${contentSelector}`);
      return;
    }
    
    console.log("Content element found, processing references");
    
    // Reset processed references when language changes
    processedRef.current.clear();
    
    // Select the appropriate regex based on language
    const regex = language === 'english' ? ENGLISH_REFERENCE_REGEX : SPANISH_REFERENCE_REGEX;
    console.log(`Using ${language} regex for Bible references`);
    
    // Process the elements
    processElement(contentElement, regex);
  };
  
  // Process the entire element for Bible references
  const processElement = (element: Element, regex: RegExp) => {
    // Get all text nodes to examine for Bible references
    const textNodes = getTextNodes(element);
    console.log(`Found ${textNodes.length} text nodes to process`);
    
    // Process each text node
    textNodes.forEach((node, index) => {
      const text = node.textContent || '';
      
      // Skip if node has no content
      if (!text.trim()) return;
      
      console.log(`Processing text node ${index}: ${text.substring(0, 30)}...`);
      
      // Get all matches
      const matches: RegExpExecArray[] = [];
      let match: RegExpExecArray | null;
      const clonedRegex = new RegExp(regex.source, regex.flags);
      
      while ((match = clonedRegex.exec(text)) !== null) {
        console.log(`Found Bible reference: ${match[0]}`);
        matches.push(match);
      }
      
      if (matches.length > 0) {
        console.log(`Found ${matches.length} Bible references in node ${index}`);
        
        // Process the matches
        let newHTML = text;
        matches.forEach(match => {
          const [fullMatch, book, chapter, verse, endVerse] = match;
          const referenceId = `${book}-${chapter}${verse ? `-${verse}` : ''}${endVerse ? `-${endVerse}` : ''}`;
          
          // Skip if already processed
          if (processedRef.current.has(referenceId)) return;
          processedRef.current.add(referenceId);
          
          const version = language === 'english' ? 'NASB' : 'NBLA';
          const tooltipContent = `<span class="bible-ref" data-version="${version}" data-book="${book}" data-chapter="${chapter}" data-verse="${verse || ''}" data-end-verse="${endVerse || ''}">${fullMatch}</span>`;
          
          // Replace the text
          newHTML = newHTML.replace(fullMatch, tooltipContent);
        });
        
        // Replace the text node with the new HTML if changes were made
        if (newHTML !== text) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newHTML;
          const parent = node.parentNode;
          if (parent) {
            while (tempDiv.firstChild) {
              parent.insertBefore(tempDiv.firstChild, node);
            }
            parent.removeChild(node);
          }
        }
      }
    });
    
    // Add event listeners to the references
    const references = document.querySelectorAll('.bible-ref');
    console.log(`Adding event listeners to ${references.length} Bible references`);
    
    references.forEach(reference => {
      reference.addEventListener('mouseenter', handleReferenceHover);
      reference.addEventListener('mouseleave', handleReferenceLeave);
    });
  };
  
  // Helper function to get all text nodes in an element
  const getTextNodes = (element: Element): Text[] => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        textNodes.push(node as Text);
      }
    }
    
    return textNodes;
  };
  
  // Handler for when user hovers over a reference
  const handleReferenceHover = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('bible-ref')) return;
    
    const book = target.getAttribute('data-book') || '';
    const chapter = target.getAttribute('data-chapter') || '';
    const verse = target.getAttribute('data-verse') || '';
    const endVerse = target.getAttribute('data-end-verse') || '';
    const version = target.getAttribute('data-version') || '';
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'bible-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.backgroundColor = '#111827';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '0.75rem';
    tooltip.style.borderRadius = '0.375rem';
    tooltip.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    tooltip.style.maxWidth = '300px';
    tooltip.style.fontSize = '0.875rem';
    
    // Set loading state
    tooltip.innerHTML = `
      <div class="bible-tooltip-header" style="font-weight: 700; margin-bottom: 0.5rem">
        ${book} ${chapter}${verse ? `:${verse}` : ''}${endVerse ? `-${endVerse}` : ''} (${version})
      </div>
      <div class="bible-tooltip-content">
        Loading...
      </div>
    `;
    
    // Position tooltip
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    
    // Add to DOM
    document.body.appendChild(tooltip);
    
    // Fetch verse content
    fetchVerseContent(book, chapter, verse, endVerse, language)
      .then(content => {
        const contentEl = tooltip.querySelector('.bible-tooltip-content');
        if (contentEl) {
          contentEl.innerHTML = content;
        }
      })
      .catch(error => {
        const contentEl = tooltip.querySelector('.bible-tooltip-content');
        if (contentEl) {
          contentEl.innerHTML = 'Error loading verse';
          console.error('Error fetching verse:', error);
        }
      });
    
    // Store reference to tooltip on target
    target.setAttribute('data-tooltip-id', Date.now().toString());
  };
  
  // Handler for when user stops hovering over a reference
  const handleReferenceLeave = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('bible-ref')) return;
    
    // Remove tooltip
    const tooltips = document.querySelectorAll('.bible-tooltip');
    tooltips.forEach(tooltip => {
      document.body.removeChild(tooltip);
    });
  };
  
  // Fetch verse content from API
  const fetchVerseContent = async (
    book: string,
    chapter: string,
    verse: string,
    endVerse: string,
    language: 'english' | 'spanish'
  ): Promise<string> => {
    try {
      // For demo, return some simulated content
      // In a production app, you would call a real Bible API
      
      let formattedBook = book;
      if (language === 'spanish') {
        // Convert Spanish book name to English for API compatibility
        formattedBook = SPANISH_TO_ENGLISH_BOOKS[book] || book;
      }
      
      return new Promise(resolve => {
        setTimeout(() => {
          let verseText;
          
          // Simulate Spanish/English content
          if (language === 'spanish') {
            if (book === 'Eclesiastés' || book === 'Eclesiastes') {
              if (chapter === '11' && verse === '9') {
                verseText = 'Alégrate, joven, en tu juventud, y tome placer tu corazón en los días de tu adolescencia; y anda en los caminos de tu corazón y en la vista de tus ojos; pero sabe, que sobre todas estas cosas te juzgará Dios.';
              } else if (chapter === '12' && verse === '1') {
                verseText = 'Acuérdate de tu Creador en los días de tu juventud, antes que vengan los días malos, y lleguen los años de los cuales digas: No tengo en ellos contentamiento.';
              } else {
                verseText = 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, más tenga vida eterna.';
              }
            } else {
              verseText = 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, más tenga vida eterna.';
            }
          } else {
            if (book === 'John' && chapter === '3' && verse === '16') {
              verseText = 'For God so loved the world, that He gave His only Son, that whoever believes in Him should not perish but have eternal life.';
            } else {
              verseText = 'For God so loved the world, that He gave His only Son, that whoever believes in Him should not perish but have eternal life.';
            }
          }
          
          resolve(`<p style="margin: 0;">${verseText}</p>`);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching verse:', error);
      return 'Error loading verse';
    }
  };

  return null;
}

export default BibleReferenceHandler;