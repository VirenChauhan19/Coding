import type { SeedCourse, SeedLesson, SeedExam, SeedQuestion } from "./types";

// Helper to keep boss exams consistent across languages.
function boss(language: string, questions: SeedQuestion[]): SeedExam {
  return {
    title: `🐉 ${language} Final Boss`,
    level: "ADVANCED",
    durationMinutes: 40,
    passingScore: 75,
    isBoss: true,
    xpReward: 600,
    questions,
  };
}

// ---------------------------------------------------------------------------
// JavaScript
// ---------------------------------------------------------------------------

const jsLessons: SeedLesson[] = [
  {
    slug: "js-basics", title: "Values & Variables", level: "BEGINNER", estMinutes: 10,
    content:
      "## let, const, var\n\nUse `const` for values that won't be reassigned and `let` when they will. Avoid `var`.\n\n```js\nconst name = \"Sam\";\nlet score = 0;\nscore = 10;\n```\n\nJavaScript types include number, string, boolean, null, undefined, object, and symbol.",
    codeExample: "const price = 9.99;\nlet qty = 3;\nconsole.log(price * qty); // 29.97",
    summary: "Declare with const/let. JS has dynamic types; prefer const by default.",
    prerequisites: ["You can declare variables with const/let", "You know the primitive types"],
    practice: [{
      title: "Double it", prompt: "Write `double(n)` returning n * 2.", language: "javascript",
      topic: "Variables", difficulty: "EASY",
      starterCode: "function double(n) {\n  // ...\n}\n", solution: "function double(n){return n*2;}",
      testCases: [{ input: "double(4)", expected: "8", description: "4 → 8" }],
    }],
    quizzes: [{ title: "JS Basics Quiz", questions: [
      { type: "MULTIPLE_CHOICE", topic: "Variables", difficulty: "EASY",
        prompt: "Which keyword creates a value that can't be reassigned?",
        options: ["let", "var", "const", "def"], answer: "const",
        explanation: "`const` bindings cannot be reassigned." },
    ]}],
  },
  {
    slug: "js-functions-arrays", title: "Functions & Arrays", level: "INTERMEDIATE", estMinutes: 14,
    content:
      "## Arrow functions & array methods\n\n```js\nconst nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // [2,4,6]\nconst total = nums.reduce((a, b) => a + b, 0); // 6\n```\n\n`map`, `filter`, and `reduce` are the workhorses of array transformation.",
    codeExample: "const evens = [1,2,3,4,5,6].filter(n => n % 2 === 0);\nconsole.log(evens); // [2,4,6]",
    summary: "Arrow functions are concise; map/filter/reduce transform arrays without manual loops.",
    prerequisites: ["You can write an arrow function", "You can use map/filter/reduce"],
    practice: [{
      title: "Sum even", prompt: "Write `sumEven(nums)` returning the sum of even numbers.",
      language: "javascript", topic: "Arrays", difficulty: "MEDIUM",
      starterCode: "function sumEven(nums) {\n  // ...\n}\n",
      solution: "function sumEven(nums){return nums.filter(n=>n%2===0).reduce((a,b)=>a+b,0);}",
      testCases: [
        { input: "sumEven([1,2,3,4])", expected: "6", description: "2+4 → 6" },
        { input: "sumEven([1,3,5])", expected: "0", description: "no evens → 0" },
      ],
    }],
    quizzes: [{ title: "Functions & Arrays Quiz", questions: [
      { type: "CODE_OUTPUT", topic: "Arrays", difficulty: "MEDIUM",
        prompt: "What is logged?", code: "console.log([1,2,3].map(n => n + 1).join(','));",
        answer: "2,3,4", explanation: "map adds 1 to each element." },
    ]}],
  },
  {
    slug: "js-async", title: "Async & Promises", level: "ADVANCED", estMinutes: 16,
    content:
      "## Promises and async/await\n\nAsynchronous code lets your program continue while waiting (e.g. network requests).\n\n```js\nasync function load() {\n  const data = await fetchData();\n  return data;\n}\n```\n\n`await` pauses inside an `async` function until the promise resolves.",
    codeExample: "const p = Promise.resolve(42);\np.then(v => console.log(v)); // 42",
    summary: "Promises represent future values; async/await makes asynchronous code read like synchronous code.",
    prerequisites: ["You understand what a Promise is", "You can use async/await"],
  },
];

