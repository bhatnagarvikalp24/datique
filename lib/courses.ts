export type CourseModule = {
  title: string;
  lessons: string[];
  practical: string;
  assignment: string;
  solution: string;
  test: string;
};

export type Course = {
  id: string;
  title: string;
  shortTitle: string;
  priceUsd: number;
  level: string;
  duration: string;
  audience: string;
  promise: string;
  description: string;
  outcomes: string[];
  includes: string[];
  modules: CourseModule[];
  caseStudy: {
    title: string;
    brief: string;
    deliverables: string[];
  };
};

export const COURSES: Course[] = [
  {
    id: "sql-mastery",
    title: "SQL Mastery for All Data Profiles",
    shortTitle: "SQL Mastery",
    priceUsd: 20,
    level: "Beginner to advanced",
    duration: "5 weeks",
    audience: "Data analysts, BI analysts, data engineers, product analysts, data scientists",
    promise:
      "Master SQL for analytics, interviews, dashboards, and real business decision-making.",
    description:
      "A complete SQL path that moves from query basics to joins, CTEs, windows, optimization, and business analytics case work.",
    outcomes: [
      "Write clean analytical SQL from scratch",
      "Solve interview-style SQL questions with confidence",
      "Use joins, CTEs, windows, dates, and aggregations in real scenarios",
      "Analyze retention, revenue, cohorts, and funnel behavior",
    ],
    includes: [
      "100+ SQL practice questions",
      "Business datasets across ecommerce, SaaS, marketing, HR, and fintech",
      "Assignment briefs and explained solutions",
      "Timed SQL test series",
      "One end-to-end SaaS analytics case study",
    ],
    modules: [
      {
        title: "SQL Foundations",
        lessons: ["SELECT, WHERE, ORDER BY", "Filtering patterns", "Aliases and calculated fields"],
        practical: "Query a customer table and produce filtered business views.",
        assignment: "Create 12 beginner queries on customers, orders, and products.",
        solution: "Annotated SQL file with every query and reasoning notes.",
        test: "20-minute fundamentals test with 15 questions.",
      },
      {
        title: "Aggregation and Business Metrics",
        lessons: ["GROUP BY and HAVING", "COUNT, SUM, AVG", "Revenue and conversion metrics"],
        practical: "Calculate daily revenue, AOV, and active customer counts.",
        assignment: "Build a weekly KPI summary from raw transactions.",
        solution: "Step-by-step metric query pack.",
        test: "Metrics quiz with query debugging questions.",
      },
      {
        title: "Joins and Data Modeling",
        lessons: ["Inner, left, right, full joins", "Self joins", "Join traps and duplicates"],
        practical: "Combine orders, users, campaigns, and refunds.",
        assignment: "Find incomplete customer journeys across multiple tables.",
        solution: "Join map plus final answer queries.",
        test: "Join behavior test series.",
      },
      {
        title: "CTEs, Subqueries, and Windows",
        lessons: ["Reusable CTEs", "Nested logic", "ROW_NUMBER, RANK, LAG, LEAD"],
        practical: "Rank customers and detect repeat purchase behavior.",
        assignment: "Build cohort and retention queries using windows.",
        solution: "Optimized CTE and window function solutions.",
        test: "Advanced SQL interview round.",
      },
      {
        title: "SQL for Interviews and Analytics",
        lessons: ["Case statements", "Date functions", "Optimization basics"],
        practical: "Solve product, revenue, churn, and funnel questions.",
        assignment: "Complete a 30-question mixed SQL challenge.",
        solution: "Explained solution workbook.",
        test: "60-minute final SQL test.",
      },
    ],
    caseStudy: {
      title: "SaaS Revenue and Retention Analysis",
      brief:
        "Analyze a subscription company's revenue, churn, cohorts, customer segments, and expansion opportunities.",
      deliverables: [
        "SQL query pack",
        "Retention and revenue insight summary",
        "Executive recommendations",
      ],
    },
  },
  {
    id: "python-for-data",
    title: "Python for Data",
    shortTitle: "Python for Data",
    priceUsd: 20,
    level: "Beginner to job-ready",
    duration: "5 weeks",
    audience: "Aspiring analysts, data scientists, automation-focused data professionals",
    promise:
      "Learn Python for real data cleaning, analysis, automation, and reporting work.",
    description:
      "A practical Python course focused on data workflows, not abstract programming theory.",
    outcomes: [
      "Use Python confidently for data tasks",
      "Clean, transform, and analyze datasets with Pandas",
      "Read and write CSV, Excel, JSON, and API data",
      "Create reusable scripts and notebooks for business analysis",
    ],
    includes: [
      "Python coding drills",
      "Pandas transformation assignments",
      "Messy data cleaning challenges",
      "Visualization and reporting exercises",
      "One full sales/customer analytics case study",
    ],
    modules: [
      {
        title: "Python Core for Data Work",
        lessons: ["Variables and types", "Lists and dictionaries", "Loops and functions"],
        practical: "Write scripts that summarize user and order records.",
        assignment: "Build small functions for cleaning and formatting raw values.",
        solution: "Clean Python scripts with commentary.",
        test: "Core Python checkpoint.",
      },
      {
        title: "Files, APIs, and Notebooks",
        lessons: ["CSV, Excel, JSON", "Notebook workflow", "API basics"],
        practical: "Pull and combine data from files and a mock API response.",
        assignment: "Create an ingestion notebook for three raw data sources.",
        solution: "Reference notebook with modular loading functions.",
        test: "Data ingestion quiz.",
      },
      {
        title: "NumPy and Pandas",
        lessons: ["Series and DataFrames", "Filtering and grouping", "Merging datasets"],
        practical: "Transform raw transactions into analysis-ready tables.",
        assignment: "Produce customer-level features from order data.",
        solution: "Pandas solution notebook.",
        test: "Pandas transformation challenge.",
      },
      {
        title: "Data Cleaning and EDA",
        lessons: ["Missing values", "Outliers", "EDA patterns"],
        practical: "Profile a messy customer dataset and fix quality issues.",
        assignment: "Clean, document, and summarize a flawed sales dataset.",
        solution: "Cleaning notebook plus data quality checklist.",
        test: "EDA and cleaning test series.",
      },
      {
        title: "Visualization and Automation",
        lessons: ["Matplotlib", "Seaborn", "Reusable reporting scripts"],
        practical: "Create charts and automate a weekly report.",
        assignment: "Generate an insight report from cleaned data.",
        solution: "Report notebook and export script.",
        test: "Final Python for data test.",
      },
    ],
    caseStudy: {
      title: "Messy Sales and Customer Analytics",
      brief:
        "Clean raw sales/customer data, identify revenue drivers, segment customers, and prepare a business-ready insight summary.",
      deliverables: [
        "Cleaned dataset",
        "EDA notebook",
        "Insight report with charts",
      ],
    },
  },
  {
    id: "data-science-ml",
    title: "Data Science and Machine Learning Course",
    shortTitle: "Data Science and ML",
    priceUsd: 35,
    level: "Intermediate",
    duration: "8 weeks",
    audience: "Learners who know basic Python and want portfolio-grade ML projects",
    promise:
      "Learn the full machine learning workflow from business problem to evaluated model.",
    description:
      "A practical DSML course with statistics, EDA, feature engineering, modeling, evaluation, interpretation, and project packaging.",
    outcomes: [
      "Frame business problems as ML problems",
      "Build regression, classification, and clustering models",
      "Evaluate models and explain tradeoffs clearly",
      "Create portfolio-ready machine learning projects",
    ],
    includes: [
      "Jupyter notebooks for every major algorithm",
      "Feature engineering assignments",
      "Model evaluation worksheets",
      "ML interview test series",
      "One churn prediction industry case",
    ],
    modules: [
      {
        title: "Data Science Workflow",
        lessons: ["Problem framing", "EDA strategy", "Train/test split"],
        practical: "Convert a business question into a modeling plan.",
        assignment: "Prepare an ML project brief from a raw problem statement.",
        solution: "Reference project plan and checklist.",
        test: "Workflow and framing quiz.",
      },
      {
        title: "Statistics for Machine Learning",
        lessons: ["Distributions", "Correlation", "Bias and variance"],
        practical: "Analyze statistical signals in customer data.",
        assignment: "Run statistical checks before model building.",
        solution: "Stats notebook with interpretations.",
        test: "Applied statistics checkpoint.",
      },
      {
        title: "Supervised Learning",
        lessons: ["Linear regression", "Logistic regression", "Tree-based models"],
        practical: "Build baseline regression and classification models.",
        assignment: "Compare three models on the same dataset.",
        solution: "Model comparison notebook.",
        test: "Supervised ML test series.",
      },
      {
        title: "Evaluation and Tuning",
        lessons: ["Metrics", "Cross-validation", "Hyperparameter tuning"],
        practical: "Tune a model and explain metric tradeoffs.",
        assignment: "Optimize a classifier for business cost.",
        solution: "Evaluation workbook and tuning notebook.",
        test: "Model evaluation challenge.",
      },
      {
        title: "Unsupervised Learning and Interpretation",
        lessons: ["Clustering", "Dimensionality reduction", "Model explainability"],
        practical: "Segment customers and explain model drivers.",
        assignment: "Create customer segments with business labels.",
        solution: "Clustering notebook and executive notes.",
        test: "Final DSML interview round.",
      },
    ],
    caseStudy: {
      title: "Subscription Churn Prediction",
      brief:
        "Build a churn model, evaluate risk segments, explain drivers, and recommend retention actions for a subscription business.",
      deliverables: [
        "Model notebook",
        "Feature importance analysis",
        "Retention recommendation memo",
      ],
    },
  },
  {
    id: "ai-genai-agentic",
    title: "AI Course: AI, GenAI and Agentic AI",
    shortTitle: "AI, GenAI and Agents",
    priceUsd: 50,
    level: "Intermediate to advanced",
    duration: "8 weeks",
    audience: "Builders, analysts, engineers, and founders who want to ship AI products",
    promise:
      "Move from AI fundamentals to real GenAI apps, RAG systems, and agentic workflows.",
    description:
      "A flagship AI course covering LLMs, prompting, embeddings, vector search, RAG, tool use, evaluation, guardrails, and agents.",
    outcomes: [
      "Understand modern AI, GenAI, and agentic systems",
      "Build prompt workflows, RAG apps, and AI assistants",
      "Use tools, memory, and retrieval safely",
      "Evaluate AI outputs for quality, cost, and reliability",
    ],
    includes: [
      "Prompt labs and evaluation rubrics",
      "RAG app build notes",
      "Agent tool-use assignments",
      "AI product and deployment checklists",
      "One AI analyst agent industry case",
    ],
    modules: [
      {
        title: "AI and GenAI Foundations",
        lessons: ["AI vs ML vs GenAI", "LLM intuition", "Tokens, context, and cost"],
        practical: "Compare model outputs across structured prompts.",
        assignment: "Create a prompt evaluation sheet for a business task.",
        solution: "Prompt rubric and improved prompt library.",
        test: "AI foundations test.",
      },
      {
        title: "Prompt Engineering and Structured Outputs",
        lessons: ["Prompt patterns", "Few-shot examples", "JSON and schema outputs"],
        practical: "Build reusable prompts for analysis, writing, and extraction.",
        assignment: "Design a prompt pack for a support analytics workflow.",
        solution: "Reference prompts and output validation examples.",
        test: "Prompt engineering challenge.",
      },
      {
        title: "Embeddings, Vector Search, and RAG",
        lessons: ["Embeddings", "Chunking", "Retrieval augmented generation"],
        practical: "Create a document Q&A workflow over course notes.",
        assignment: "Build a RAG design for a policy document assistant.",
        solution: "RAG architecture and implementation notebook.",
        test: "RAG concepts and debugging test.",
      },
      {
        title: "Tool Use and Agentic AI",
        lessons: ["Function calling", "Planning loops", "Memory and tool safety"],
        practical: "Build an assistant that calls tools for data lookup and summaries.",
        assignment: "Design an agent workflow for a business operations task.",
        solution: "Agent workflow spec and sample implementation.",
        test: "Agentic AI scenario test.",
      },
      {
        title: "Evaluation, Guardrails, and Deployment",
        lessons: ["Output evaluation", "Safety checks", "Latency and cost tradeoffs"],
        practical: "Evaluate an AI workflow and improve reliability.",
        assignment: "Create a production readiness checklist for an AI app.",
        solution: "Evaluation matrix and deployment checklist.",
        test: "Final AI product test series.",
      },
    ],
    caseStudy: {
      title: "AI Analyst Agent for Company Knowledge",
      brief:
        "Build an AI analyst that answers questions from company documents, uses structured tools, and produces an executive business summary.",
      deliverables: [
        "Agent design document",
        "RAG and tool-use workflow",
        "Evaluation report",
      ],
    },
  },
];

export function getCourse(courseId: string): Course | undefined {
  return COURSES.find((course) => course.id === courseId);
}

export function getCoursePriceInCents(courseId: string): number | null {
  const course = getCourse(courseId);
  return course ? course.priceUsd * 100 : null;
}
