import { useEffect, useState } from 'react';

interface SimpleBibleRefsProps {
  language: 'english' | 'spanish';
  contentSelector?: string;
}

interface BibleVerse {
  text: string;
  verse: string;
}

// Sample Bible verses for demonstration
const SAMPLE_VERSES: Record<string, Record<string, Record<string, BibleVerse[]>>> = {
  english: {
    John: {
      '3': [
        { verse: '16', text: 'For God so loved the world, that He gave His only Son, that whoever believes in Him should not perish but have eternal life.' },
        { verse: '17', text: 'For God did not send His Son into the world to condemn the world, but in order that the world might be saved through Him.' }
      ]
    },
    Romans: {
      '8': [
        { verse: '28', text: 'And we know that for those who love God all things work together for good, for those who are called according to His purpose.' }
      ]
    }
  },
  spanish: {
    Eclesiastés: {
      '11': [
        { verse: '7', text: 'La luz es agradable, y bueno es para los ojos ver el sol.' },
        { verse: '8', text: 'Aunque un hombre viva muchos años, regocíjese en todos ellos; pero recuerde los días de tinieblas, porque serán muchos. Todo lo que viene es vanidad.' },
        { verse: '9', text: 'Alégrate, joven, en tu juventud, y tome placer tu corazón en los días de tu adolescencia. Sigue los impulsos de tu corazón y el deseo de tus ojos, pero sabe que por todas estas cosas Dios te traerá a juicio.' },
        { verse: '10', text: 'Por tanto, quita de tu corazón el enojo y aparta el mal de tu carne, porque la juventud y la flor de la vida son vanidad.' }
      ],
      '12': [
        { verse: '1', text: 'Acuérdate, pues, de tu Creador en los días de tu juventud, antes que vengan los días malos, y se acerquen los años en que digas: No tengo en ellos placer.' },
        { verse: '2', text: 'Antes que se oscurezcan el sol y la luz, la luna y las estrellas, y las nubes vuelvan tras la lluvia;' },
        { verse: '3', text: 'el día cuando tiemblen los guardas de la casa, y se encorven los hombres fuertes, y las que muelen estén ociosas porque son pocas, y se nublen los que miran por las ventanas;' },
        { verse: '4', text: 'y las puertas de afuera se cierren, cuando baje el ruido del molino; cuando se levante uno al canto de un pájaro, y todas las hijas del canto sean abatidas;' },
        { verse: '5', text: 'cuando también teman a lo que es alto, y haya terrores en el camino; cuando florezca el almendro, y se arrastre la langosta, y la alcaparra pierda su efecto; porque el hombre va a su morada eterna, y los endechadores rondan por las calles;' },
        { verse: '6', text: 'antes que la cadena de plata se rompa, y se quiebre el cuenco de oro, y el cántaro se rompa junto a la fuente, y la rueda se rompa sobre el pozo,' },
        { verse: '7', text: 'entonces volverá el polvo a la tierra como lo que era, y el espíritu volverá a Dios que lo dio.' },
        { verse: '8', text: 'Vanidad de vanidades—dice el Predicador—todo es vanidad.' }
      ]
    }
  }
};

