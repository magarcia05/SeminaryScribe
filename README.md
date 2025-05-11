# Seminary Notes Platform

A modern, multilingual platform for seminary students to share and access course notes in an organized and searchable manner. The application supports both English and Spanish content, with specialized handling of biblical references.

## Overview

This application provides:

- **Organized Course Structure**: Notes are organized by courses, making it easy to find materials
- **Bible Reference Detection**: Automatic detection and enhancement of Bible references with tooltips
- **Multilingual Support**: Full support for both English and Spanish content
- **Search Functionality**: Search across all notes to find specific content
- **Markdown Rendering**: Rich text formatting with support for headings, lists, tables, and more
- **Mobile-Friendly Design**: Responsive layout that works well on all devices

## How to Contribute Notes

### Adding a New Course

1. Create a new folder in the `courses` directory with a unique ID (no spaces, use camelCase or kebab-case)
2. Create a `course.json` file inside the folder with the following structure:

```json
{
  "name": "Course Name",
  "description": "Brief description of the course",
  "icon": "book", 
  "language": "english" 
}
```

Notes:
- For `icon`, use any name from [Lucide Icons](https://lucide.dev/icons/)
- For `language`, use either "english" or "spanish"

### Adding Notes to a Course

1. Create a markdown (.md) file in the course folder
2. Use the following title format at the beginning of your file:

```markdown
# Lectura X - Title of Your Note
```

Where X is the lecture number (ensures notes are sorted properly).

3. Structure your content with Markdown:
   - Use `##` for section headings
   - Use `*` or `-` for bullet points
   - Use `1.`, `2.`, etc. for numbered lists
   - Use `**bold**` for bold text, `*italic*` for italics

Example note file:

```markdown
# Lectura 38 - Jonah - The Reluctant Prophet

## 1. Theme
This lecture explores the story of Jonah and his reluctance to fulfill God's calling.

## 2. Key Points
- **Divine Call**: God calls Jonah to preach to Nineveh
- **Initial Response**: Jonah flees in the opposite direction
- **Divine Intervention**: The storm and the great fish
- **Repentance**: Jonah's prayer and deliverance
- **Mission Fulfilled**: Preaching to Nineveh and their repentance
- **Jonah's Reaction**: Anger and God's lesson about compassion

## 3. Biblical Texts
- Jonah 1:1-3
- Jonah 3:4-5
- Matthew 12:39-41
```

### Bible References

The platform will automatically detect Bible references in your notes. No special formatting is required - simply write references as you normally would:

- Genesis 1:1
- John 3:16-18
- 1 Cor 13:4-7
- Eclesiastés 9:9-10

The system will display the appropriate translation based on the language:
- English notes: NASB translation
- Spanish notes: NBLA translation

### Important Tips

1. **Lecture Numbers**: Always include the lecture number in the title for proper sorting
2. **Consistent Formatting**: Maintain a consistent structure across your notes
3. **File Names**: Use meaningful file names (e.g., `jonah-reluctant-prophet.md`)
4. **Language Consistency**: Keep notes in a single language (don't mix English and Spanish in one note)
5. **Preview Your Work**: After adding content, check how it appears on the website

## Technical Details for Developers

### Application Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `courses/`: Course content (markdown files)
- `shared/`: Shared types and schemas

### Running the Application

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at http://localhost:5000

### Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Data Storage**: File-based (markdown files and JSON metadata)
- **Special Features**: Bible reference detection, multilingual support

## License

This project is licensed under the MIT License - see the LICENSE file for details.