const jsBossQuestions: SeedQuestion[] = [
  { type: "CODE_OUTPUT", topic: "Arrays", difficulty: "HARD",
    prompt: "What is logged?", code: "console.log([3,1,2].sort().join(''));",
    answer: "123", explanation: "Default sort is lexicographic; single digits sort to 1,2,3." },
  { type: "MULTIPLE_CHOICE", topic: "Async", difficulty: "HARD",
    prompt: "What does `await` require to be used (without top-level await)?",
    options: ["a loop", "an async function", "a class", "a promise constructor"],
    answer: "an async function", explanation: "`await` must be inside an async function." },
  { type: "TRUE_FALSE", topic: "Variables", difficulty: "MEDIUM",
    prompt: "`const` objects can still have their properties mutated.", answer: "true",
    explanation: "const prevents reassignment of the binding, not mutation of the object." },
  { type: "CODE_OUTPUT", topic: "Functions", difficulty: "HARD",
    prompt: "What is logged?", code: "const f = a => b => a + b;\nconsole.log(f(2)(3));",
    answer: "5", explanation: "Curried function: f(2) returns b => 2 + b, then (3) → 5." },
  { type: "FILL_BLANK", topic: "Arrays", difficulty: "MEDIUM",
    prompt: "Method that reduces an array to a single value: arr.____((a,b)=>a+b, 0)",
    answer: "reduce", explanation: "`reduce` folds an array into one value." },
  { type: "SHORT_ANSWER", topic: "Types", difficulty: "MEDIUM",
    prompt: "What does `typeof null` return in JavaScript?",
    answer: "object", explanation: "A historical quirk: typeof null is 'object'." },
];

// ---------------------------------------------------------------------------
// HTML/CSS
// ---------------------------------------------------------------------------

const htmlLessons: SeedLesson[] = [
  {
    slug: "html-structure", title: "HTML Structure", level: "BEGINNER", estMinutes: 10,
    content:
      "## Tags and elements\n\nHTML describes content with tags. A page has a head (metadata) and body (visible content).\n\n```html\n<h1>Title</h1>\n<p>A paragraph.</p>\n<a href=\"/\">A link</a>\n```\n\nSemantic tags like `<header>`, `<nav>`, `<main>`, and `<footer>` describe meaning.",
    codeExample: "<ul>\n  <li>First</li>\n  <li>Second</li>\n</ul>",
    summary: "HTML structures content with semantic tags. Head holds metadata; body holds visible content.",
    prerequisites: ["You can write headings, paragraphs, links, and lists"],
    quizzes: [{ title: "HTML Quiz", questions: [
      { type: "MULTIPLE_CHOICE", topic: "HTML", difficulty: "EASY",
        prompt: "Which tag creates the largest heading?",
        options: ["<h6>", "<head>", "<h1>", "<big>"], answer: "<h1>",
        explanation: "<h1> is the top-level heading." },
    ]}],
  },
  {
    slug: "css-layout", title: "CSS & Flexbox", level: "INTERMEDIATE", estMinutes: 14,
    content:
      "## Styling and layout\n\nCSS controls appearance. Flexbox arranges items in a row or column.\n\n```css\n.row {\n  display: flex;\n  gap: 1rem;\n  justify-content: space-between;\n}\n```\n\n`justify-content` aligns along the main axis; `align-items` along the cross axis.",
    codeExample: ".card { padding: 16px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }",
    summary: "CSS styles elements. Flexbox (display:flex) handles one-dimensional layout with justify/align.",
    prerequisites: ["You can select elements and set properties", "You can build a flex row"],
  },
  {
    slug: "css-responsive", title: "Responsive Design", level: "ADVANCED", estMinutes: 14,
    content:
      "## Media queries & grid\n\nResponsive design adapts to screen size.\n\n```css\n@media (max-width: 640px) {\n  .grid { grid-template-columns: 1fr; }\n}\n```\n\nCSS Grid handles two-dimensional layouts; media queries change rules at breakpoints.",
    codeExample: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }",
    summary: "Use media queries for breakpoints and CSS Grid for 2D layouts to build responsive pages.",
    prerequisites: ["You can write a media query", "You can build a grid layout"],
  },
];