export default function SimpleBibleRefs({ language, contentSelector = '.markdown-content' }: SimpleBibleRefsProps) {
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Add a small delay to ensure content is rendered
    const timer = setTimeout(() => {
      processBibleReferences();
    }, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      // Remove tooltip
      const tooltip = document.getElementById('bible-tooltip');
      if (tooltip) document.body.removeChild(tooltip);
    };
  }, [language]);
  
  const processBibleReferences = () => {
    console.log(`Processing ${language} Bible references in ${contentSelector}`);
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) {
      console.log(`Content element not found: ${contentSelector}`);
      return;
    }
    
    // First, remove any existing Bible reference styling
    contentElement.querySelectorAll('.bible-ref').forEach(el => {
      const text = el.textContent || '';
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(text), el);
      }
    });
    
    // Remove event listeners
    document.removeEventListener('click', handleDocumentClick);
    document.addEventListener('click', handleDocumentClick);
    
    // Process text content for Bible references
    processNode(contentElement, language);
    
    // Add event listeners to Bible references
    contentElement.querySelectorAll('.bible-ref').forEach(el => {
      el.addEventListener('mouseenter', handleReferenceHover);
      el.addEventListener('mouseleave', handleReferenceLeave);
    });
    
    console.log(`Found ${contentElement.querySelectorAll('.bible-ref').length} Bible references`);
  };
  
  const handleDocumentClick = (e: MouseEvent) => {
    // Close tooltip when clicking outside
    const tooltip = document.getElementById('bible-tooltip');
    if (tooltip && e.target && !tooltip.contains(e.target as Node)) {
      // Make sure we're not clicking on a Bible reference
      if (!(e.target as Element).classList?.contains('bible-ref')) {
        tooltip.style.display = 'none';
      }
    }
  };
  
  const processNode = (node: Node, language: 'english' | 'spanish') => {
    // Process child nodes recursively
    const childNodes = Array.from(node.childNodes);
    for (const child of childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        processTextNode(child, language);
      } else if (child.nodeType === Node.ELEMENT_NODE && 
                 !['pre', 'code', 'script', 'style'].includes((child as Element).tagName.toLowerCase())) {
        processNode(child, language);
      }
    }
  };
  
  const processTextNode = (textNode: Node, language: 'english' | 'spanish') => {
    const text = textNode.textContent || '';
    
    // Skip empty text nodes
    if (!text.trim()) return;
    
    console.log("Text to process:", text);
    
    // Create specific regex for cross-chapter references like "Eclesiastés 11:7–12:8"
    // First check for this specific pattern before checking general patterns
    const crossChapterPattern = language === 'english'
      ? /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+(\d+):(\d+)[–—-](\d+):(\d+)/gi
      : /\b(Génesis|Genesis|Éxodo|Exodo|Levítico|Levitico|Números|Numeros|Deuteronomio|Josué|Josue|Jueces|Rut|Ruth|1\s*Samuel|2\s*Samuel|1\s*Reyes|2\s*Reyes|1\s*Crónicas|1\s*Cronicas|2\s*Crónicas|2\s*Cronicas|Esdras|Nehemías|Nehemias|Ester|Esther|Job|Salmo|Salmos|Proverbios|Eclesiastés|Eclesiastes|Cantares|Cantar\s*de\s*los\s*Cantares|Isaías|Isaias|Jeremías|Jeremias|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Amos|Abdías|Abdias|Jonás|Jonas|Miqueas|Nahúm|Nahum|Habacuc|Sofonías|Sofonias|Hageo|Zacarías|Zacarias|Malaquías|Malaquias|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1\s*Corintios|2\s*Corintios|Gálatas|Galatas|Efesios|Filipenses|Colosenses|1\s*Tesalonicenses|2\s*Tesalonicenses|1\s*Timoteo|2\s*Timoteo|Tito|Filemón|Filemon|Hebreos|Santiago|1\s*Pedro|2\s*Pedro|1\s*Juan|2\s*Juan|3\s*Juan|Judas|Apocalipsis)\s+(\d+):(\d+)[–—-](\d+):(\d+)/gi;
    
    // Process cross-chapter references first (like Eclesiastés 11:7–12:8)
    let crossChapterMatches: RegExpExecArray[] = [];
    let crossMatch: RegExpExecArray | null;
    const clonedCrossRegex = new RegExp(crossChapterPattern);
    
    while ((crossMatch = clonedCrossRegex.exec(text)) !== null) {
      console.log(`Found cross-chapter reference: ${crossMatch[0]}`);
      crossChapterMatches.push(crossMatch);
    }
    
    // Process normal references
    // Choose regex pattern based on language - enhanced to handle verse ranges with en-dashes
    const pattern = language === 'english' 
      ? /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+(\d+)(?::(\d+)(?:[-–—](\d+))?)?/gi
      : /\b(Génesis|Genesis|Éxodo|Exodo|Levítico|Levitico|Números|Numeros|Deuteronomio|Josué|Josue|Jueces|Rut|Ruth|1\s*Samuel|2\s*Samuel|1\s*Reyes|2\s*Reyes|1\s*Crónicas|1\s*Cronicas|2\s*Crónicas|2\s*Cronicas|Esdras|Nehemías|Nehemias|Ester|Esther|Job|Salmo|Salmos|Proverbios|Eclesiastés|Eclesiastes|Cantares|Cantar\s*de\s*los\s*Cantares|Isaías|Isaias|Jeremías|Jeremias|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Amos|Abdías|Abdias|Jonás|Jonas|Miqueas|Nahúm|Nahum|Habacuc|Sofonías|Sofonias|Hageo|Zacarías|Zacarias|Malaquías|Malaquias|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1\s*Corintios|2\s*Corintios|Gálatas|Galatas|Efesios|Filipenses|Colosenses|1\s*Tesalonicenses|2\s*Tesalonicenses|1\s*Timoteo|2\s*Timoteo|Tito|Filemón|Filemon|Hebreos|Santiago|1\s*Pedro|2\s*Pedro|1\s*Juan|2\s*Juan|3\s*Juan|Judas|Apocalipsis)\s+(\d+)(?::(\d+)(?:[-–—](\d+))?)?/gi;
    
    let lastIndex = 0;
    let fragments = [];
    
    // First process any cross-chapter references
    crossChapterMatches.forEach(match => {
      // Add text before the match
      if (match.index > lastIndex) {
        fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
      }
      
      // Extract reference details for cross-chapter reference
      const reference = match[0];
      const book = match[1];
      const startChapter = match[2];
      const startVerse = match[3];
      const endChapter = match[4];
      const endVerse = match[5];
      
      console.log(`Processing cross-chapter reference: ${book} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`);
      
      // Create a span for the Bible reference
      const span = document.createElement('span');
      span.className = 'bible-ref';
      span.textContent = reference;
      span.setAttribute('data-reference', reference);
      span.setAttribute('data-book', book);
      span.setAttribute('data-chapter', startChapter);
      span.setAttribute('data-verse', startVerse);
      span.setAttribute('data-end-verse', '');
      span.setAttribute('data-end-chapter', endChapter);
      span.setAttribute('data-end-chapter-verse', endVerse);
      span.style.color = language === 'english' ? '#3b82f6' : '#0ea5e9';
      span.style.textDecoration = 'underline';
      span.style.cursor = 'pointer';
      span.style.fontWeight = '500';
      span.title = language === 'english' 
        ? `Click to view ${reference}` 
        : `Click para ver ${reference}`;
      
      fragments.push(span);
      lastIndex = match.index + reference.length;
    });
    
    // Then process regular references
    let match;
    const regex = new RegExp(pattern);
    
    while ((match = regex.exec(text)) !== null) {
      // Skip if this part of text was already handled by a cross-chapter reference
      let alreadyProcessed = false;
      for (const crossMatch of crossChapterMatches) {
        if (match.index >= crossMatch.index && 
            match.index < crossMatch.index + crossMatch[0].length) {
          alreadyProcessed = true;
          break;
        }
      }
      
      if (alreadyProcessed) {
        console.log(`Skipping already processed reference: ${match[0]}`);
        continue;
      }
      
      // Add text before the match
      if (match.index > lastIndex) {
        fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
      }
      
      // Extract reference details
      const reference = match[0];
      const book = match[1];
      const chapter = match[2];
      const verse = match[3];
      const endVerse = match[4];
      
      console.log(`Processing regular reference: ${reference}`);
      
      // Create a span for the Bible reference
      const span = document.createElement('span');
      span.className = 'bible-ref';
      span.textContent = reference;
      span.setAttribute('data-reference', reference);
      span.setAttribute('data-book', book);
      span.setAttribute('data-chapter', chapter);
      span.setAttribute('data-verse', verse || '');
      span.setAttribute('data-end-verse', endVerse || '');
      span.setAttribute('data-end-chapter', '');
      span.style.color = language === 'english' ? '#3b82f6' : '#0ea5e9';
      span.style.textDecoration = 'underline';
      span.style.cursor = 'pointer';
      span.style.fontWeight = '500';
      span.title = language === 'english' 
        ? `Click to view ${reference}` 
        : `Click para ver ${reference}`;
      
      fragments.push(span);
      lastIndex = match.index + reference.length;
    }
    
    // If we made changes, replace the text node
    if (fragments.length > 0) {
      // Add any remaining text
      if (lastIndex < text.length) {
        fragments.push(document.createTextNode(text.substring(lastIndex)));
      }
      
      // Replace the text node with our fragments
      const parent = textNode.parentNode;
      if (parent) {
        for (const fragment of fragments) {
          parent.insertBefore(fragment, textNode);
        }
        parent.removeChild(textNode);
      }
    }
  };
  
  // Create or update tooltip
  const createOrUpdateTooltip = (reference: HTMLElement) => {
    const book = reference.getAttribute('data-book') || '';
    const chapter = reference.getAttribute('data-chapter') || '';
    const verse = reference.getAttribute('data-verse') || '';
    const endVerse = reference.getAttribute('data-end-verse') || '';
    const endChapter = reference.getAttribute('data-end-chapter') || '';
    const fullReference = reference.getAttribute('data-reference') || '';
    
    let tooltip = document.getElementById('bible-tooltip');
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'bible-tooltip';
      tooltip.className = 'bible-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.backgroundColor = '#111827';
      tooltip.style.color = '#f3f4f6';
      tooltip.style.padding = '1rem';
      tooltip.style.borderRadius = '0.5rem';
      tooltip.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      tooltip.style.maxWidth = '400px';
      tooltip.style.minWidth = '300px';
      tooltip.style.maxHeight = '400px';
      tooltip.style.overflowY = 'auto';
      tooltip.style.fontSize = '0.875rem';
      tooltip.style.lineHeight = '1.5';
      tooltip.style.border = '1px solid #374151';
      
      document.body.appendChild(tooltip);
    }
    
    // Set tooltip content
    const version = language === 'english' ? 'NASB' : 'NBLA';
    tooltip.innerHTML = `
      <div class="bible-tooltip-header" style="font-weight: 700; margin-bottom: 0.5rem; display:flex; justify-content:space-between; align-items:center">
        <span>${fullReference} (${version})</span>
        <button id="close-tooltip" style="border:none; background:transparent; color:#9ca3af; font-size:16px; cursor:pointer">×</button>
      </div>
      <div class="bible-tooltip-content" style="margin-bottom: 0.5rem">
        <div id="bible-verses" style="margin-bottom: 1rem; line-height: 1.6">
          Loading verses...
        </div>
        <a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(fullReference)}&version=${language === 'english' ? 'NASB' : 'NBLA'}" 
           target="_blank"
           style="color: #60a5fa; text-decoration: none; font-size: 0.75rem; display: inline-block;"
           rel="noopener noreferrer">
          ${language === 'english' ? 'View on Bible Gateway' : 'Ver en Bible Gateway'}
        </a>
      </div>
    `;
    
    // Position tooltip
    const rect = reference.getBoundingClientRect();
    const tooltipHeight = 250; // Approximate
    
    // Position below or above based on available space
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
      // Position above
      tooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 10}px`;
    } else {
      // Position below
      tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    }
    
    // Center horizontally relative to the reference
    tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 150}px`;
    
    // If tooltip would go off-screen to the right, adjust position
    const tooltipRight = rect.left + window.scrollX + (rect.width / 2) + 150;
    if (tooltipRight > window.innerWidth) {
      tooltip.style.left = `${window.innerWidth - 300 - 20}px`;
    }
    
    // If tooltip would go off-screen to the left, adjust position
    if (parseFloat(tooltip.style.left) < 20) {
      tooltip.style.left = '20px';
    }
    
    tooltip.style.display = 'block';
    
    // Add close button handler
    const closeButton = document.getElementById('close-tooltip');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (tooltip) tooltip.style.display = 'none';
      });
    }
    
    // Load verses
    fetchVerses(book, chapter, verse, endVerse, endChapter, language)
      .then(verses => {
        const versesContainer = document.getElementById('bible-verses');
        if (versesContainer) {
          if (verses.length === 0) {
            versesContainer.innerHTML = `<div style="color:#9ca3af">${language === 'english' ? 'Verses not available in demo' : 'Versículos no disponibles en demo'}</div>`;
          } else {
            versesContainer.innerHTML = verses.map(v => 
              `<div style="margin-bottom: 0.5rem">
                <span style="font-weight: 600; color: #9ca3af; margin-right: 0.25rem">${v.verse}</span>
                <span>${v.text}</span>
              </div>`
            ).join('');
          }
        }
      });
    
    return tooltip;
  };
  
  // Handler for when user hovers over a reference
  const handleReferenceHover = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('bible-ref')) return;
    
    const tooltip = createOrUpdateTooltip(target);
    setTooltipRef(tooltip);
  };
  
  // Handler for when user stops hovering over a reference
  const handleReferenceLeave = (e: Event) => {
    // We don't hide the tooltip on mouseleave to allow interaction with it
    // Tooltip will hide when clicking outside or explicitly closing
  };
  
  // Fetch verses from API or local data
  const fetchVerses = async (
    book: string,
    chapter: string,
    startVerse: string,
    endVerse: string,
    endChapter: string,
    language: 'english' | 'spanish'
  ): Promise<BibleVerse[]> => {
    // For demo purposes, we're using hard-coded sample verses
    // In a real app, you would call an API here
    
    try {
      // Check if we have data for this book
      const bookData = SAMPLE_VERSES[language][book];
      if (!bookData) {
        console.log(`No data for book: ${book} in ${language}`);
        return [];
      }
      
      // For cross-chapter references (e.g., 11:7-12:8)
      if (endChapter && endChapter !== chapter) {
        console.log(`Cross-chapter reference from ${chapter} to ${endChapter}`);
        
        // Get verses from first chapter
        let result: BibleVerse[] = [];
        
        // First chapter - from startVerse to end of chapter
        const firstChapterData = bookData[chapter];
        if (firstChapterData && startVerse) {
          const firstChapterVerses = firstChapterData.filter(v => {
            const verseNum = parseInt(v.verse);
            const start = parseInt(startVerse);
            return verseNum >= start;
          });
          
          // Add a chapter identifier to each verse
          result = result.concat(firstChapterVerses.map(v => ({
            ...v,
            verse: `${chapter}:${v.verse}`
          })));
        }
        
        // Add a section divider
        if (result.length > 0) {
          result.push({
            verse: '---',
            text: '...'
          });
        }
        
        // Last chapter - from beginning to endVerse 
        const lastChapterData = bookData[endChapter];
        if (lastChapterData) {
          const lastChapterVerses = lastChapterData.filter(v => {
            if (!endVerse) return true;
            const verseNum = parseInt(v.verse);
            const end = parseInt(endVerse);
            return verseNum <= end;
          }).slice(0, 4); // Limit to 4 verses for brevity
          
          // Add a chapter identifier to each verse
          result = result.concat(lastChapterVerses.map(v => ({
            ...v,
            verse: `${endChapter}:${v.verse}`
          })));
        }
        
        // If we found a substantial number of verses, add a note about truncation
        if (result.length > 8) {
          result = result.slice(0, 8); // Limit to 8 verses total
          result.push({
            verse: '...',
            text: language === 'english' 
              ? 'Click the link below to view the full passage.' 
              : 'Haga clic en el enlace a continuación para ver el pasaje completo.'
          });
        }
        
        return result;
      }
      
      // Standard single-chapter reference
      const chapterData = bookData[chapter];
      if (!chapterData) {
        console.log(`No data for chapter: ${chapter} in ${book}`);
        return [];
      }
      
      if (!startVerse) {
        // Return all verses for the chapter (limited to 8 for UI)
        const verses = chapterData.slice(0, 8);
        if (chapterData.length > 8) {
          verses.push({
            verse: '...',
            text: language === 'english' 
              ? 'Click the link below to view the full chapter.' 
              : 'Haga clic en el enlace a continuación para ver el capítulo completo.'
          });
        }
        return verses;
      }
      
      // If we have a verse range, filter accordingly
      if (startVerse && !endVerse) {
        // Single verse
        return chapterData.filter(v => v.verse === startVerse);
      }
      
      // Verse range within same chapter
      const filteredVerses = chapterData.filter(v => {
        const verseNum = parseInt(v.verse);
        const start = parseInt(startVerse);
        const end = endVerse ? parseInt(endVerse) : start;
        return verseNum >= start && verseNum <= end;
      });
      
      // Limit to 8 verses for UI
      if (filteredVerses.length > 8) {
        const limitedVerses = filteredVerses.slice(0, 8);
        limitedVerses.push({
          verse: '...',
          text: language === 'english' 
            ? 'Click the link below to view the full passage.' 
            : 'Haga clic en el enlace a continuación para ver el pasaje completo.'
        });
        return limitedVerses;
      }
      
      return filteredVerses;
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  };
  
  return null;
}