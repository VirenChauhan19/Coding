import type { SeedLesson } from "./types";

// Seven beginner lessons covering the core of Python. Practice problems use
// JavaScript so they execute live in the browser sandbox while reinforcing the
// same logic concepts (the runner simulates non-JS languages).

export const pythonLessons: SeedLesson[] = [
  {
    slug: "variables",
    title: "Variables",
    level: "BEGINNER",
    estMinutes: 8,
    content:
      "## What is a variable?\n\n" +
      "A **variable** is a name that points to a value. Think of it as a labeled box: you put a value inside and refer to it by the label later.\n\n" +
      "In Python you create a variable just by assigning to it with `=`. No type declaration needed.\n\n" +
      "```python\nname = \"Ada\"\nage = 36\n```\n\n" +
      "Here `name` holds the text `\"Ada\"` and `age` holds the number `36`.\n\n" +
      "## Naming rules\n\n" +
      "- Use lowercase with underscores: `first_name`.\n" +
      "- Start with a letter or underscore, never a number.\n" +
      "- Names are case-sensitive: `score` and `Score` are different.\n\n" +
      "## Reassigning\n\n" +
      "Variables can change. The box keeps the **last** value you put in it.",
    codeExample:
      "score = 10\nprint(score)   # 10\n\nscore = score + 5\nprint(score)   # 15\n\ngreeting = \"Hello, \" + name\nprint(greeting)",
    summary:
      "Variables are named references to values. Assign with `=`, name them clearly with snake_case, and reassign whenever you need to update the value.",
    prerequisites: [
      "You can create a variable and print it",
      "You understand that re-assigning replaces the old value",
      "You can name variables using snake_case",
    ],
    practice: [
      {
        title: "Swap two values",
        prompt:
          "Given variables `a = 1` and `b = 2`, swap them so `a` becomes 2 and `b` becomes 1, then log `a` and `b`. Return the function `swap` that returns [a, b] after swapping.",
        language: "javascript",
        topic: "Variables",
        difficulty: "EASY",
        starterCode:
          "function swap(a, b) {\n  // return [a, b] with the values swapped\n}\n",
        solution: "function swap(a, b) {\n  return [b, a];\n}",
        testCases: [
          { input: "swap(1, 2).join(',')", expected: "2,1", description: "swap(1,2) → [2,1]" },
          { input: "swap(5, 9).join(',')", expected: "9,5", description: "swap(5,9) → [9,5]" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Variables Quiz",
        questions: [
          {
            type: "MULTIPLE_CHOICE",
            prompt: "Which is a valid Python variable name?",
            options: ["2nd_place", "first name", "first_name", "class"],
            answer: "first_name",
            explanation:
              "Names can't start with a number, contain spaces, or be reserved words like `class`. `first_name` follows snake_case.",
            topic: "Variables",
            difficulty: "EASY",
          },
          {
            type: "CODE_OUTPUT",
            prompt: "What is printed?",
            code: "x = 4\nx = x + 6\nprint(x)",
            answer: "10",
            explanation: "`x` starts at 4, then is reassigned to 4 + 6 = 10.",
            topic: "Variables",
            difficulty: "EASY",
          },
          {
            type: "TRUE_FALSE",
            prompt: "Python requires you to declare a variable's type before using it.",
            answer: "false",
            explanation: "Python is dynamically typed — assignment alone creates the variable.",
            topic: "Variables",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },

  {
    slug: "data-types",
    title: "Data Types",
    level: "BEGINNER",
    estMinutes: 10,
    content:
      "## The core types\n\n" +
      "Every value in Python has a **type**. The ones you'll use most:\n\n" +
      "- `int` — whole numbers: `7`, `-3`\n" +
      "- `float` — decimals: `3.14`\n" +
      "- `str` — text in quotes: `\"hi\"`\n" +
      "- `bool` — `True` or `False`\n\n" +
      "Use `type(value)` to check a value's type.\n\n" +
      "## Converting between types\n\n" +
      "`int(\"5\")` turns text into a number; `str(5)` turns a number into text. Mixing types without converting causes errors:\n\n" +
      "```python\n\"Age: \" + 5      # ❌ TypeError\n\"Age: \" + str(5) # ✅ \"Age: 5\"\n```",
    codeExample:
      "price = 9.99          # float\nquantity = 3          # int\nname = \"Widget\"       # str\nin_stock = True       # bool\n\nprint(type(price))    # <class 'float'>\ntotal = price * quantity\nprint(\"Total:\", total)",
    summary:
      "Python's main types are int, float, str, and bool. Check with `type()` and convert explicitly with `int()`, `str()`, `float()` before combining different types.",
    prerequisites: [
      "You can name the four core types",
      "You can convert a string to an int and back",
      "You understand why \"3\" + 4 is an error",
    ],
    practice: [
      {
        title: "Sum digits as numbers",
        prompt:
          "Write `addStrings(a, b)` that receives two numeric strings and returns their numeric sum (a number, not concatenation). e.g. addStrings('3','4') → 7.",
        language: "javascript",
        topic: "Data Types",
        difficulty: "EASY",
        starterCode: "function addStrings(a, b) {\n  // convert and add\n}\n",
        solution: "function addStrings(a, b) {\n  return Number(a) + Number(b);\n}",
        testCases: [
          { input: "addStrings('3','4')", expected: "7", description: "'3' + '4' → 7" },
          { input: "addStrings('10','5')", expected: "15", description: "'10' + '5' → 15" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Data Types Quiz",
        questions: [
          {
            type: "MULTIPLE_CHOICE",
            prompt: "What is the type of `3.0` in Python?",
            options: ["int", "float", "str", "bool"],
            answer: "float",
            explanation: "A number written with a decimal point is a `float`.",
            topic: "Data Types",
            difficulty: "EASY",
          },
          {
            type: "FILL_BLANK",
            prompt: "Fill the blank to convert the string to a number: total = ____(\"42\")",
            answer: "int",
            explanation: "`int(\"42\")` converts the text \"42\" to the integer 42.",
            topic: "Data Types",
            difficulty: "EASY",
          },
          {
            type: "DEBUG",
            prompt:
              "This raises a TypeError. What single function wraps `age` to fix it? Answer with just the function name.",
            code: "age = 5\nprint(\"Age: \" + age)",
            answer: "str",
            explanation: "Wrap the int in `str(age)` so it can be concatenated with text.",
            topic: "Data Types",
            difficulty: "MEDIUM",
          },
        ],
      },
    ],
  },

  {
    slug: "if-statements",
    title: "If Statements",
    level: "BEGINNER",
    estMinutes: 12,
    content:
      "## Making decisions\n\n" +
      "`if` runs a block **only when** a condition is true. Add `elif` for more cases and `else` for everything left over.\n\n" +
      "```python\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\n```\n\n" +
      "## Comparisons & logic\n\n" +
      "- `==` equal, `!=` not equal\n" +
      "- `<`, `>`, `<=`, `>=`\n" +
      "- Combine with `and`, `or`, `not`\n\n" +
      "## Indentation matters\n\n" +
      "Python uses **indentation** (4 spaces) to know which lines belong to the `if`. Mixing tabs and spaces causes errors.",
    codeExample:
      "temp = 30\n\nif temp > 25 and temp < 35:\n    print(\"Pleasant weather\")\nelif temp >= 35:\n    print(\"Too hot\")\nelse:\n    print(\"Bring a jacket\")",
    summary:
      "`if`/`elif`/`else` choose which block to run based on conditions. Use comparison operators and combine them with and/or/not. Indentation defines the block.",
    prerequisites: [
      "You can write an if/elif/else chain",
      "You understand and/or/not",
      "You know indentation defines the block",
    ],
    practice: [
      {
        title: "FizzBuzz check",
        prompt:
          "Write `fizzbuzz(n)`: return 'FizzBuzz' if n divisible by 15, 'Fizz' if by 3, 'Buzz' if by 5, otherwise the number as a string.",
        language: "javascript",
        topic: "If Statements",
        difficulty: "MEDIUM",
        starterCode: "function fizzbuzz(n) {\n  // your conditions here\n}\n",
        solution:
          "function fizzbuzz(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return String(n);\n}",
        testCases: [
          { input: "fizzbuzz(15)", expected: "FizzBuzz", description: "15 → FizzBuzz" },
          { input: "fizzbuzz(9)", expected: "Fizz", description: "9 → Fizz" },
          { input: "fizzbuzz(10)", expected: "Buzz", description: "10 → Buzz" },
          { input: "fizzbuzz(7)", expected: "7", description: "7 → '7'" },
        ],
      },
    ],
    quizzes: [
      {
        title: "If Statements Quiz",
        questions: [
          {
            type: "CODE_OUTPUT",
            prompt: "What is printed?",
            code: "x = 7\nif x % 2 == 0:\n    print(\"even\")\nelse:\n    print(\"odd\")",
            answer: "odd",
            explanation: "7 % 2 is 1 (not 0), so the else branch runs.",
            topic: "If Statements",
            difficulty: "EASY",
          },
          {
            type: "MULTIPLE_CHOICE",
            prompt: "Which keyword handles an additional condition between if and else?",
            options: ["elseif", "elif", "else if", "when"],
            answer: "elif",
            explanation: "Python uses `elif` (short for 'else if').",
            topic: "If Statements",
            difficulty: "EASY",
          },
          {
            type: "TRUE_FALSE",
            prompt: "`and` returns True only when both sides are True.",
            answer: "true",
            explanation: "`and` is true only if both operands are true.",
            topic: "If Statements",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },

  {
    slug: "loops",
    title: "Loops",
    level: "BEGINNER",
    estMinutes: 12,
    content:
      "## Repeating work\n\n" +
      "Loops repeat code. Python has two:\n\n" +
      "**`for`** — iterate over a sequence:\n" +
      "```python\nfor i in range(3):\n    print(i)   # 0, 1, 2\n```\n\n" +
      "**`while`** — repeat while a condition holds:\n" +
      "```python\nn = 3\nwhile n > 0:\n    print(n)\n    n -= 1\n```\n\n" +
      "## Controlling loops\n\n" +
      "- `break` exits the loop early.\n" +
      "- `continue` skips to the next iteration.\n\n" +
      "Beware **infinite loops**: always make sure a `while` condition will eventually become false.",
    codeExample:
      "total = 0\nfor number in [10, 20, 30]:\n    total += number\nprint(\"Sum:\", total)   # Sum: 60\n\nfor i in range(1, 6):\n    if i == 4:\n        break\n    print(i)            # 1 2 3",
    summary:
      "`for` loops walk through sequences; `while` loops run until a condition is false. Use `range()` for counting, and `break`/`continue` to control flow. Avoid infinite loops.",
    prerequisites: [
      "You can write a for loop with range()",
      "You can write a while loop that terminates",
      "You know what break and continue do",
    ],
    practice: [
      {
        title: "Sum to N",
        prompt: "Write `sumTo(n)` returning 1 + 2 + ... + n using a loop.",
        language: "javascript",
        topic: "Loops",
        difficulty: "EASY",
        starterCode: "function sumTo(n) {\n  let total = 0;\n  // loop here\n  return total;\n}\n",
        solution:
          "function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) total += i;\n  return total;\n}",
        testCases: [
          { input: "sumTo(5)", expected: "15", description: "1..5 → 15" },
          { input: "sumTo(10)", expected: "55", description: "1..10 → 55" },
          { input: "sumTo(1)", expected: "1", description: "1 → 1" },
        ],
      },
      {
        title: "Count vowels",
        prompt: "Write `countVowels(s)` returning how many vowels (a,e,i,o,u) are in the string.",
        language: "javascript",
        topic: "Loops",
        difficulty: "MEDIUM",
        starterCode: "function countVowels(s) {\n  // loop over characters\n}\n",
        solution:
          "function countVowels(s) {\n  let c = 0;\n  for (const ch of s.toLowerCase()) {\n    if ('aeiou'.includes(ch)) c++;\n  }\n  return c;\n}",
        testCases: [
          { input: "countVowels('hello')", expected: "2", description: "hello → 2" },
          { input: "countVowels('sky')", expected: "0", description: "sky → 0" },
          { input: "countVowels('Education')", expected: "5", description: "Education → 5" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Loops Quiz",
        questions: [
          {
            type: "CODE_OUTPUT",
            prompt: "How many numbers does this print?",
            code: "for i in range(2, 8):\n    print(i)",
            answer: "6",
            explanation: "range(2, 8) yields 2,3,4,5,6,7 — six values (stop is exclusive).",
            topic: "Loops",
            difficulty: "MEDIUM",
          },
          {
            type: "MULTIPLE_CHOICE",
            prompt: "Which statement skips the rest of the current iteration and continues looping?",
            options: ["break", "continue", "pass", "return"],
            answer: "continue",
            explanation: "`continue` jumps to the next iteration; `break` exits entirely.",
            topic: "Loops",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },

  {
    slug: "functions",
    title: "Functions",
    level: "BEGINNER",
    estMinutes: 12,
    content:
      "## Reusable blocks\n\n" +
      "A **function** packages code so you can reuse it. Define with `def`, call by name.\n\n" +
      "```python\ndef greet(name):\n    return \"Hello, \" + name\n\nmessage = greet(\"Sam\")\n```\n\n" +
      "## Parameters & return\n\n" +
      "- **Parameters** are inputs in the parentheses.\n" +
      "- `return` sends a value back. Without it, a function returns `None`.\n\n" +
      "## Default arguments\n\n" +
      "```python\ndef power(base, exp=2):\n    return base ** exp\n\npower(5)     # 25\npower(5, 3)  # 125\n```",
    codeExample:
      "def area(width, height):\n    return width * height\n\nprint(area(3, 4))     # 12\n\ndef shout(text=\"hi\"):\n    return text.upper() + \"!\"\n\nprint(shout())        # HI!\nprint(shout(\"go\"))    # GO!",
    summary:
      "Functions (`def`) package reusable logic. They take parameters, optionally with defaults, and send results back with `return`. No return means the function gives `None`.",
    prerequisites: [
      "You can define a function with parameters",
      "You can return a value and use it",
      "You understand default arguments",
    ],
    practice: [
      {
        title: "Max of three",
        prompt: "Write `maxOfThree(a, b, c)` returning the largest of the three numbers.",
        language: "javascript",
        topic: "Functions",
        difficulty: "EASY",
        starterCode: "function maxOfThree(a, b, c) {\n  // return the largest\n}\n",
        solution: "function maxOfThree(a, b, c) {\n  return Math.max(a, b, c);\n}",
        testCases: [
          { input: "maxOfThree(1, 9, 4)", expected: "9", description: "→ 9" },
          { input: "maxOfThree(7, 2, 7)", expected: "7", description: "→ 7" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Functions Quiz",
        questions: [
          {
            type: "MULTIPLE_CHOICE",
            prompt: "What keyword defines a function in Python?",
            options: ["function", "def", "fun", "define"],
            answer: "def",
            explanation: "Python uses `def` to define functions.",
            topic: "Functions",
            difficulty: "EASY",
          },
          {
            type: "CODE_OUTPUT",
            prompt: "What is printed?",
            code: "def f(x):\n    x + 1\n\nprint(f(5))",
            answer: "None",
            explanation: "The function computes x + 1 but never returns it, so it returns None.",
            topic: "Functions",
            difficulty: "MEDIUM",
          },
          {
            type: "SHORT_ANSWER",
            prompt: "In one or two words, what does a function send back to the caller?",
            answer: "return|return value",
            explanation: "A function sends back a return value using the `return` statement.",
            topic: "Functions",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },

  {
    slug: "lists",
    title: "Lists",
    level: "BEGINNER",
    estMinutes: 12,
    content:
      "## Ordered collections\n\n" +
      "A **list** holds multiple values in order, written in square brackets:\n\n" +
      "```python\nfruits = [\"apple\", \"banana\", \"cherry\"]\n```\n\n" +
      "## Indexing\n\n" +
      "Access items by position, starting at **0**. Negative indexes count from the end.\n\n" +
      "```python\nfruits[0]    # \"apple\"\nfruits[-1]   # \"cherry\"\n```\n\n" +
      "## Common operations\n\n" +
      "- `append(x)` add to the end\n" +
      "- `len(list)` count items\n" +
      "- `list[1:3]` slice a sub-list\n" +
      "- `for item in list:` loop over items",
    codeExample:
      "scores = [80, 92, 75]\nscores.append(100)\nprint(len(scores))    # 4\nprint(scores[0])      # 80\nprint(scores[-1])     # 100\n\nfor s in scores:\n    print(s)",
    summary:
      "Lists are ordered, changeable collections in []. Index from 0 (negatives from the end), slice with [a:b], grow with append(), and measure with len().",
    prerequisites: [
      "You can create and index a list",
      "You can append items and get the length",
      "You can loop over a list",
    ],
    practice: [
      {
        title: "Average of a list",
        prompt: "Write `average(nums)` returning the mean of the array (rounded down with Math.floor).",
        language: "javascript",
        topic: "Lists",
        difficulty: "MEDIUM",
        starterCode: "function average(nums) {\n  // sum then divide\n}\n",
        solution:
          "function average(nums) {\n  let sum = 0;\n  for (const n of nums) sum += n;\n  return Math.floor(sum / nums.length);\n}",
        testCases: [
          { input: "average([2,4,6])", expected: "4", description: "→ 4" },
          { input: "average([10,20,35])", expected: "21", description: "→ 21 (floor)" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Lists Quiz",
        questions: [
          {
            type: "CODE_OUTPUT",
            prompt: "What is printed?",
            code: "nums = [5, 6, 7, 8]\nprint(nums[1])",
            answer: "6",
            explanation: "Index 1 is the second item, 6 (indexing starts at 0).",
            topic: "Lists",
            difficulty: "EASY",
          },
          {
            type: "FILL_BLANK",
            prompt: "Fill the method to add 9 to the end: nums.____(9)",
            answer: "append",
            explanation: "`append(9)` adds 9 to the end of the list.",
            topic: "Lists",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },

  {
    slug: "dictionaries",
    title: "Dictionaries",
    level: "BEGINNER",
    estMinutes: 12,
    content:
      "## Key–value pairs\n\n" +
      "A **dictionary** maps keys to values, written with curly braces:\n\n" +
      "```python\nstudent = {\"name\": \"Ada\", \"age\": 36}\n```\n\n" +
      "## Accessing & updating\n\n" +
      "```python\nstudent[\"name\"]        # \"Ada\"\nstudent[\"age\"] = 37     # update\nstudent[\"city\"] = \"NYC\"  # add new key\n```\n\n" +
      "## Useful methods\n\n" +
      "- `keys()`, `values()`, `items()`\n" +
      "- `dict.get(key, default)` avoids errors when a key is missing\n\n" +
      "Loop over a dict to visit each key:\n" +
      "```python\nfor key in student:\n    print(key, student[key])\n```",
    codeExample:
      "prices = {\"apple\": 3, \"banana\": 1}\nprint(prices[\"apple\"])         # 3\nprices[\"cherry\"] = 5            # add\nprint(prices.get(\"pear\", 0))   # 0 (missing)\n\nfor item, price in prices.items():\n    print(item, \"=\", price)",
    summary:
      "Dictionaries store key→value pairs in {}. Read/update with dict[key], add new keys by assignment, and use .get() for safe lookups. Iterate with .items().",
    prerequisites: [
      "You can create a dict and read a value by key",
      "You can add and update keys",
      "You can use .get() and loop with .items()",
    ],
    practice: [
      {
        title: "Word count",
        prompt:
          "Write `wordCount(words)` taking an array of words and returning the count of the most frequent word.",
        language: "javascript",
        topic: "Dictionaries",
        difficulty: "HARD",
        starterCode: "function wordCount(words) {\n  const counts = {};\n  // tally then return the max count\n}\n",
        solution:
          "function wordCount(words) {\n  const counts = {};\n  let max = 0;\n  for (const w of words) {\n    counts[w] = (counts[w] || 0) + 1;\n    if (counts[w] > max) max = counts[w];\n  }\n  return max;\n}",
        testCases: [
          { input: "wordCount(['a','b','a'])", expected: "2", description: "a appears twice" },
          { input: "wordCount(['x','y','z'])", expected: "1", description: "all unique → 1" },
        ],
      },
    ],
    quizzes: [
      {
        title: "Dictionaries Quiz",
        questions: [
          {
            type: "MULTIPLE_CHOICE",
            prompt: "How do you safely read a key that might not exist?",
            options: ["d[key]", "d.get(key, default)", "d.read(key)", "d.find(key)"],
            answer: "d.get(key, default)",
            explanation: "`.get()` returns a default instead of raising a KeyError.",
            topic: "Dictionaries",
            difficulty: "MEDIUM",
          },
          {
            type: "CODE_OUTPUT",
            prompt: "What is printed?",
            code: "d = {\"a\": 1, \"b\": 2}\nd[\"a\"] = 5\nprint(d[\"a\"])",
            answer: "5",
            explanation: "Assigning to an existing key updates its value to 5.",
            topic: "Dictionaries",
            difficulty: "EASY",
          },
        ],
      },
    ],
  },
];