const htmlBossQuestions: SeedQuestion[] = [
  { type: "MULTIPLE_CHOICE", topic: "HTML", difficulty: "MEDIUM",
    prompt: "Which attribute makes an image accessible to screen readers?",
    options: ["title", "alt", "aria", "src"], answer: "alt",
    explanation: "`alt` provides alternative text for images." },
  { type: "MULTIPLE_CHOICE", topic: "CSS", difficulty: "HARD",
    prompt: "Which CSS property establishes a flex container?",
    options: ["display: flex", "flex: 1", "position: flex", "layout: flex"],
    answer: "display: flex", explanation: "`display: flex` makes an element a flex container." },
  { type: "TRUE_FALSE", topic: "CSS", difficulty: "MEDIUM",
    prompt: "Media queries let you apply styles based on screen width.", answer: "true",
    explanation: "Media queries respond to viewport conditions like width." },
  { type: "FILL_BLANK", topic: "CSS", difficulty: "MEDIUM",
    prompt: "Property to add space between flex items: ____: 1rem;", answer: "gap",
    explanation: "`gap` sets spacing between flex/grid items." },
  { type: "SHORT_ANSWER", topic: "HTML", difficulty: "EASY",
    prompt: "What does CSS stand for?", answer: "cascading style sheets",
    explanation: "Cascading Style Sheets." },
];

// ---------------------------------------------------------------------------
// C++
// ---------------------------------------------------------------------------

const cppLessons: SeedLesson[] = [
  {
    slug: "cpp-basics", title: "Hello C++", level: "BEGINNER", estMinutes: 12,
    content:
      "## Your first program\n\nC++ is compiled and statically typed. Every program starts at `main()`.\n\n```cpp\n#include <iostream>\nint main() {\n  std::cout << \"Hello\" << std::endl;\n  return 0;\n}\n```\n\nVariables have explicit types: `int`, `double`, `char`, `bool`, `std::string`.",
    codeExample: "int x = 5;\ndouble pi = 3.14;\nstd::cout << x + pi; // 8.14",
    summary: "C++ is compiled and typed. Execution begins at main(); print with std::cout.",
    prerequisites: ["You can write a main() that prints", "You can declare typed variables"],
    quizzes: [{ title: "C++ Basics Quiz", questions: [
      { type: "MULTIPLE_CHOICE", topic: "C++", difficulty: "EASY",
        prompt: "Where does a C++ program start executing?",
        options: ["start()", "main()", "begin()", "run()"], answer: "main()",
        explanation: "Execution begins at the main() function." },
    ]}],
  },
  {
    slug: "cpp-pointers", title: "Pointers & References", level: "INTERMEDIATE", estMinutes: 16,
    content:
      "## Memory addresses\n\nA pointer stores a memory address. `&` gets an address; `*` dereferences.\n\n```cpp\nint x = 10;\nint* p = &x;\nstd::cout << *p; // 10\n```\n\nReferences (`int& r = x;`) are aliases for existing variables.",
    codeExample: "int a = 1;\nint& ref = a;\nref = 5;\nstd::cout << a; // 5",
    summary: "Pointers hold addresses (& to take, * to read). References are aliases to variables.",
    prerequisites: ["You can declare and dereference a pointer", "You understand references"],
  },
  {
    slug: "cpp-classes", title: "Classes & RAII", level: "ADVANCED", estMinutes: 18,
    content:
      "## Object-oriented C++\n\nClasses bundle data and behavior. Constructors/destructors enable RAII (Resource Acquisition Is Initialization).\n\n```cpp\nclass Counter {\n  int count = 0;\npublic:\n  void inc() { count++; }\n  int get() const { return count; }\n};\n```",
    codeExample: "Counter c;\nc.inc();\nc.inc();\nstd::cout << c.get(); // 2",
    summary: "Classes encapsulate state + behavior; RAII ties resource lifetime to object lifetime.",
    prerequisites: ["You can define a class with methods", "You understand constructors/destructors"],
  },
];

