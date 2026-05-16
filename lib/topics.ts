export type Topic = {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  subtopics: string[];
  assignmentCount: number;
  price: number;
  includes: string[];
};

export const TOPICS: Topic[] = [
  {
    id: "sql",
    title: "SQL Assignments & Solutions",
    shortTitle: "SQL",
    tagline: "From SELECT to window functions — every assignment answered.",
    description:
      "A comprehensive set of SQL assignments covering real-world query patterns used in analytics, data engineering, and interviews. Each assignment comes with a fully explained solution.",
    subtopics: [
      "SELECT, WHERE, ORDER BY",
      "Aggregations & GROUP BY",
      "JOINs (inner, left, right, full, self)",
      "Subqueries & CTEs",
      "Window Functions (ROW_NUMBER, RANK, LAG, LEAD)",
      "Date & String Functions",
      "Case Statements & Conditional Logic",
      "SQL for Interviews",
      "Query Optimization Basics",
      "Business Analytics Queries",
    ],
    assignmentCount: 20,
    price: 15,
    includes: [
      "20 SQL assignments — instant PDF download",
      "Full solutions PDF with explained queries",
      "Lifetime access",
    ],
  },
  {
    id: "python",
    title: "Python Assignments & Solutions",
    shortTitle: "Python",
    tagline: "Pandas, NumPy, and real data problems — solved and explained.",
    description:
      "Hands-on Python assignments for data work: cleaning messy datasets, transforming data with Pandas, writing reusable functions, and building analysis scripts. Solutions include annotated code.",
    subtopics: [
      "Python Basics for Data",
      "Lists, Dicts & Comprehensions",
      "Functions & Modules",
      "File I/O (CSV, JSON, Excel)",
      "NumPy Arrays",
      "Pandas DataFrames & Series",
      "Data Cleaning & EDA",
      "Groupby, Merge & Pivot",
      "Visualization (Matplotlib/Seaborn)",
      "Automation & Scripting",
    ],
    assignmentCount: 20,
    price: 15,
    includes: [
      "20 Python assignments — instant PDF download",
      "Annotated solution scripts PDF",
      "Lifetime access",
    ],
  },
  {
    id: "data-engineering",
    title: "Data Engineering Assignments & Solutions",
    shortTitle: "Data Engineering",
    tagline: "Pipelines, warehouses, and orchestration — built and explained.",
    description:
      "Practical data engineering assignments on building pipelines, transforming data at scale, working with orchestration tools, and designing warehouse schemas. Every assignment has a detailed solution.",
    subtopics: [
      "ETL & ELT Pipelines",
      "Data Warehouse Design",
      "Star & Snowflake Schemas",
      "Apache Airflow Basics",
      "dbt (data build tool)",
      "Spark & PySpark",
      "Batch vs Streaming",
      "Data Quality & Testing",
      "Partitioning & Indexing",
      "Pipeline Debugging",
    ],
    assignmentCount: 20,
    price: 15,
    includes: [
      "20 data engineering assignments — instant PDF download",
      "Full solutions PDF with explanations",
      "Lifetime access",
    ],
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing Assignments & Solutions",
    shortTitle: "Cloud Computing",
    tagline: "AWS, GCP, and Azure concepts — applied and explained.",
    description:
      "Cloud computing assignments covering core services, storage, compute, networking, IAM, and data services across major providers. Solutions map concepts to real architecture decisions.",
    subtopics: [
      "Cloud Fundamentals & Models",
      "AWS Core Services (S3, EC2, Lambda)",
      "GCP Core Services (BigQuery, GCS, Cloud Run)",
      "Azure Fundamentals",
      "IAM & Security",
      "Storage & Databases in the Cloud",
      "Serverless Architecture",
      "Cost Optimization",
      "Cloud Data Pipelines",
      "Networking & VPCs",
    ],
    assignmentCount: 20,
    price: 15,
    includes: [
      "20 cloud computing assignments — instant PDF download",
      "Full solutions PDF with explanations",
      "Lifetime access",
    ],
  },
  {
    id: "case-studies",
    title: "Industry Case Studies & Solutions",
    shortTitle: "Case Studies",
    tagline: "Real business problems. Structured solutions. Interview-ready.",
    description:
      "End-to-end industry case studies across e-commerce, SaaS, fintech, and healthcare domains. Each case study includes a full solution with methodology, SQL/Python, and executive-style write-ups.",
    subtopics: [
      "E-commerce Revenue Analysis",
      "SaaS Churn & Retention",
      "Funnel & Conversion Analysis",
      "Customer Segmentation",
      "Cohort Analysis",
      "Financial Metrics & Forecasting",
      "Supply Chain Analytics",
      "Product Analytics",
      "Healthcare Data Case",
      "Marketing Attribution",
    ],
    assignmentCount: 20,
    price: 15,
    includes: [
      "20 industry case studies — instant PDF download",
      "Full structured solutions PDF",
      "Lifetime access",
    ],
  },
];

export function getTopic(topicId: string): Topic | undefined {
  return TOPICS.find((t) => t.id === topicId);
}
