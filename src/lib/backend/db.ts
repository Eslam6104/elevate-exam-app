import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// ─── Types ────────────────────────────────────────────────
export interface DbUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePhoto: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbDiploma {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DbQuestion {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: DbAnswer[];
}

export interface DbExam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
  questionsCount: number;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbAuditLog {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: string;
  category: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  httpMethod: string;
  path: string;
}

export interface DbSubmission {
  id: string;
  userId: string;
  examId: string;
  answers: Array<{ questionId: string; answerId: string }>;
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
}

export interface Database {
  users: DbUser[];
  diplomas: DbDiploma[];
  exams: DbExam[];
  questions: DbQuestion[];
  submissions: DbSubmission[];
  auditLogs: DbAuditLog[];
  otpCodes: Record<string, { code: string; expiresAt: number }>;
  resetTokens: Record<string, { email: string; expiresAt: number }>;
  emailChanges: Record<string, { newEmail: string; code: string; expiresAt: number }>;
  uploadedImages: Record<string, string>;
}

// ─── In-Memory Database ──────────────────────────────────
function createDatabase(): Database {
  const db: Database = {
    users: [],
    diplomas: [],
    exams: [],
    questions: [],
    submissions: [],
    auditLogs: [],
    otpCodes: {},
    resetTokens: {},
    emailChanges: {},
    uploadedImages: {},
  };

  const now = new Date().toISOString();
  const pastDate = (hoursAgo: number) => new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();

  // ── 1. Seed Users ──
  const adminId = uuidv4();
  const studentId = uuidv4();
  const sarahId = uuidv4();

  db.users.push(
    {
      id: adminId,
      username: "admin",
      email: "admin@exam-platform.com",
      password: bcrypt.hashSync("Admin@123", 10),
      firstName: "Super",
      lastName: "Admin",
      phone: "01012345678",
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      emailVerified: true,
      phoneVerified: true,
      role: "admin",
      createdAt: pastDate(240),
      updatedAt: pastDate(10),
    },
    {
      id: studentId,
      username: "student",
      email: "student@exam-platform.com",
      password: bcrypt.hashSync("Student@123", 10),
      firstName: "Alex",
      lastName: "Johnson",
      phone: "01098765432",
      profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      emailVerified: true,
      phoneVerified: true,
      role: "student",
      createdAt: pastDate(120),
      updatedAt: pastDate(5),
    },
    {
      id: sarahId,
      username: "sarah",
      email: "sarah@exam-platform.com",
      password: bcrypt.hashSync("Student@123", 10),
      firstName: "Sarah",
      lastName: "Miller",
      phone: "01122334455",
      profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      emailVerified: true,
      phoneVerified: true,
      role: "student",
      createdAt: pastDate(80),
      updatedAt: pastDate(2),
    }
  );

  // ── 2. Seed Diplomas ──
  const diplomaDefs = [
    {
      title: "Web Development",
      description: "Master modern web development from HTML5/CSS3 and TypeScript to React 19, Next.js, and serverless backends.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Data Science & Artificial Intelligence",
      description: "Comprehensive track covering Python, scientific data analysis, statistical modeling, machine learning, and deep neural networks.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Mobile App Development",
      description: "Build robust, cross-platform mobile apps for iOS and Android using Flutter, Dart, React Native, and mobile architecture best practices.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cyber Security & Ethical Hacking",
      description: "Learn penetration testing, network defense, threat modeling, modern cryptography, and secure authentication systems.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cloud Computing & DevOps",
      description: "Automate build and deployment pipelines with Docker, Kubernetes, Terraform, AWS cloud services, and CI/CD workflows.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "UI/UX Design & Product Architecture",
      description: "User research methodologies, wireframing, interactive prototyping in Figma, and design systems for enterprise web applications.",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const diplomaIds: string[] = [];
  diplomaDefs.forEach((d, idx) => {
    const id = uuidv4();
    diplomaIds.push(id);
    db.diplomas.push({
      id,
      title: d.title,
      description: d.description,
      image: d.image,
      immutable: false,
      createdAt: pastDate(200 - idx * 10),
      updatedAt: pastDate(20 - idx * 2),
    });
  });

  // ── 3. Seed Exams & Realistic Questions ──
  const examDefs = [
    // Web Dev Exams
    {
      title: "HTML5 & Modern CSS3 Architecture",
      description: "Test semantic HTML elements, CSS Flexbox, CSS Grid layouts, accessibility standards (a11y), and responsive design principles.",
      duration: 30,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "Which HTML5 semantic element should encapsulate autonomous, self-contained content intended for independent distribution?",
          answers: [
            { text: "<article>", isCorrect: true },
            { text: "<section>", isCorrect: false },
            { text: "<div>", isCorrect: false },
            { text: "<aside>", isCorrect: false },
          ],
        },
        {
          text: "In CSS Grid layout, which CSS property defines the size of grid column tracks?",
          answers: [
            { text: "grid-template-columns", isCorrect: true },
            { text: "grid-auto-flow", isCorrect: false },
            { text: "column-gap", isCorrect: false },
            { text: "grid-column-span", isCorrect: false },
          ],
        },
        {
          text: "What does the WCAG accessibility principle 'POUR' stand for?",
          answers: [
            { text: "Perceivable, Operable, Understandable, Robust", isCorrect: true },
            { text: "Practical, Open, Universal, Reliable", isCorrect: false },
            { text: "Portable, Organized, Usable, Resilient", isCorrect: false },
            { text: "Public, Optimal, Uniform, Rapid", isCorrect: false },
          ],
        },
        {
          text: "Which CSS Flexbox property controls alignment along the cross axis?",
          answers: [
            { text: "align-items", isCorrect: true },
            { text: "justify-content", isCorrect: false },
            { text: "flex-direction", isCorrect: false },
            { text: "flex-wrap", isCorrect: false },
          ],
        },
        {
          text: "What is the purpose of the 'rel=\"noopener noreferrer\"' attribute on external links?",
          answers: [
            { text: "Prevents reverse tabnabbing security exploit and stops passing referrer headers", isCorrect: true },
            { text: "Instructs search engines not to crawl the target link", isCorrect: false },
            { text: "Forces the browser to cache target page images", isCorrect: false },
            { text: "Ensures cookies are sent cross-domain", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "JavaScript ES6+ & TypeScript Mastery",
      description: "Advanced JavaScript concepts including closures, prototypes, Event Loop, Promise chaining, generics, and strict TypeScript types.",
      duration: 45,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "What is the result of typeof null in JavaScript?",
          answers: [
            { text: "'object'", isCorrect: true },
            { text: "'null'", isCorrect: false },
            { text: "'undefined'", isCorrect: false },
            { text: "'boolean'", isCorrect: false },
          ],
        },
        {
          text: "In the JavaScript Event Loop, which queue executes first after the synchronous call stack empties?",
          answers: [
            { text: "Microtask queue (Promises, queueMicrotask)", isCorrect: true },
            { text: "Macrotask queue (setTimeout, setInterval)", isCorrect: false },
            { text: "Rendering pipeline queue", isCorrect: false },
            { text: "Garbage collection queue", isCorrect: false },
          ],
        },
        {
          text: "In TypeScript, what is the key difference between 'type' and 'interface' regarding declarations?",
          answers: [
            { text: "Interfaces support declaration merging across multiple blocks; type aliases do not", isCorrect: true },
            { text: "Type aliases cannot represent union types", isCorrect: false },
            { text: "Interfaces cannot extend other interfaces", isCorrect: false },
            { text: "Type aliases only work for primitive types", isCorrect: false },
          ],
        },
        {
          text: "Which array method returns a single accumulator value by executing a reducer callback on each element?",
          answers: [
            { text: "Array.prototype.reduce()", isCorrect: true },
            { text: "Array.prototype.filter()", isCorrect: false },
            { text: "Array.prototype.map()", isCorrect: false },
            { text: "Array.prototype.find()", isCorrect: false },
          ],
        },
        {
          text: "What does the TypeScript 'unknown' type represent compared to 'any'?",
          answers: [
            { text: "Type-safe counterpart of any requiring narrowing before performing operations", isCorrect: true },
            { text: "Represents values that will never occur or return", isCorrect: false },
            { text: "Exact equivalent to null and undefined", isCorrect: false },
            { text: "Disables all type checking completely", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "React 19 & Next.js App Router Architecture",
      description: "Server Components, Server Actions, React Hooks, streaming SSR with Suspense, routing patterns, and state caching.",
      duration: 50,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "In Next.js App Router, which directive must be placed at the top of a file to turn a Server Component into a Client Component?",
          answers: [
            { text: "\"use client\"", isCorrect: true },
            { text: "\"use server\"", isCorrect: false },
            { text: "\"use client-side\"", isCorrect: false },
            { text: "\"use dynamic\"", isCorrect: false },
          ],
        },
        {
          text: "What is the primary benefit of React Server Components (RSC)?",
          answers: [
            { text: "Zero client-side JavaScript bundle impact for server dependencies and fast initial load", isCorrect: true },
            { text: "Ability to use useState and useEffect directly on the server", isCorrect: false },
            { text: "Direct DOM manipulation from server functions", isCorrect: false },
            { text: "Replacement for database engines", isCorrect: false },
          ],
        },
        {
          text: "Which React hook is designed to memoize the result of an expensive calculation between re-renders?",
          answers: [
            { text: "useMemo()", isCorrect: true },
            { text: "useCallback()", isCorrect: false },
            { text: "useRef()", isCorrect: false },
            { text: "useEffect()", isCorrect: false },
          ],
        },
        {
          text: "What is the purpose of the 'revalidatePath' function in Next.js Server Actions?",
          answers: [
            { text: "Clears the Next.js Data Cache and re-renders server content for a specific route", isCorrect: true },
            { text: "Redirects the user to an error page", isCorrect: false },
            { text: "Deletes the user's browser session cookie", isCorrect: false },
            { text: "Compiles TypeScript files on the client", isCorrect: false },
          ],
        },
        {
          text: "In React 19, what does the new 'useActionState' hook provide?",
          answers: [
            { text: "Manages state based on the result of an async form action (pending, state, formAction)", isCorrect: true },
            { text: "Replaces the global Redux store entirely", isCorrect: false },
            { text: "Connects web sockets automatically", isCorrect: false },
            { text: "Renders canvas animations", isCorrect: false },
          ],
        },
      ],
    },

    // Data Science Exams
    {
      title: "Python Data Analysis with Pandas & NumPy",
      description: "Data manipulation, vectorized operations, missing data handling, indexing, group-by aggregations, and tabular transformations.",
      duration: 40,
      diplomaId: diplomaIds[1],
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "In Pandas, which method is used to aggregate data by one or more columns?",
          answers: [
            { text: "df.groupby()", isCorrect: true },
            { text: "df.aggregate_by()", isCorrect: false },
            { text: "df.split()", isCorrect: false },
            { text: "df.cluster()", isCorrect: false },
          ],
        },
        {
          text: "What is the primary difference between Pandas .loc and .iloc indexers?",
          answers: [
            { text: ".loc uses label-based indexing while .iloc uses integer position-based indexing", isCorrect: true },
            { text: ".iloc uses label-based indexing while .loc uses integer indexing", isCorrect: false },
            { text: ".loc only selects columns while .iloc only selects rows", isCorrect: false },
            { text: "There is no difference between them", isCorrect: false },
          ],
        },
        {
          text: "Which NumPy function computes the arithmetic mean along a specified axis?",
          answers: [
            { text: "np.mean()", isCorrect: true },
            { text: "np.average_sum()", isCorrect: false },
            { text: "np.median()", isCorrect: false },
            { text: "np.std()", isCorrect: false },
          ],
        },
        {
          text: "In a Pandas DataFrame, which method fills missing NaN values with a designated value or interpolation method?",
          answers: [
            { text: "df.fillna()", isCorrect: true },
            { text: "df.dropna()", isCorrect: false },
            { text: "df.replace_null()", isCorrect: false },
            { text: "df.clean_na()", isCorrect: false },
          ],
        },
        {
          text: "What does broadcasting in NumPy refer to?",
          answers: [
            { text: "How NumPy treats arrays with different shapes during arithmetic operations", isCorrect: true },
            { text: "Sending array data across a local network socket", isCorrect: false },
            { text: "Serializing arrays to disk in binary format", isCorrect: false },
            { text: "Plotting charts to the standard output", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Machine Learning & Deep Neural Networks",
      description: "Supervised and unsupervised learning, model evaluation metrics, gradient descent, PyTorch tensors, and backpropagation.",
      duration: 50,
      diplomaId: diplomaIds[1],
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "Which metric is most appropriate for evaluating a classification model with severely imbalanced classes?",
          answers: [
            { text: "F1-Score / PR-AUC", isCorrect: true },
            { text: "Standard Accuracy", isCorrect: false },
            { text: "Mean Squared Error (MSE)", isCorrect: false },
            { text: "R-squared Score", isCorrect: false },
          ],
        },
        {
          text: "In neural networks, what problem does the Dropout regularization technique aim to prevent?",
          answers: [
            { text: "Overfitting on the training data", isCorrect: true },
            { text: "Vanishing gradient during backprop", isCorrect: false },
            { text: "Exploding weights", isCorrect: false },
            { text: "Slow GPU memory allocation", isCorrect: false },
          ],
        },
        {
          text: "Which activation function is most commonly used in hidden layers of modern deep feedforward networks?",
          answers: [
            { text: "ReLU (Rectified Linear Unit)", isCorrect: true },
            { text: "Sigmoid", isCorrect: false },
            { text: "Step function", isCorrect: false },
            { text: "Linear identity", isCorrect: false },
          ],
        },
        {
          text: "In PyTorch, which method computes the gradients of the loss with respect to all graph leaves?",
          answers: [
            { text: "loss.backward()", isCorrect: true },
            { text: "optimizer.step()", isCorrect: false },
            { text: "model.forward()", isCorrect: false },
            { text: "torch.autograd()", isCorrect: false },
          ],
        },
        {
          text: "What is the primary difference between Bagging and Boosting ensemble algorithms?",
          answers: [
            { text: "Bagging trains base learners in parallel; Boosting trains them sequentially to correct prior errors", isCorrect: true },
            { text: "Bagging is for regression only while Boosting is for classification only", isCorrect: false },
            { text: "Boosting uses neural networks while Bagging only uses decision trees", isCorrect: false },
            { text: "There is no fundamental algorithmic difference", isCorrect: false },
          ],
        },
      ],
    },

    // Mobile Development Exams
    {
      title: "Flutter & Dart Cross-Platform Engineering",
      description: "Stateful/Stateless widgets, Provider/Bloc state management, Dart asynchronous Streams, and native platform channels.",
      duration: 45,
      diplomaId: diplomaIds[2],
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "In Flutter, what is the difference between a StatelessWidget and a StatefulWidget?",
          answers: [
            { text: "StatefulWidget maintains mutable internal state across rebuilds via a separate State object", isCorrect: true },
            { text: "StatelessWidget cannot be rendered on Android devices", isCorrect: false },
            { text: "StatefulWidget does not have a build() method", isCorrect: false },
            { text: "StatelessWidget cannot receive Constructor arguments", isCorrect: false },
          ],
        },
        {
          text: "Which Dart keyword is used to mark a function that returns a Future and enables the 'await' keyword?",
          answers: [
            { text: "async", isCorrect: true },
            { text: "sync*", isCorrect: false },
            { text: "deferred", isCorrect: false },
            { text: "isolate", isCorrect: false },
          ],
        },
        {
          text: "What is the purpose of the 'BuildContext' parameter in Flutter's build method?",
          answers: [
            { text: "It locates the widget's position within the overall widget tree hierarchy", isCorrect: true },
            { text: "It stores global application cookies", isCorrect: false },
            { text: "It handles HTTP network authentication", isCorrect: false },
            { text: "It compiles Dart code to machine bytecode", isCorrect: false },
          ],
        },
        {
          text: "In Flutter state management, what does the 'notifyListeners()' method do in a ChangeNotifier?",
          answers: [
            { text: "Notifies all subscribed widgets to schedule a rebuild with the updated state", isCorrect: true },
            { text: "Sends an operating system push notification to the user", isCorrect: false },
            { text: "Logs debug messages to the terminal console", isCorrect: false },
            { text: "Closes the current database connection", isCorrect: false },
          ],
        },
        {
          text: "Which widget is typically used as the top-level structural wrapper providing AppBar, Drawer, and SnackBar support?",
          answers: [
            { text: "Scaffold", isCorrect: true },
            { text: "Container", isCorrect: false },
            { text: "MaterialApp", isCorrect: false },
            { text: "Column", isCorrect: false },
          ],
        },
      ],
    },

    // Cyber Security Exams
    {
      title: "Network Security & Penetration Testing",
      description: "TCP/IP security, firewalls, port scanning with Nmap, OWASP Top 10 vulnerabilities, and defense against injection attacks.",
      duration: 45,
      diplomaId: diplomaIds[3],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "Which vulnerability occurs when untrusted user input is directly concatenated into a dynamic SQL query string?",
          answers: [
            { text: "SQL Injection (SQLi)", isCorrect: true },
            { text: "Cross-Site Scripting (XSS)", isCorrect: false },
            { text: "Server-Side Request Forgery (SSRF)", isCorrect: false },
            { text: "Broken Access Control", isCorrect: false },
          ],
        },
        {
          text: "What is the primary purpose of the 'Same-Origin Policy' (SOP) implemented in web browsers?",
          answers: [
            { text: "Restricts how a document or script loaded from one origin can interact with resources from another origin", isCorrect: true },
            { text: "Ensures all web traffic is encrypted using TLS 1.3", isCorrect: false },
            { text: "Accelerates DNS lookup resolution", isCorrect: false },
            { text: "Prevents websites from using third-party fonts", isCorrect: false },
          ],
        },
        {
          text: "Which HTTP security header mitigates Cross-Site Scripting (XSS) by restricting where scripts and assets can load from?",
          answers: [
            { text: "Content-Security-Policy (CSP)", isCorrect: true },
            { text: "X-Frame-Options", isCorrect: false },
            { text: "Strict-Transport-Security (HSTS)", isCorrect: false },
            { text: "Cache-Control", isCorrect: false },
          ],
        },
        {
          text: "What port does the secure HTTPS protocol use by default?",
          answers: [
            { text: "443", isCorrect: true },
            { text: "80", isCorrect: false },
            { text: "8080", isCorrect: false },
            { text: "22", isCorrect: false },
          ],
        },
        {
          text: "In asymmetric cryptography, which key is used by the recipient to decrypt a message encrypted with their public key?",
          answers: [
            { text: "The recipient's private key", isCorrect: true },
            { text: "The sender's public key", isCorrect: false },
            { text: "A symmetric session salt", isCorrect: false },
            { text: "The certificate authority root key", isCorrect: false },
          ],
        },
      ],
    },

    // Cloud & DevOps Exams
    {
      title: "Docker Containers & Kubernetes Deployment",
      description: "Containerization, multi-stage Docker builds, Kubernetes Pods, Deployments, Services, and container ingress networking.",
      duration: 40,
      diplomaId: diplomaIds[4],
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "In Docker, what is the primary benefit of using multi-stage builds in a Dockerfile?",
          answers: [
            { text: "Keeps final production image sizes minimal by excluding compilers and build dependencies", isCorrect: true },
            { text: "Runs containers across multiple CPU cores automatically", isCorrect: false },
            { text: "Enables automatic container horizontal scaling", isCorrect: false },
            { text: "Bypasses operating system kernel isolation", isCorrect: false },
          ],
        },
        {
          text: "In Kubernetes, what is the smallest deployable computing unit that can be created and managed?",
          answers: [
            { text: "Pod", isCorrect: true },
            { text: "Service", isCorrect: false },
            { text: "Deployment", isCorrect: false },
            { text: "ReplicaSet", isCorrect: false },
          ],
        },
        {
          text: "Which Kubernetes resource type exposes Pods to external web traffic outside the cluster?",
          answers: [
            { text: "Ingress / NodePort / LoadBalancer Service", isCorrect: true },
            { text: "ConfigMap", isCorrect: false },
            { text: "PersistentVolumeClaim", isCorrect: false },
            { text: "StatefulSet", isCorrect: false },
          ],
        },
        {
          text: "What does the command 'docker-compose up -d' do?",
          answers: [
            { text: "Starts multi-container services in detached background mode according to docker-compose.yml", isCorrect: true },
            { text: "Deletes all dangling volumes", isCorrect: false },
            { text: "Pushes local images to Docker Hub", isCorrect: false },
            { text: "Upgrades the host operating system kernel", isCorrect: false },
          ],
        },
        {
          text: "What is an immutable infrastructure paradigm in modern Cloud and DevOps engineering?",
          answers: [
            { text: "Servers and containers are replaced rather than modified in-place whenever changes occur", isCorrect: true },
            { text: "Database tables that cannot store string data", isCorrect: false },
            { text: "Cloud accounts that cannot be billed", isCorrect: false },
            { text: "Physical server racks locked in biometric rooms", isCorrect: false },
          ],
        },
      ],
    },

