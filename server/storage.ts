import { Course, InsertCourse, Note, InsertNote, Tag, InsertTag, NoteTag, InsertNoteTag } from "@shared/schema";
import fs from "fs";
import path from "path";
import { promisify } from "util";

export interface IStorage {
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Note operations
  getNotes(): Promise<Note[]>;
  getNotesByCourse(courseId: number): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  
  // Tag operations
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // NoteTag operations
  getNoteTagsByNoteId(noteId: number): Promise<NoteTag[]>;
  getNoteTagsByTagId(tagId: number): Promise<NoteTag[]>;
  createNoteTag(noteTag: InsertNoteTag): Promise<NoteTag>;
  
  // Search
  searchNotes(query: string): Promise<Note[]>;
}

export class MemStorage implements IStorage {
  private courses: Map<number, Course>;
  private notes: Map<number, Note>;
  private tags: Map<number, Tag>;
  private noteTags: Map<number, NoteTag>;
  private coursesId: number;
  private notesId: number;
  private tagsId: number;
  private noteTagsId: number;
  
  constructor() {
    this.courses = new Map();
    this.notes = new Map();
    this.tags = new Map();
    this.noteTags = new Map();
    this.coursesId = 1;
    this.notesId = 1;
    this.tagsId = 1;
    this.noteTagsId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  private async initSampleData() {
    // Create sample courses
    const newTestament = await this.createCourse({
      name: "New Testament",
      description: "Study of the New Testament books, their historical context, authorship, and theological themes.",
      icon: "book-open"
    });
    
    const oldTestament = await this.createCourse({
      name: "Old Testament",
      description: "Exploration of the Old Testament scriptures, their cultural context, and theological significance.",
      icon: "book"
    });
    
    const antiguoTestamento = await this.createCourse({
      name: "Antiguo Testamento II",
      description: "Estudio avanzado del Antiguo Testamento, enfocado en literatura sapiencial y libros proféticos.",
      icon: "book"
    });
    
    const churchHistory = await this.createCourse({
      name: "Church History",
      description: "Survey of the major events, figures, and movements in the history of Christianity.",
      icon: "church"
    });
    
    const spiritualFormation = await this.createCourse({
      name: "Spiritual Formation",
      description: "Study of spiritual disciplines and practices for spiritual growth and ministry.",
      icon: "praying-hands"
    });
    
    const systematicTheology = await this.createCourse({
      name: "Systematic Theology",
      description: "Comprehensive study of the major doctrines of the Christian faith.",
      icon: "brain"
    });
    
    // Create sample notes for the New Testament course
    const johnGospelContent = `# Introduction to the Gospel of John

> "In the beginning was the Word, and the Word was with God, and the Word was God."
> 
> — John 1:1

The Gospel of John is the fourth gospel in the New Testament canon. Unlike the Synoptic Gospels (Matthew, Mark, and Luke), John presents a unique theological perspective on Jesus' life and ministry. John's Gospel emphasizes Jesus' divine nature and contains several lengthy discourses that are absent from the Synoptics.

## Authorship and Date

Traditional attribution identifies the author as John, one of the Twelve Apostles. Modern scholarship often refers to the anonymous author as "the Evangelist" or "the Beloved Disciple." The Gospel was likely composed between 90-110 CE, making it the latest of the canonical gospels.

Key points about authorship:

* Internal evidence suggests the author was an eyewitness to Jesus' ministry
* Early church tradition unanimously attributed the Gospel to John the Apostle
* Some scholars propose that the Gospel went through multiple stages of composition
* The Johannine community may have influenced the final form of the text

## Theological Themes

The Gospel of John contains several distinctive theological emphases:

### 1. Christology

John presents the highest Christology among the gospels, emphasizing Jesus' divinity through:

* The Logos concept (John 1:1-18)
* Seven "I Am" statements connecting Jesus to divine identity
* Pre-existence of Christ before creation
* Unity with the Father ("I and the Father are one")

### 2. Dualism

John frequently employs dualistic language and concepts:

| Positive | Negative |
|----------|----------|
| Light    | Darkness |
| Truth    | Falsehood|
| Life     | Death    |
| Above    | Below    |
| Spirit   | Flesh    |

### 3. Signs

John structures his narrative around seven miraculous "signs" that reveal Jesus' glory:

1. Turning water into wine (2:1-11)
2. Healing the official's son (4:46-54)
3. Healing the paralytic at Bethesda (5:1-15)
4. Feeding the 5,000 (6:1-15)
5. Walking on water (6:16-21)
6. Healing the man born blind (9:1-41)
7. Raising Lazarus from the dead (11:1-44)

## Literary Structure

The Gospel can be divided into four major sections:

#### Prologue (1:1-18)

The theological introduction to the Gospel, establishing Jesus' cosmic identity as the Word (Logos) who became flesh.

#### Book of Signs (1:19-12:50)

Jesus' public ministry, structured around the seven miraculous signs and accompanying discourses.

#### Book of Glory (13:1-20:31)

The Passion narrative, including the Last Supper, crucifixion, and resurrection appearances.

#### Epilogue (Chapter 21)

A supplementary chapter describing a post-resurrection appearance by the Sea of Galilee and addressing the fate of the Beloved Disciple.

## Comparison with Synoptic Gospels

John's Gospel differs substantially from the Synoptic Gospels in several ways:

\`\`\`
// Notable differences:
- No birth narrative
- No parables (in the traditional sense)
- No account of the Transfiguration
- No institution of the Eucharist at the Last Supper
- Different timeline for the cleansing of the Temple
- Extended discourses rather than brief sayings
- Passion chronology places crucifixion on day of Passover preparation
\`\`\`

## Johannine Community

The Gospel appears to have been written for a specific Christian community with its own theological perspectives and challenges:

* Evidence of conflict with the synagogue (9:22, 12:42, 16:2)
* Engagement with early Gnostic or proto-Gnostic ideas
* Development of a high Christology in response to external pressures
* Possible connection to the Johannine epistles (1-3 John)

---

## Key Passages for Further Study

* The Prologue (1:1-18)
* Conversation with Nicodemus (3:1-21)
* The Woman at the Well (4:1-42)
* The Bread of Life Discourse (6:22-59)
* The Good Shepherd (10:1-18)
* Raising of Lazarus (11:1-44)
* The Farewell Discourse (14-17)
* The Resurrection Appearances (20-21)`;

    await this.createNote({
      title: "The Gospel of John",
      content: johnGospelContent,
      courseId: newTestament.id
    });
    
    await this.createNote({
      title: "Pauline Epistles",
      content: "# Pauline Epistles\n\nThe Pauline epistles are the fourteen books in the New Testament traditionally attributed to Paul the Apostle.\n\n## Undisputed Letters\n\nScholars generally agree that Paul actually wrote seven of the Pauline epistles, but that four were written by followers of Paul in his name. Six additional letters bearing Paul's name do not currently receive widespread scholarly support.\n\nThe undisputed letters are:\n1. Romans\n2. 1 & 2 Corinthians\n3. Galatians\n4. Philippians\n5. 1 Thessalonians\n6. Philemon\n\n## Major Themes\n\n* Justification by faith\n* The law and gospel\n* Eschatology\n* Christology\n* Ecclesiology",
      courseId: newTestament.id
    });
    
    await this.createNote({
      title: "Pentateuch Overview",
      content: "# The Pentateuch\n\nThe Pentateuch consists of the first five books of the Old Testament: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.\n\n## Authorship\n\nTraditionally attributed to Moses, modern scholarship generally holds that the Pentateuch was compiled from several sources over centuries.\n\n## Major Themes\n\n* Creation and Fall\n* Covenant relationship\n* Law and holiness\n* Promise and fulfillment\n* Journey and deliverance",
      courseId: oldTestament.id
    });
    
    await this.createNote({
      title: "Eclesiastés: El Poema de la Juventud",
      content: `# Resumen de la Clase: Eclesiastés - El Poema de la Juventud (Lectura 33)

## 1. Tema Principal
La clase analiza el poema de Eclesiastés 11:7–12:8, que reflexiona sobre la juventud y la vejez, exhortando a los jóvenes a disfrutar la vida con gratitud, recordar a su Creador y vivir conscientes del juicio divino, mientras reconoce la vanidad de la vida frente a la muerte.

## 2. Puntos Clave
- **Juventud y Gozo**: Los jóvenes deben regocijarse en su vigor, pero recordar que los "días de tinieblas" (vejez y muerte) llegarán y que Dios juzgará sus acciones (11:7–9).
- **Vanidad de la Juventud**: La juventud es breve y pasajera, descrita como "vanidad" porque se desvanece rápidamente (11:10).
- **Vejez y Decaimiento**: La vejez trae fragilidad física y pérdida de capacidades, ilustrada con metáforas poéticas (12:1–7).
- **Llamado a Recordar a Dios**: Se exhorta a recordar al Creador en la juventud, antes de que la vejez y la muerte limiten el disfrute de la vida (12:1).
- **Sabiduría y Juicio**: El Predicador, como pastor mesiánico, enseña sabiduría para vivir correctamente, concluyendo que temer a Dios y guardar sus mandamientos es el deber del hombre, pues todo será juzgado (12:9–14).

## 3. Resumen General

### Contexto del Poema: Juventud y Vejez (Eclesiastés 11:7–12:8)
- El instructor introduce el poema de Eclesiastés 11:7–12:8 como una reflexión sobre la juventud y la vejez, destacando su belleza literaria y relevancia teológica.
- Cita a Billy Graham (o un anciano similar) para ilustrar que cada generación siente que envejecer es un tema poco tratado, pero la Biblia, especialmente este pasaje, lo aborda directamente.
- Salomón, como el Predicador, ofrece sabiduría sobre cómo vivir la juventud con gozo y la vejez con perspectiva, reconociendo la vanidad de la vida y la certeza del juicio divino.

### La Dulzura de la Juventud (Eclesiastés 11:7–9)
- En 11:7, Salomón declara: "Agradable es la luz, y bueno para los ojos ver el sol", describiendo la juventud como un tiempo dulce y placentero.
- En 11:8, exhorta a regocijarse durante muchos años, pero advierte que "los días de tinieblas serán muchos", refiriéndose a la vejez y la muerte, y concluye que "todo lo porvenir es vanidad".
- En 11:9, anima a los jóvenes: "Alégrate, joven, en tu juventud… sigue los impulsos de tu corazón y el gusto de tus ojos", pero advierte que "Dios te traerá a juicio" por todas estas cosas.
- El instructor interpreta que esta exhortación no promueve libertinaje, sino un disfrute responsable, con la conciencia de que Dios juzgará las acciones, sirviendo como un "freno" para los impulsos juveniles.

### La Brevedad de la Juventud (Eclesiastés 11:10)
- En 11:10, Salomón aconseja: "Aparta de tu corazón la congoja y aleja el sufrimiento del cuerpo, porque la mocedad y la primavera de la vida son vanidad".
- El instructor explica que "vanidad" aquí se refiere a la brevedad de la juventud, que pasa rápidamente, como lo ilustra con su experiencia personal: se mudó al seminario en 2008 a los 34 años, sintiéndose joven, pero siete años después, acercándose a los 41, siente el paso del tiempo.
- Esta brevedad implica que los jóvenes deben disfrutar la vida ahora, sabiendo que la vejez y los "días de tinieblas" llegarán pronto.

### Exhortación a Recordar al Creador (Eclesiastés 12:1)
- En 12:1, Salomón urge: "Acuérdate de tu Creador en los días de tu juventud, antes que vengan los días malos y se acerquen los años en que digas: No tengo en ellos placer".
- El instructor interpreta que los "días malos" son la vejez, cuando el cuerpo pierde vitalidad y la vida se vuelve menos placentera, enfatizando la importancia de establecer una relación con Dios en la juventud.

### La Fragilidad de la Vejez (Eclesiastés 12:2–7)
- En 12:2–7, Salomón usa metáforas poéticas para describir el deterioro físico de la vejez:
  - **12:2**: "Antes que se oscurezca el sol, la luna y las estrellas, y vuelvan las nubes tras la lluvia", refiriéndose a la pérdida de la vista y la incapacidad de disfrutar la luz.
  - **12:3**: "El día cuando tiemblen los guardas de la casa" (los brazos, antes fuertes, ahora frágiles), "los fuertes se encorven" (hombres robustos encorvados por la edad), "las que muelen estén ociosas" (dientes que ya no muelen por ser pocos), y "se nublen los que miran por las ventanas" (ojos que pierden visión).
  - **12:4**: "Se cierren las puertas de la calle" (oídos que no oyen el bullicio) y "se levante uno al canto del ave" (insomnio en la vejez, despertado por pequeños ruidos), con "las hijas del canto abatidas" (voces de cantantes, como las de 2:8, que pierden su vigor).
  - **12:5**: "Teman a la altura y los terrores en el camino" (miedo a caídas o riesgos), "florezca el almendro" (canas blancas como flores), "la langosta se arrastre" (movimientos lentos por rodillas débiles), y "la alcaparra pierda su efecto" (pérdida del deseo sexual).
  - **12:6–7**: "Se rompa el hilo de plata, se quiebre el cuenco de oro, se rompa el cántaro junto a la fuente" (metáforas de la muerte), hasta que "el polvo vuelva a la tierra como lo que era, y el espíritu vuelva a Dios que lo dio".
- El instructor destaca la belleza de estas metáforas, que ilustran la fragilidad y la inevitabilidad de la muerte, reforzando la vanidad de la vida: "Vanidad de vanidades, todo es vanidad" (12:8).

### Sabiduría del Predicador (Eclesiastés 12:9–11)
- En 12:9–11, se describe al Predicador como sabio, que "enseñó sabiduría al pueblo, ponderó, investigó y compuso muchos proverbios" (12:9), buscando "palabras agradables" y "palabras de verdad" (12:10).
- Sus palabras son como "aguijones" que incitan a la acción correcta y como "clavos bien clavados" por un pastor, indicando precisión y propósito (12:11).
- El instructor subraya el marco mesiánico: el Predicador, hijo de David y rey de Jerusalén, actúa como pastor inspirado por el Espíritu Santo, guiando al pueblo con enseñanzas que fomentan disfrutar la vida, recordar a Dios y vivir para Su gloria.

### Conclusión: Temer a Dios (Eclesiastés 12:12–14)
- En 12:12, el Predicador advierte: "El hacer muchos libros no tiene fin, y demasiada dedicación a ellos es fatiga del cuerpo", sugiriendo moderación en el estudio excesivo.
- En 12:13–14, concluye: "Teme a Dios y guarda sus mandamientos, porque esto concierne a toda persona. Porque Dios traerá toda obra a juicio, junto con todo lo oculto, sea bueno o malo".
- El instructor conecta esta conclusión con el mensaje del libro: disfrutar la comida, la bebida y el trabajo como dones de Dios, recordar al Creador y vivir con temor a Dios, conscientes del juicio final.
- Cierra con una bendición de 2 Corintios 13:14, afirmando la relevancia teológica de Eclesiastés para la vida cristiana.

## 4. Citas Bíblicas Relevantes
- **Eclesiastés 11:7–8**: "Agradable es la luz, y bueno para los ojos ver el sol… pero recuerda que los días de tinieblas serán muchos. Todo lo porvenir es vanidad."
- **Eclesiastés 11:9**: "Alégrate, joven, en tu juventud… pero debe saber que por todas esas cosas Dios te traerá a juicio."
- **Eclesiastés 11:10**: "Aparta de tu corazón la congoja y aleja el daño del cuerpo, porque la mocedad y la primavera de la vida son vanidad."
- **Eclesiastés 12:1**: "Acuérdate de tu Creador en los días de tu juventud, antes que vengan los días malos…"
- **Eclesiastés 12:2–7**: "Antes que se oscurezca el sol… el polvo vuelva a la tierra como lo que era, y el espíritu vuelva a Dios que lo dio."
- **Eclesiastés 12:8**: "Vanidad de vanidades, dice el Predicador, todo es vanidad."
- **Eclesiastés 12:9–11**: "El Predicador… enseñó sabiduría al pueblo… Las palabras de los sabios son como aguijones… dadas por un pastor."
- **Eclesiastés 12:12–14**: "El hacer muchos libros no tiene fin… Teme a Dios y guarda sus mandamientos… Dios traerá toda obra a juicio…"
- **2 Corintios 13:14**: "La gracia del Señor Jesucristo, el amor de Dios y la comunión del Espíritu Santo sean con todos vosotros."

## 5. Notas de Estudio
- **Pregunta de Reflexión**: ¿Cómo puedes aplicar la exhortación de recordar a tu Creador en la juventud (12:1) en tu vida diaria? ¿Qué prácticas espirituales podrían ayudarte a vivir consciente del juicio divino mientras disfrutas la vida?
- **Conexión con el Curso**: Compara el poema de Eclesiastés 11:7–12:8 con otros textos del Antiguo Testamento que abordan la juventud y la vejez, como Salmos 90 (la brevedad de la vida) o Proverbios 1–9 (sabiduría para los jóvenes). ¿Cómo enriquece Eclesiastés estas perspectivas?
- **Investigación Adicional**: Analiza las metáforas de 12:2–7 en su contexto literario y teológico. Consulta comentarios como el de *The Book of Ecclesiastes* de Tremper Longman III o *Ecclesiastes* de Craig Bartholomew para explorar su significado.
- **Aplicación Personal**: Reflexiona sobre un aspecto de tu vida (e.g., estudios, trabajo, relaciones) donde sientas la "dulzura" de la juventud. ¿Cómo puedes vivirlo con gratitud y temor a Dios, sabiendo que es pasajero?
- **Observación Teológica**: El marco mesiánico del Predicador como pastor (12:11) sugiere un vínculo con el Mesías como pastor en Juan 10:11. Explora cómo la enseñanza de Salomón prefigura el pastoreo de Cristo en el Nuevo Testamento.

## 6. Conclusión
La clase sobre "Eclesiastés: El Poema de la Juventud" ofrece una profunda meditación sobre la fugacidad de la vida, exhortando a los jóvenes a disfrutar su vigor con gratitud, recordar a su Creador y vivir con temor a Dios ante el juicio final. A través de un poema literariamente bello, Salomón, como pastor mesiánico, guía al pueblo hacia una vida equilibrada que abraza los dones divinos mientras reconoce la vanidad de la existencia.`,
      courseId: antiguoTestamento.id
    });
    
    await this.createNote({
      title: "Reformation History",
      content: "# The Protestant Reformation\n\nThe Protestant Reformation was a 16th century religious movement that sought to reform the Roman Catholic Church, leading to the establishment of Protestant churches.\n\n## Key Figures\n\n* Martin Luther\n* John Calvin\n* Huldrych Zwingli\n* John Knox\n\n## Core Principles\n\n* Sola Scriptura (Scripture alone)\n* Sola Fide (Faith alone)\n* Sola Gratia (Grace alone)\n* Solus Christus (Christ alone)\n* Soli Deo Gloria (Glory to God alone)",
      courseId: churchHistory.id
    });
    
    // Create sample tags
    const gospelTag = await this.createTag({ name: "gospel" });
    const theologyTag = await this.createTag({ name: "theology" });
    const jesusTag = await this.createTag({ name: "jesus" });
    const exegesisTag = await this.createTag({ name: "exegesis" });
    const historyTag = await this.createTag({ name: "history" });
    
    // Associate tags with notes
    const gospelNote = await this.getNote(1);
    const paulineNote = await this.getNote(2);
    const pentateuchNote = await this.getNote(3);
    const reformationNote = await this.getNote(4);
    
    if (gospelNote) {
      await this.createNoteTag({ noteId: gospelNote.id, tagId: gospelTag.id });
      await this.createNoteTag({ noteId: gospelNote.id, tagId: theologyTag.id });
      await this.createNoteTag({ noteId: gospelNote.id, tagId: jesusTag.id });
      await this.createNoteTag({ noteId: gospelNote.id, tagId: exegesisTag.id });
    }
    
    if (paulineNote) {
      await this.createNoteTag({ noteId: paulineNote.id, tagId: theologyTag.id });
      await this.createNoteTag({ noteId: paulineNote.id, tagId: exegesisTag.id });
    }
    
    if (pentateuchNote) {
      await this.createNoteTag({ noteId: pentateuchNote.id, tagId: theologyTag.id });
      await this.createNoteTag({ noteId: pentateuchNote.id, tagId: historyTag.id });
    }
    
    if (reformationNote) {
      await this.createNoteTag({ noteId: reformationNote.id, tagId: historyTag.id });
      await this.createNoteTag({ noteId: reformationNote.id, tagId: theologyTag.id });
    }
  }
  
  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.coursesId++;
    const now = new Date().toISOString();
    const newCourse: Course = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }
  