const cppBossQuestions: SeedQuestion[] = [
  { type: "MULTIPLE_CHOICE", topic: "C++", difficulty: "HARD",
    prompt: "What does the `*` operator do to a pointer?",
    options: ["takes its address", "dereferences it", "multiplies it", "deletes it"],
    answer: "dereferences it", explanation: "`*p` reads the value at the pointer's address." },
  { type: "MULTIPLE_CHOICE", topic: "C++", difficulty: "MEDIUM",
    prompt: "Which header is needed for std::cout?",
    options: ["<stdio>", "<iostream>", "<string>", "<vector>"], answer: "<iostream>",
    explanation: "std::cout lives in <iostream>." },
  { type: "TRUE_FALSE", topic: "C++", difficulty: "MEDIUM",
    prompt: "C++ is a statically typed language.", answer: "true",
    explanation: "Types are checked at compile time." },
  { type: "FILL_BLANK", topic: "C++", difficulty: "MEDIUM",
    prompt: "Operator to get a variable's address: ____x", answer: "&",
    explanation: "`&x` yields the address of x." },
  { type: "SHORT_ANSWER", topic: "C++", difficulty: "HARD",
    prompt: "What acronym describes tying resource lifetime to object lifetime?",
    answer: "raii", explanation: "RAII — Resource Acquisition Is Initialization." },
];

// ---------------------------------------------------------------------------
// Java
// ---------------------------------------------------------------------------

const javaLessons: SeedLesson[] = [
  {
    slug: "java-basics", title: "Java Fundamentals", level: "BEGINNER", estMinutes: 12,
    content:
      "## Classes and main\n\nEvery Java program lives in a class. Execution starts in `public static void main`.\n\n```java\npublic class App {\n  public static void main(String[] args) {\n    System.out.println(\"Hello\");\n  }\n}\n```\n\nJava is statically typed: `int x = 5;`",
    codeExample: "int a = 3;\nString name = \"Ada\";\nSystem.out.println(name + \" \" + a);",
    summary: "Java code lives in classes; main() is the entry point. Types are explicit and checked at compile time.",
    prerequisites: ["You can write a main method that prints", "You can declare typed variables"],
    quizzes: [{ title: "Java Basics Quiz", questions: [
      { type: "MULTIPLE_CHOICE", topic: "Java", difficulty: "EASY",
        prompt: "Which prints a line to the console in Java?",
        options: ["print()", "console.log()", "System.out.println()", "echo()"],
        answer: "System.out.println()", explanation: "System.out.println prints a line." },
    ]}],
  },
  {
    slug: "java-oop", title: "Objects & Inheritance", level: "INTERMEDIATE", estMinutes: 16,
    content:
      "## OOP in Java\n\nClasses define objects; `extends` enables inheritance.\n\n```java\nclass Animal { String sound() { return \"...\"; } }\nclass Dog extends Animal { String sound() { return \"Woof\"; } }\n```\n\nOverriding lets subclasses customize behavior.",
    codeExample: "Animal a = new Dog();\nSystem.out.println(a.sound()); // Woof",
    summary: "Java is class-based OOP. Use extends for inheritance and override methods for polymorphism.",
    prerequisites: ["You can define a class and create objects", "You understand inheritance"],
  },
  {
    slug: "java-generics", title: "Generics & Collections", level: "ADVANCED", estMinutes: 18,
    content:
      "## Type-safe collections\n\nGenerics let collections hold a specific type.\n\n```java\nList<String> names = new ArrayList<>();\nnames.add(\"Ada\");\n```\n\nThis catches type errors at compile time instead of runtime.",
    codeExample: "Map<String,Integer> ages = new HashMap<>();\nages.put(\"Ada\", 36);\nSystem.out.println(ages.get(\"Ada\")); // 36",
    summary: "Generics (<T>) make collections type-safe, catching mistakes at compile time.",
    prerequisites: ["You can use List/Map with generics", "You understand compile-time type safety"],
  },
];