    // UI/UX Design Exams
    {
      title: "UI/UX Design Systems & Product Strategy",
      description: "Design thinking, user journey mapping, accessibility contrast guidelines, typography scale, and atomic design systems.",
      duration: 35,
      diplomaId: diplomaIds[5],
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
      questions: [
        {
          text: "According to WCAG 2.1 Level AA guidelines, what is the minimum contrast ratio required for normal body text?",
          answers: [
            { text: "4.5:1", isCorrect: true },
            { text: "3.0:1", isCorrect: false },
            { text: "7.0:1", isCorrect: false },
            { text: "2.0:1", isCorrect: false },
          ],
        },
        {
          text: "In Brad Frost's Atomic Design methodology, what is the correct hierarchical order from smallest to largest?",
          answers: [
            { text: "Atoms -> Molecules -> Organisms -> Templates -> Pages", isCorrect: true },
            { text: "Pages -> Templates -> Molecules -> Atoms", isCorrect: false },
            { text: "Components -> Modules -> Screens -> Systems", isCorrect: false },
            { text: "Elements -> Widgets -> Layouts -> Views", isCorrect: false },
          ],
        },
        {
          text: "What does the 'Fitts's Law' predict in Human-Computer Interaction (HCI)?",
          answers: [
            { text: "The time required to rapidly move to a target is a function of the ratio between distance and target width", isCorrect: true },
            { text: "Users spend most time reading in an F-shaped eye-tracking pattern", isCorrect: false },
            { text: "Working memory can only hold 7 items plus or minus 2", isCorrect: false },
            { text: "Complexity in a system cannot be reduced, only moved", isCorrect: false },
          ],
        },
        {
          text: "What is a major advantage of using Design Tokens in Figma and front-end design systems?",
          answers: [
            { text: "Stores design decisions (colors, spacing, typography) as reusable variables synchronized across code and design", isCorrect: true },
            { text: "Automatically encrypts design files", isCorrect: false },
            { text: "Generates backend relational database schemas", isCorrect: false },
            { text: "Replaces the need for usability testing", isCorrect: false },
          ],
        },
        {
          text: "What is the primary difference between a Low-Fidelity and a High-Fidelity prototype?",
          answers: [
            { text: "Low-fidelity focuses on layout, information architecture, and flow without visual polish; high-fidelity closely resembles the final product", isCorrect: true },
            { text: "Low-fidelity is coded in C++ while high-fidelity is coded in HTML", isCorrect: false },
            { text: "Low-fidelity prototypes cannot be clicked by users", isCorrect: false },
            { text: "There is no difference in testing outcomes", isCorrect: false },
          ],
        },
      ],
    },
  ];

  const examIds: string[] = [];
  examDefs.forEach((e, examIdx) => {
    const examId = uuidv4();
    examIds.push(examId);

    db.exams.push({
      id: examId,
      title: e.title,
      description: e.description,
      duration: e.duration,
      diplomaId: e.diplomaId,
      image: e.image,
      questionsCount: e.questions.length,
      immutable: false,
      createdAt: pastDate(180 - examIdx * 10),
      updatedAt: pastDate(15 - examIdx),
    });

    e.questions.forEach((q) => {
      const qId = uuidv4();
      db.questions.push({
        id: qId,
        text: q.text,
        examId,
        immutable: false,
        createdAt: pastDate(180 - examIdx * 10),
        updatedAt: pastDate(15 - examIdx),
        answers: q.answers.map((a) => ({
          id: uuidv4(),
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      });
    });
  });

  // ── 4. Seed Submissions (for student Alex) ──
  const htmlExam = db.exams[0];
  const htmlQuestions = db.questions.filter((q) => q.examId === htmlExam.id);
  const answers1 = htmlQuestions.map((q, idx) => ({
    questionId: q.id,
    answerId: idx < 4 ? q.answers.find((a) => a.isCorrect)!.id : q.answers.find((a) => !a.isCorrect)!.id,
  }));

  db.submissions.push({
    id: uuidv4(),
    userId: studentId,
    examId: htmlExam.id,
    answers: answers1,
    score: 80,
    correct: 4,
    total: 5,
    passed: true,
    startedAt: pastDate(24),
    submittedAt: pastDate(23.5),
    createdAt: pastDate(23.5),
  });

  const jsExam = db.exams[1];
  const jsQuestions = db.questions.filter((q) => q.examId === jsExam.id);
  const answers2 = jsQuestions.map((q) => ({
    questionId: q.id,
    answerId: q.answers.find((a) => a.isCorrect)!.id,
  }));

  db.submissions.push({
    id: uuidv4(),
    userId: studentId,
    examId: jsExam.id,
    answers: answers2,
    score: 100,
    correct: 5,
    total: 5,
    passed: true,
    startedAt: pastDate(12),
    submittedAt: pastDate(11.4),
    createdAt: pastDate(11.4),
  });

  // ── 5. Seed Audit Logs (for admin audit log view) ──
  db.auditLogs.push(
    {
      id: uuidv4(),
      createdAt: pastDate(48),
      actorUserId: adminId,
      actorUsername: "admin",
      actorEmail: "admin@exam-platform.com",
      actorRole: "admin",
      category: "diploma",
      action: "create",
      entityType: "diploma",
      entityId: diplomaIds[0],
      metadata: { title: "Web Development" },
      ipAddress: "192.168.1.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      httpMethod: "POST",
      path: "/api/v1/diplomas",
    },
    {
      id: uuidv4(),
      createdAt: pastDate(40),
      actorUserId: adminId,
      actorUsername: "admin",
      actorEmail: "admin@exam-platform.com",
      actorRole: "admin",
      category: "exam",
      action: "create",
      entityType: "exam",
      entityId: examIds[0],
      metadata: { title: "HTML5 & Modern CSS3 Architecture", questionsCount: 5 },
      ipAddress: "192.168.1.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      httpMethod: "POST",
      path: "/api/v1/exams",
    },
    {
      id: uuidv4(),
      createdAt: pastDate(23.5),
      actorUserId: studentId,
      actorUsername: "student",
      actorEmail: "student@exam-platform.com",
      actorRole: "student",
      category: "submission",
      action: "submit",
      entityType: "exam",
      entityId: htmlExam.id,
      metadata: { score: 80, passed: true },
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      httpMethod: "POST",
      path: "/api/v1/submissions",
    },
    {
      id: uuidv4(),
      createdAt: pastDate(11.4),
      actorUserId: studentId,
      actorUsername: "student",
      actorEmail: "student@exam-platform.com",
      actorRole: "student",
      category: "submission",
      action: "submit",
      entityType: "exam",
      entityId: jsExam.id,
      metadata: { score: 100, passed: true },
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      httpMethod: "POST",
      path: "/api/v1/submissions",
    },
    {
      id: uuidv4(),
      createdAt: pastDate(2),
      actorUserId: adminId,
      actorUsername: "admin",
      actorEmail: "admin@exam-platform.com",
      actorRole: "admin",
      category: "auth",
      action: "login",
      entityType: "user",
      entityId: adminId,
      metadata: { success: true },
      ipAddress: "192.168.1.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      httpMethod: "POST",
      path: "/api/v1/auth/login",
    }
  );

  return db;
}

// Singleton — survives across requests within same Vercel function instance
const globalForDb = globalThis as unknown as { __examDb?: Database };
if (!globalForDb.__examDb) {
  globalForDb.__examDb = createDatabase();
}

export const db: Database = globalForDb.__examDb;