  // Note operations
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }
  
  async getNotesByCourse(courseId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.courseId === courseId);
  }
  
  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const id = this.notesId++;
    const now = new Date().toISOString();
    const newNote: Note = { 
      ...note, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.notes.set(id, newNote);
    return newNote;
  }
  
  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote: Note = { 
      ...existingNote, 
      ...note, 
      updatedAt: new Date().toISOString() 
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  
  // Tag operations
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.name === name);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const id = this.tagsId++;
    const newTag: Tag = { ...tag, id };
    this.tags.set(id, newTag);
    return newTag;
  }
  
  // NoteTag operations
  async getNoteTagsByNoteId(noteId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(noteTag => noteTag.noteId === noteId);
  }
  
  async getNoteTagsByTagId(tagId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(noteTag => noteTag.tagId === tagId);
  }
  
  async createNoteTag(noteTag: InsertNoteTag): Promise<NoteTag> {
    const id = this.noteTagsId++;
    const newNoteTag: NoteTag = { ...noteTag, id };
    this.noteTags.set(id, newNoteTag);
    return newNoteTag;
  }
  
  // Search functionality
  async searchNotes(query: string): Promise<Note[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(note => {
      return (
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.content.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }
}

// If using filesystem storage for markdown files
export class FileSystemStorage implements IStorage {
  private courses: Map<number, Course>;
  private notes: Map<number, Note>;
  private tags: Map<number, Tag>;
  private noteTags: Map<number, NoteTag>;
  private coursesId: number;
  private notesId: number;
  private tagsId: number;
  private noteTagsId: number;
  private notesDir: string;
  
  constructor(notesDir: string) {
    this.courses = new Map();
    this.notes = new Map();
    this.tags = new Map();
    this.noteTags = new Map();
    this.coursesId = 1;
    this.notesId = 1;
    this.tagsId = 1;
    this.noteTagsId = 1;
    this.notesDir = notesDir;
    
    // Create the notes directory if it doesn't exist
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir, { recursive: true });
    }
  }
  
  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.coursesId++;
    const newCourse: Course = { ...course, id };
    this.courses.set(id, newCourse);
    
    // Create a directory for the course
    const courseDir = path.join(this.notesDir, id.toString());
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
    }
    
    return newCourse;
  }
  
  // Note operations
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }
  
  async getNotesByCourse(courseId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.courseId === courseId);
  }
  
  async getNote(id: number): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    // Read the content from the file
    const filePath = this.getNoteFilePath(note.courseId, id);
    if (fs.existsSync(filePath)) {
      const content = await promisify(fs.readFile)(filePath, 'utf8');
      return { ...note, content };
    }
    
    return note;
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const id = this.notesId++;
    const now = new Date().toISOString();
    const newNote: Note = { 
      ...note, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.notes.set(id, newNote);
    
    // Write the content to a file
    const filePath = this.getNoteFilePath(note.courseId, id);
    await promisify(fs.writeFile)(filePath, note.content, 'utf8');
    
    return newNote;
  }
  
  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote: Note = { 
      ...existingNote, 
      ...note, 
      updatedAt: new Date().toISOString() 
    };
    this.notes.set(id, updatedNote);
    
    // Update the file if content was changed
    if (note.content) {
      const filePath = this.getNoteFilePath(updatedNote.courseId, id);
      await promisify(fs.writeFile)(filePath, note.content, 'utf8');
    }
    
    return updatedNote;
  }
  
  // Tag operations
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.name === name);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const id = this.tagsId++;
    const newTag: Tag = { ...tag, id };
    this.tags.set(id, newTag);
    return newTag;
  }
  
  // NoteTag operations
  async getNoteTagsByNoteId(noteId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(noteTag => noteTag.noteId === noteId);
  }
  
  async getNoteTagsByTagId(tagId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(noteTag => noteTag.tagId === tagId);
  }
  
  async createNoteTag(noteTag: InsertNoteTag): Promise<NoteTag> {
    const id = this.noteTagsId++;
    const newNoteTag: NoteTag = { ...noteTag, id };
    this.noteTags.set(id, newNoteTag);
    return newNoteTag;
  }
  
  // Search functionality
  async searchNotes(query: string): Promise<Note[]> {
    const lowerCaseQuery = query.toLowerCase();
    const matches: Note[] = [];
    
    // Get all notes first
    const allNotes = await this.getNotes();
    
    // For each note, read its content and check for matches
    for (const note of allNotes) {
      const filePath = this.getNoteFilePath(note.courseId, note.id);
      if (fs.existsSync(filePath)) {
        const content = await promisify(fs.readFile)(filePath, 'utf8');
        
        if (
          note.title.toLowerCase().includes(lowerCaseQuery) ||
          content.toLowerCase().includes(lowerCaseQuery)
        ) {
          matches.push({ ...note, content });
        }
      }
    }
    
    return matches;
  }
  
  // Helper to get the path for a note file
  private getNoteFilePath(courseId: number, noteId: number): string {
    return path.join(this.notesDir, courseId.toString(), `${noteId}.md`);
  }
}

// Use in-memory storage for the application
export const storage = new MemStorage();