const javaBossQuestions: SeedQuestion[] = [
  { type: "MULTIPLE_CHOICE", topic: "Java", difficulty: "MEDIUM",
    prompt: "Which keyword enables inheritance?",
    options: ["implements", "extends", "inherits", "super"], answer: "extends",
    explanation: "A subclass uses `extends` to inherit from a superclass." },
  { type: "TRUE_FALSE", topic: "Java", difficulty: "MEDIUM",
    prompt: "Java checks types at compile time.", answer: "true",
    explanation: "Java is statically typed." },
  { type: "FILL_BLANK", topic: "Java", difficulty: "MEDIUM",
    prompt: "Generic list of strings: ____<String> names = new ArrayList<>();",
    answer: "list", explanation: "List<String> declares a list of strings." },
  { type: "MULTIPLE_CHOICE", topic: "Java", difficulty: "HARD",
    prompt: "What is the signature of the entry point method?",
    options: ["void main()", "public static void main(String[] args)", "static main()", "int main()"],
    answer: "public static void main(String[] args)",
    explanation: "That exact signature is required to launch a Java app." },
  { type: "SHORT_ANSWER", topic: "Java", difficulty: "HARD",
    prompt: "What OOP feature lets a subclass replace a parent method's behavior? One word.",
    answer: "overriding|polymorphism", explanation: "Method overriding (a form of polymorphism)." },
];

// ---------------------------------------------------------------------------
// SQL
// ---------------------------------------------------------------------------

const sqlLessons: SeedLesson[] = [
  {
    slug: "sql-select", title: "SELECT Basics", level: "BEGINNER", estMinutes: 10,
    content:
      "## Querying data\n\nSQL reads data with `SELECT`. Filter rows with `WHERE`.\n\n```sql\nSELECT name, age\nFROM users\nWHERE age >= 18;\n```\n\nUse `*` to select all columns and `ORDER BY` to sort.",
    codeExample: "SELECT * FROM products WHERE price < 10 ORDER BY price;",
    summary: "SELECT chooses columns, FROM names the table, WHERE filters rows, ORDER BY sorts.",
    prerequisites: ["You can SELECT columns with a WHERE filter", "You can ORDER BY a column"],
    quizzes: [{ title: "SQL Basics Quiz", questions: [
      { type: "MULTIPLE_CHOICE", topic: "SQL", difficulty: "EASY",
        prompt: "Which clause filters rows?",
        options: ["FILTER", "WHERE", "HAVING", "ONLY"], answer: "WHERE",
        explanation: "`WHERE` filters rows before grouping." },
    ]}],
  },
  {
    slug: "sql-joins", title: "Joins & Aggregates", level: "INTERMEDIATE", estMinutes: 16,
    content:
      "## Combining tables\n\n`JOIN` combines rows from two tables on a matching key.\n\n```sql\nSELECT o.id, u.name\nFROM orders o\nJOIN users u ON u.id = o.user_id;\n```\n\nAggregate with COUNT, SUM, AVG and group with GROUP BY.",
    codeExample: "SELECT user_id, COUNT(*) AS orders\nFROM orders\nGROUP BY user_id;",
    summary: "JOIN links tables on keys; GROUP BY + aggregates (COUNT/SUM/AVG) summarize groups.",
    prerequisites: ["You can write an INNER JOIN", "You can GROUP BY with an aggregate"],
  },
  {
    slug: "sql-indexes", title: "Indexes & Performance", level: "ADVANCED", estMinutes: 14,
    content:
      "## Making queries fast\n\nIndexes speed up lookups at the cost of extra write time and storage.\n\n```sql\nCREATE INDEX idx_users_email ON users(email);\n```\n\nIndex columns you filter or join on frequently.",
    codeExample: "EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'a@b.com';",
    summary: "Indexes accelerate WHERE/JOIN lookups but slow writes. Index frequently-queried columns.",
    prerequisites: ["You can create an index", "You understand the read/write trade-off"],
  },
];

