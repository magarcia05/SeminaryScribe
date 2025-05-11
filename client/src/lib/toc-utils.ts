// Function to create a slug from a heading text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace consecutive hyphens with a single hyphen
    .trim(); // Trim spaces at start and end
}

// Extract headings from markdown content
export function extractHeadings(markdown: string) {
  if (!markdown) return [];
  
  // Find all headings (# Heading) using regex
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const extractedHeadings: { id: string; text: string; level: number }[] = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    
    extractedHeadings.push({
      id,
      text,
      level
    });
  }
  
  return extractedHeadings;
}