const sqlBossQuestions: SeedQuestion[] = [
  { type: "MULTIPLE_CHOICE", topic: "SQL", difficulty: "MEDIUM",
    prompt: "Which keyword combines rows from two tables?",
    options: ["MERGE", "JOIN", "LINK", "COMBINE"], answer: "JOIN",
    explanation: "`JOIN` merges rows across tables on a condition." },
  { type: "MULTIPLE_CHOICE", topic: "SQL", difficulty: "MEDIUM",
    prompt: "Which aggregate counts rows?",
    options: ["SUM()", "COUNT()", "TOTAL()", "ROWS()"], answer: "COUNT()",
    explanation: "`COUNT(*)` counts rows in a group." },
  { type: "TRUE_FALSE", topic: "SQL", difficulty: "MEDIUM",
    prompt: "Indexes always make a database faster overall.", answer: "false",
    explanation: "Indexes speed reads but slow writes and use storage." },
  { type: "FILL_BLANK", topic: "SQL", difficulty: "MEDIUM",
    prompt: "Clause that sorts results: SELECT * FROM t ____ BY name;", answer: "order",
    explanation: "ORDER BY sorts the result set." },
  { type: "SHORT_ANSWER", topic: "SQL", difficulty: "HARD",
    prompt: "Which clause groups rows for aggregation? Two words.",
    answer: "group by", explanation: "GROUP BY groups rows so aggregates apply per group." },
];

// ---------------------------------------------------------------------------
// Assemble courses
// ---------------------------------------------------------------------------

export const otherCourses: SeedCourse[] = [
  {
    slug: "javascript", language: "JavaScript", title: "JavaScript",
    description: "The language of the web — from variables to async.",
    icon: "🟨", color: "#f7df1e", order: 2,
    lessons: jsLessons, exams: [boss("JavaScript", jsBossQuestions)],
  },
  {
    slug: "html-css", language: "HTML/CSS", title: "HTML & CSS",
    description: "Structure and style beautiful, responsive web pages.",
    icon: "🎨", color: "#e34f26", order: 3,
    lessons: htmlLessons, exams: [boss("HTML/CSS", htmlBossQuestions)],
  },
  {
    slug: "cpp", language: "C++", title: "C++",
    description: "Systems programming with performance and control.",
    icon: "⚙️", color: "#00599c", order: 4,
    lessons: cppLessons, exams: [boss("C++", cppBossQuestions)],
  },
  {
    slug: "java", language: "Java", title: "Java",
    description: "Robust, object-oriented programming for everything.",
    icon: "☕", color: "#f89820", order: 5,
    lessons: javaLessons, exams: [boss("Java", javaBossQuestions)],
  },
  {
    slug: "sql", language: "SQL", title: "SQL",
    description: "Query, join, and analyze data in relational databases.",
    icon: "🗄️", color: "#336791", order: 6,
    lessons: sqlLessons, exams: [boss("SQL", sqlBossQuestions)],
  },
];
