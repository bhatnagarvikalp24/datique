import type { CourseModule } from "@/lib/courses";

export type ModuleMaterial = {
  richLessons?: Array<{
    title: string;
    goal: string;
    explanation: string[];
    syntax: string;
    example: {
      title: string;
      code: string;
      notes: string[];
    };
    dataUseCase: string;
    mistakes: Array<{
      title: string;
      wrong: string;
      fix: string;
    }>;
    practice: string[];
  }>;
  theory: Array<{
    title: string;
    body: string;
    example?: string;
  }>;
  lab: {
    scenario: string;
    steps: string[];
    starter: string;
    expected: string;
  };
  assignment: {
    brief: string;
    tasks: string[];
  };
  solution: {
    approach: string[];
    sample: string;
  };
  test: Array<{
    question: string;
    answer: string;
  }>;
};

const sqlSamples = [
  {
    starter: `SELECT customer_id, order_date, amount
FROM orders
WHERE order_date >= '2026-01-01'
ORDER BY order_date DESC;`,
    sample: `SELECT
  customer_id,
  COUNT(*) AS orders_count,
  ROUND(SUM(amount), 2) AS total_revenue
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_id
HAVING SUM(amount) >= 500
ORDER BY total_revenue DESC;`,
  },
  {
    starter: `SELECT
  DATE(order_date) AS order_day,
  COUNT(*) AS orders
FROM orders
GROUP BY DATE(order_date);`,
    sample: `SELECT
  DATE(order_date) AS order_day,
  SUM(amount) AS revenue,
  COUNT(DISTINCT customer_id) AS active_customers,
  ROUND(SUM(amount) / NULLIF(COUNT(DISTINCT customer_id), 0), 2) AS revenue_per_customer
FROM orders
GROUP BY DATE(order_date)
ORDER BY order_day;`,
  },
  {
    starter: `SELECT *
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;`,
    sample: `SELECT
  c.customer_id,
  c.signup_channel,
  COUNT(o.order_id) AS orders_count,
  COALESCE(SUM(o.amount), 0) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.signup_channel;`,
  },
  {
    starter: `WITH customer_orders AS (
  SELECT customer_id, order_date, amount
  FROM orders
)
SELECT * FROM customer_orders;`,
    sample: `WITH ranked_orders AS (
  SELECT
    customer_id,
    order_id,
    order_date,
    amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_number,
    LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS previous_order_date
  FROM orders
)
SELECT *
FROM ranked_orders
WHERE order_number <= 3;`,
  },
  {
    starter: `SELECT *
FROM events
WHERE event_name IN ('signup', 'trial_started', 'paid');`,
    sample: `SELECT
  signup_week,
  COUNT(DISTINCT user_id) AS users,
  COUNT(DISTINCT CASE WHEN trial_started_at IS NOT NULL THEN user_id END) AS trials,
  COUNT(DISTINCT CASE WHEN paid_at IS NOT NULL THEN user_id END) AS paid_users,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN paid_at IS NOT NULL THEN user_id END) / COUNT(DISTINCT user_id), 2) AS signup_to_paid_rate
FROM user_funnel
GROUP BY signup_week
ORDER BY signup_week;`,
  },
];

const pythonSamples = [
  {
    starter: `orders = [
    {"customer_id": 101, "amount": "120.50"},
    {"customer_id": 102, "amount": "89.99"},
]

# TODO: convert amount to float and calculate total revenue`,
    sample: `orders = [
    {"customer_id": 101, "amount": "120.50"},
    {"customer_id": 102, "amount": "89.99"},
]

def parse_amount(value):
    return float(value.strip())

total_revenue = sum(parse_amount(order["amount"]) for order in orders)
print(round(total_revenue, 2))`,
  },
  {
    starter: `import pandas as pd

# TODO: load customers.csv, orders.xlsx, and events.json
# TODO: standardize column names before merging`,
    sample: `import pandas as pd

customers = pd.read_csv("customers.csv")
orders = pd.read_excel("orders.xlsx")
events = pd.read_json("events.json")

def clean_columns(df):
    df = df.copy()
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    return df

customers = clean_columns(customers)
orders = clean_columns(orders)
events = clean_columns(events)`,
  },
  {
    starter: `import pandas as pd

orders = pd.read_csv("orders.csv")

# TODO: create customer-level order count, revenue, and last order date`,
    sample: `import pandas as pd

orders = pd.read_csv("orders.csv", parse_dates=["order_date"])

customer_features = (
    orders
    .groupby("customer_id")
    .agg(
        orders_count=("order_id", "nunique"),
        lifetime_revenue=("amount", "sum"),
        last_order_date=("order_date", "max"),
    )
    .reset_index()
)

customer_features["lifetime_revenue"] = customer_features["lifetime_revenue"].round(2)`,
  },
  {
    starter: `import pandas as pd

df = pd.read_csv("messy_sales.csv")

# TODO: inspect missing values, duplicates, invalid dates, and outliers`,
    sample: `import pandas as pd

df = pd.read_csv("messy_sales.csv")
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
df = df.drop_duplicates()
df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

quality_report = pd.DataFrame({
    "missing_values": df.isna().sum(),
    "missing_pct": (df.isna().mean() * 100).round(2),
})

clean_df = df.dropna(subset=["order_id", "customer_id", "order_date", "amount"])`,
  },
  {
    starter: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# TODO: chart weekly revenue and save the figure`,
    sample: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

orders = pd.read_csv("clean_orders.csv", parse_dates=["order_date"])
weekly = (
    orders
    .set_index("order_date")
    .resample("W")["amount"]
    .sum()
    .reset_index()
)

sns.lineplot(data=weekly, x="order_date", y="amount")
plt.title("Weekly Revenue")
plt.xlabel("Week")
plt.ylabel("Revenue")
plt.tight_layout()
plt.savefig("weekly_revenue.png", dpi=160)`,
  },
];

const mlSamples = [
  {
    starter: `problem = "Customers are cancelling subscriptions"

# TODO: define target, prediction window, features, and success metric`,
    sample: `project_plan = {
    "target": "customer churned within next 30 days",
    "prediction_unit": "customer_id",
    "prediction_date": "end_of_month",
    "features": ["usage_last_30d", "support_tickets", "plan_type", "payment_failures"],
    "primary_metric": "recall at top 20 percent risk segment",
    "business_action": "retention offer or customer success outreach",
}`,
  },
  {
    starter: `import pandas as pd

df = pd.read_csv("customers.csv")

# TODO: inspect churn rate and feature correlations`,
    sample: `import pandas as pd

df = pd.read_csv("customers.csv")
churn_rate = df["churned"].mean()
numeric_corr = df.select_dtypes("number").corr(numeric_only=True)["churned"].sort_values(ascending=False)

print(f"Churn rate: {churn_rate:.2%}")
print(numeric_corr.head(10))`,
  },
  {
    starter: `from sklearn.model_selection import train_test_split

# TODO: train baseline classification models`,
    sample: `from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier

X = df[["usage_days", "support_tickets", "payment_failures", "tenure_months"]]
y = df["churned"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)
print(classification_report(y_test, preds))`,
  },
  {
    starter: `from sklearn.model_selection import GridSearchCV

# TODO: tune model and compare precision, recall, and ROC-AUC`,
    sample: `from sklearn.model_selection import GridSearchCV
from sklearn.metrics import roc_auc_score, precision_score, recall_score

params = {"max_depth": [3, 5, 8], "min_samples_leaf": [10, 25, 50]}
search = GridSearchCV(model, params, scoring="roc_auc", cv=5)
search.fit(X_train, y_train)

best = search.best_estimator_
probs = best.predict_proba(X_test)[:, 1]
preds = (probs >= 0.35).astype(int)

print("ROC-AUC", roc_auc_score(y_test, probs))
print("Precision", precision_score(y_test, preds))
print("Recall", recall_score(y_test, preds))`,
  },
  {
    starter: `from sklearn.cluster import KMeans

# TODO: segment customers using scaled behavioral features`,
    sample: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

features = df[["orders_count", "lifetime_revenue", "days_since_last_order"]]
scaled = StandardScaler().fit_transform(features)

kmeans = KMeans(n_clusters=4, random_state=42, n_init="auto")
df["segment"] = kmeans.fit_predict(scaled)

segment_summary = df.groupby("segment")[["orders_count", "lifetime_revenue", "days_since_last_order"]].mean()
print(segment_summary)`,
  },
];

const aiSamples = [
  {
    starter: `Task: Summarize customer feedback into product themes.

Prompt draft:
"Summarize this feedback."`,
    sample: `You are a product analyst.

Task: Summarize customer feedback into product themes.

Return JSON with:
- themes: array of {name, evidence, severity}
- top_request: string
- risk_summary: string

Rules:
- Use only the provided feedback.
- Quote short evidence snippets.
- If evidence is weak, mark severity as "low".`,
  },
  {
    starter: `const prompt = "Extract the company name and issue from this support ticket";`,
    sample: `const schema = {
  company: "string",
  issue_type: "billing | product_bug | onboarding | cancellation",
  urgency: "low | medium | high",
  suggested_owner: "support | engineering | success"
};

const prompt = \`
Extract the support routing fields.
Return only JSON matching this schema:
\${JSON.stringify(schema)}
\`;`,
  },
  {
    starter: `documents = ["refund policy text", "pricing FAQ", "onboarding guide"]

# TODO: chunk, embed, retrieve, then answer with citations`,
    sample: `rag_plan = [
    "Split documents into 500-token chunks with overlap",
    "Embed each chunk and store source metadata",
    "Retrieve top 5 chunks for the user question",
    "Ask the model to answer only from retrieved context",
    "Return citations with document name and chunk id",
]`,
  },
  {
    starter: `tools = ["search_customer", "calculate_refund", "create_ticket"]

# TODO: define when the agent should call each tool`,
    sample: `tool_policy = {
    "search_customer": "Use first when a user asks about account-specific data.",
    "calculate_refund": "Use only after customer and order are identified.",
    "create_ticket": "Use when the issue cannot be fully resolved in chat.",
    "stop_rule": "If required data is missing, ask a clarifying question before using tools.",
}`,
  },
  {
    starter: `outputs = [...]

# TODO: score answer quality, groundedness, safety, latency, and cost`,
    sample: `eval_rubric = {
    "groundedness": "Does every factual claim come from context?",
    "task_success": "Did the answer solve the user's request?",
    "format": "Does output match the required schema?",
    "safety": "Does it avoid unsupported promises or sensitive leakage?",
    "cost_latency": "Is quality acceptable for the token and time budget?",
}`,
  },
];

function samplesFor(courseId: string) {
  if (courseId === "sql-mastery") return sqlSamples;
  if (courseId === "python-for-data") return pythonSamples;
  if (courseId === "data-science-ml") return mlSamples;
  return aiSamples;
}

const pythonModuleOne: ModuleMaterial = {
  richLessons: [
    {
      title: "Variables: storing values you will reuse",
      goal: "Understand what a variable is, how to create one, and why variables are the foundation of every data workflow.",
      explanation: [
        "A variable is a name that points to a value. Instead of typing the same value again and again, you store it once and reuse it by name.",
        "In data work, variables often store file names, column names, thresholds, dates, totals, filters, or intermediate results.",
        "Python creates a variable when you assign a value with the equals sign. You do not need to declare the type in advance.",
      ],
      syntax: `customer_name = "Aarav"
order_amount = 1299.50
orders_count = 3
is_active = True`,
      example: {
        title: "Calculate revenue from one order",
        code: `customer_name = "Aarav"
item_price = 999.00
delivery_fee = 49.00
tax_rate = 0.18

tax_amount = item_price * tax_rate
total_amount = item_price + delivery_fee + tax_amount

print(customer_name)
print(total_amount)`,
        notes: [
          "`item_price`, `delivery_fee`, and `tax_rate` are input variables.",
          "`tax_amount` and `total_amount` are calculated variables.",
          "This is the same mental model you use later when creating columns in Pandas.",
        ],
      },
      dataUseCase:
        "If you are preparing a weekly sales report, variables can store the report date, minimum order amount, output file name, and final revenue total.",
      mistakes: [
        {
          title: "Using spaces in variable names",
          wrong: `order amount = 1299`,
          fix: `order_amount = 1299`,
        },
        {
          title: "Using a variable before creating it",
          wrong: `total = order_amount + tax
order_amount = 1299`,
          fix: `order_amount = 1299
tax = 233.82
total = order_amount + tax`,
        },
      ],
      practice: [
        "Create variables for `customer_id`, `customer_city`, `orders_count`, and `total_revenue`.",
        "Create a variable called `average_order_value` by dividing total revenue by order count.",
        "Print one sentence that uses the customer city and average order value.",
      ],
    },
    {
      title: "Data types: text, numbers, and booleans",
      goal: "Learn the basic Python types that show up constantly in data cleaning and analysis.",
      explanation: [
        "A data type tells Python what kind of value it is working with. The same-looking value can behave differently depending on its type.",
        "The most common beginner types are string, integer, float, and boolean.",
        "Type issues are one of the most common reasons data scripts break. For example, the text value `'100'` cannot be added to the number `50` until you convert it.",
      ],
      syntax: `name = "Meera"       # str
age = 27             # int
revenue = 4500.75    # float
is_paid = True       # bool

print(type(name))
print(type(revenue))`,
      example: {
        title: "Convert raw order amount from text to number",
        code: `raw_order_amount = "1499.75"
raw_discount = "100"

order_amount = float(raw_order_amount)
discount = float(raw_discount)
final_amount = order_amount - discount

print(final_amount)
print(type(final_amount))`,
        notes: [
          "Raw data from CSV files often arrives as text.",
          "`float()` converts numeric-looking text into a decimal number.",
          "After conversion, Python can subtract, add, multiply, and divide correctly.",
        ],
      },
      dataUseCase:
        "When cleaning ecommerce data, order amounts, discounts, and tax values may arrive as strings. You convert them before calculating revenue.",
      mistakes: [
        {
          title: "Adding text and number directly",
          wrong: `amount = "100"
total = amount + 50`,
          fix: `amount = "100"
total = float(amount) + 50`,
        },
        {
          title: "Confusing boolean text with boolean value",
          wrong: `is_active = "False"
if is_active:
    print("Active")`,
          fix: `is_active = False
if is_active:
    print("Active")`,
        },
      ],
      practice: [
        "Create one variable of each type: string, integer, float, and boolean.",
        "Convert the string `'899.99'` into a float and add delivery fee `40`.",
        "Use `type()` to inspect three variables and write down what Python returns.",
      ],
    },
    {
      title: "Lists and dictionaries: storing collections of data",
      goal: "Understand the two collection types you will use before moving into Pandas DataFrames.",
      explanation: [
        "A list stores multiple values in order. It is useful when you have many values of the same kind, like order amounts or city names.",
        "A dictionary stores key-value pairs. It is useful when one record has named fields, like customer id, city, and revenue.",
        "A list of dictionaries is the beginner-friendly version of a table. Each dictionary is a row, and each key is like a column name.",
      ],
      syntax: `order_amounts = [499, 1299, 799]

customer = {
    "customer_id": 101,
    "city": "Mumbai",
    "revenue": 2598
}

orders = [
    {"order_id": 1, "amount": 499},
    {"order_id": 2, "amount": 1299},
]`,
      example: {
        title: "Summarize a list of order records",
        code: `orders = [
    {"order_id": 1, "customer_id": 101, "amount": 499},
    {"order_id": 2, "customer_id": 101, "amount": 1299},
    {"order_id": 3, "customer_id": 102, "amount": 799},
]

total_revenue = 0

for order in orders:
    total_revenue = total_revenue + order["amount"]

print(total_revenue)`,
        notes: [
          "`orders` is a list because there are multiple records.",
          "Each order is a dictionary because it has named fields.",
          "This pattern prepares you for row-wise thinking in datasets.",
        ],
      },
      dataUseCase:
        "API responses often return a list of dictionaries. Before analyzing in Pandas, you should be comfortable reading and summarizing this structure.",
      mistakes: [
        {
          title: "Using the wrong key name",
          wrong: `order = {"amount": 499}
print(order["revenue"])`,
          fix: `order = {"amount": 499}
print(order["amount"])`,
        },
        {
          title: "Forgetting list indexes start at zero",
          wrong: `cities = ["Delhi", "Mumbai", "Bengaluru"]
print(cities[1])  # expecting Delhi`,
          fix: `cities = ["Delhi", "Mumbai", "Bengaluru"]
print(cities[0])  # Delhi`,
        },
      ],
      practice: [
        "Create a list called `revenues` with five order amounts and calculate the total using `sum()`.",
        "Create a dictionary for one customer with id, city, orders count, and revenue.",
        "Create a list of three customer dictionaries and print each customer city.",
      ],
    },
    {
      title: "Operators and conditions: turning rules into logic",
      goal: "Learn how Python compares values, checks business rules, and chooses what to do next.",
      explanation: [
        "Data work is full of business rules: high-value orders, inactive customers, late deliveries, missing payments, risky accounts, and many more.",
        "Operators let you compare or calculate values. Conditions let your program decide what should happen when a rule is true or false.",
        "The most common comparison operators are `==`, `!=`, `>`, `<`, `>=`, and `<=`. The most common logical operators are `and`, `or`, and `not`.",
        "A clean condition should read almost like a sentence. If the rule is hard to explain, split it into smaller variables with meaningful names.",
      ],
      syntax: `amount = 1299
city = "Mumbai"
is_paid = True

is_high_value = amount >= 1000
is_priority_order = is_high_value and is_paid

if is_priority_order:
    print("Review first")
else:
    print("Normal queue")`,
      example: {
        title: "Classify orders by value and payment status",
        code: `orders = [
    {"order_id": 1, "amount": 499, "is_paid": True},
    {"order_id": 2, "amount": 1299, "is_paid": True},
    {"order_id": 3, "amount": 1599, "is_paid": False},
]

for order in orders:
    amount = order["amount"]
    is_paid = order["is_paid"]

    if amount >= 1000 and is_paid:
        label = "high_value_paid"
    elif amount >= 1000 and not is_paid:
        label = "high_value_unpaid"
    else:
        label = "standard"

    print(order["order_id"], label)`,
        notes: [
          "`if` handles the first rule that is true.",
          "`elif` means else-if and checks another rule only if the earlier rule failed.",
          "`else` catches everything that did not match earlier conditions.",
        ],
      },
      dataUseCase:
        "Before building dashboards or models, analysts often create rule-based labels such as high value, at risk, active, dormant, paid, unpaid, or priority.",
      mistakes: [
        {
          title: "Using assignment instead of comparison",
          wrong: `if amount = 1000:
    print("High value")`,
          fix: `if amount == 1000:
    print("Exactly 1000")`,
        },
        {
          title: "Writing a condition that is always true",
          wrong: `city = "Mumbai"
if city == "Mumbai" or "Delhi":
    print("Metro")`,
          fix: `city = "Mumbai"
if city == "Mumbai" or city == "Delhi":
    print("Metro")`,
        },
      ],
      practice: [
        "Create a rule that labels orders above `1000` as `high_value` and others as `standard`.",
        "Create a rule that marks customers as `active` only if orders count is above `0` and last order days is below `90`.",
        "Write three examples using `and`, `or`, and `not`.",
        "Explain in plain English what your condition checks before writing the Python code.",
      ],
    },
    {
      title: "Comments, naming, and debugging: making code readable",
      goal: "Learn the habits that make beginner Python scripts easier to understand, fix, and share.",
      explanation: [
        "Code is read more often than it is written. In data teams, your notebook or script may be reviewed by another analyst, manager, or your future self.",
        "Good names reduce confusion. `total_revenue` is better than `x` because it tells the reader what the value means.",
        "Comments should explain why a step exists, not repeat what the code already says. A useful comment captures an assumption, rule, or business reason.",
        "Debugging means finding where your actual output differs from your expected output. The fastest beginner debugging habit is printing intermediate values and checking their type.",
      ],
      syntax: `# Good: explains the business rule
high_value_threshold = 1000

# Check the type before doing revenue math
print(type(raw_amount))
print(raw_amount)`,
      example: {
        title: "Debug a messy amount before conversion",
        code: `raw_amount = " 1,299.50 "

print("Before cleaning:", raw_amount, type(raw_amount))

clean_amount = raw_amount.strip().replace(",", "")
amount = float(clean_amount)

print("After cleaning:", amount, type(amount))`,
        notes: [
          "`strip()` removes spaces at the beginning and end.",
          "`replace(',', '')` removes the thousands separator before float conversion.",
          "Printing before and after cleaning makes the transformation easy to verify.",
        ],
      },
      dataUseCase:
        "When importing messy CSV data, values may include spaces, commas, currency symbols, inconsistent capitalization, or blank strings. Debugging small examples first prevents bigger notebook failures later.",
      mistakes: [
        {
          title: "Using unclear variable names",
          wrong: `x = 1000
y = 0.18
z = x * y`,
          fix: `order_amount = 1000
tax_rate = 0.18
tax_amount = order_amount * tax_rate`,
        },
        {
          title: "Writing comments that repeat the code",
          wrong: `# Add amount to total
total = total + amount`,
          fix: `# Running total used for final revenue summary
total = total + amount`,
        },
      ],
      practice: [
        "Rename three unclear variables into business-readable names.",
        "Add comments to explain assumptions in your order summarizer.",
        "Print the value and type of a messy amount before and after cleaning.",
        "Create a small debugging checklist you will use before asking for help.",
      ],
    },
    {
      title: "Loops and functions: making your work reusable",
      goal: "Use loops to repeat work and functions to package logic you will need again.",
      explanation: [
        "A loop repeats the same action for every item in a collection. This is essential when you need to clean or summarize many records.",
        "A function is a reusable block of logic. Instead of copying the same cleaning steps again and again, you define them once and call them whenever needed.",
        "Good data code is usually small functions plus clear loops or transformations.",
      ],
      syntax: `for amount in [100, 200, 300]:
    print(amount * 1.18)

def add_tax(amount, tax_rate):
    return amount + (amount * tax_rate)

final_amount = add_tax(1000, 0.18)`,
      example: {
        title: "Clean and summarize order records",
        code: `orders = [
    {"order_id": 1, "amount": "499"},
    {"order_id": 2, "amount": "1299.50"},
    {"order_id": 3, "amount": ""},
]

def parse_amount(value):
    if value == "":
        return 0.0
    return float(value)

total_revenue = 0

for order in orders:
    amount = parse_amount(order["amount"])
    total_revenue = total_revenue + amount

print(total_revenue)`,
        notes: [
          "The function handles a messy value before conversion.",
          "The loop applies the same cleaning logic to every record.",
          "This is exactly the habit you need before writing larger Pandas cleaning pipelines.",
        ],
      },
      dataUseCase:
        "When raw data contains blanks, symbols, inconsistent capitalization, or numeric text, functions let you standardize the cleaning rules.",
      mistakes: [
        {
          title: "Forgetting to return from a function",
          wrong: `def add_tax(amount):
    final = amount * 1.18

total = add_tax(1000)`,
          fix: `def add_tax(amount):
    final = amount * 1.18
    return final

total = add_tax(1000)`,
        },
        {
          title: "Changing a variable inside a loop without updating the total",
          wrong: `total = 0
for amount in [100, 200]:
    amount + total`,
          fix: `total = 0
for amount in [100, 200]:
    total = total + amount`,
        },
      ],
      practice: [
        "Write a function `parse_amount(value)` that converts blank values to `0.0` and normal numeric text to float.",
        "Loop through five order records and calculate total revenue.",
        "Write a function `is_high_value(amount)` that returns `True` when amount is greater than 1000.",
      ],
    },
  ],
  theory: [],
  lab: {
    scenario:
      "You received raw order records from an internal tool. Amounts are text, some records have blank values, and the business needs total revenue plus a list of high-value orders.",
    steps: [
      "Create a list of at least six order dictionaries with `order_id`, `customer_id`, `city`, and `amount`.",
      "Write `parse_amount(value)` to convert amount text into a float and return `0.0` for blanks.",
      "Write `is_high_value(amount)` to identify orders greater than or equal to 1000.",
      "Write `classify_order(amount, is_paid)` to return `high_value_paid`, `high_value_unpaid`, or `standard`.",
      "Loop through every order, clean the amount, calculate total revenue, collect high-value orders, and build city-wise revenue.",
      "Print total revenue, average order value, number of high-value orders, city-wise revenue, and the labeled order records.",
      "Add at least four comments explaining business assumptions and print two debugging checks.",
    ],
    starter: `orders = [
    {"order_id": 1, "customer_id": 101, "city": "Mumbai", "amount": "499", "is_paid": True},
    {"order_id": 2, "customer_id": 102, "city": "Delhi", "amount": "1299.50", "is_paid": True},
    {"order_id": 3, "customer_id": 103, "city": "Bengaluru", "amount": "", "is_paid": True},
]

def parse_amount(value):
    # TODO
    pass

def is_high_value(amount):
    # TODO
    pass

def classify_order(amount, is_paid):
    # TODO
    pass

total_revenue = 0
high_value_orders = []
city_revenue = {}
labeled_orders = []

# TODO: loop through orders and calculate outputs`,
    expected:
      "A working script that cleans raw text amounts, handles blanks and comma-formatted values, calculates revenue metrics, labels orders, and prints a readable summary.",
  },
  assignment: {
    brief: "Build a beginner Python order summarizer from raw records.",
    tasks: [
      "Create a dataset of at least eight order dictionaries.",
      "Include at least two messy amount values: blank string, decimal string, or value with spaces.",
      "Create functions for parsing amount, checking high-value orders, and formatting a one-line summary.",
      "Calculate total revenue, average order value, high-value order count, and city-wise revenue.",
      "Create a rule-based label for every order using amount and payment status.",
      "Create one output list containing only orders that need manual review.",
      "Write five comments explaining why each major step exists.",
      "Add at least three debugging prints while developing, then leave only the useful final checks.",
      "Print the final summary in a clean readable format.",
    ],
  },
  solution: {
    approach: [
      "Represent raw records as a list of dictionaries so each order has named fields.",
      "Clean the amount before doing math. Never assume raw text is already numeric.",
      "Use functions to keep conversion and business rules separate from the main loop.",
      "Use a dictionary for city-wise revenue because each city maps to one accumulated value.",
      "Use readable variable names and comments so another learner can audit the logic.",
      "Validate the output by checking order count, revenue total, and one manually calculated example.",
    ],
    sample: `orders = [
    {"order_id": 1, "customer_id": 101, "city": "Mumbai", "amount": "499", "is_paid": True},
    {"order_id": 2, "customer_id": 102, "city": "Delhi", "amount": "1299.50", "is_paid": True},
    {"order_id": 3, "customer_id": 103, "city": "Bengaluru", "amount": "", "is_paid": True},
    {"order_id": 4, "customer_id": 104, "city": "Mumbai", "amount": " 899 ", "is_paid": True},
    {"order_id": 5, "customer_id": 105, "city": "Delhi", "amount": "1,799.00", "is_paid": False},
]

def parse_amount(value):
    value = value.strip().replace(",", "")
    if value == "":
        return 0.0
    return float(value)

def is_high_value(amount):
    return amount >= 1000

def classify_order(amount, is_paid):
    if amount >= 1000 and is_paid:
        return "high_value_paid"
    if amount >= 1000 and not is_paid:
        return "high_value_unpaid"
    return "standard"

def format_summary(total_revenue, orders_count, high_value_count):
    average_order_value = total_revenue / orders_count
    return (
        f"Revenue: {total_revenue:.2f} | "
        f"AOV: {average_order_value:.2f} | "
        f"High value orders: {high_value_count}"
    )

total_revenue = 0
high_value_orders = []
manual_review_orders = []
city_revenue = {}
labeled_orders = []

for order in orders:
    amount = parse_amount(order["amount"])
    total_revenue += amount

    city = order["city"]
    city_revenue[city] = city_revenue.get(city, 0) + amount

    if is_high_value(amount):
        high_value_orders.append(order["order_id"])

    label = classify_order(amount, order["is_paid"])
    labeled_orders.append({"order_id": order["order_id"], "label": label})

    if label == "high_value_unpaid":
        manual_review_orders.append(order["order_id"])

print(format_summary(total_revenue, len(orders), len(high_value_orders)))
print(city_revenue)
print(labeled_orders)
print("Manual review:", manual_review_orders)`,
  },
  test: [
    {
      question: "What is a variable in Python?",
      answer: "A variable is a name that stores or points to a value so you can reuse it later.",
    },
    {
      question: "Why does `'100' + 50` fail?",
      answer: "`'100'` is a string and `50` is an integer. Convert the string with `int()` or `float()` before adding.",
    },
    {
      question: "When would you use a dictionary instead of a list?",
      answer: "Use a dictionary when one record has named fields, such as customer id, city, and revenue.",
    },
    {
      question: "Why should amount cleaning be placed inside a function?",
      answer: "A function makes the cleaning rule reusable, testable, and easier to change later.",
    },
    {
      question: "What structure looks most like a small table before using Pandas?",
      answer: "A list of dictionaries, where each dictionary is one row and each key is a column-like field.",
    },
    {
      question: "What does `>=` mean in a condition?",
      answer: "`>=` means greater than or equal to. For example, `amount >= 1000` is true when amount is 1000 or more.",
    },
    {
      question: "What is the difference between `=` and `==`?",
      answer: "`=` assigns a value to a variable. `==` compares two values and returns true or false.",
    },
    {
      question: "Why is `city == 'Mumbai' or 'Delhi'` wrong?",
      answer: "Because `'Delhi'` is treated as a truthy value by itself. Write `city == 'Mumbai' or city == 'Delhi'`.",
    },
    {
      question: "What should a good comment explain?",
      answer: "A good comment explains the reason, assumption, or business rule behind the code, not just the syntax.",
    },
    {
      question: "What is one useful debugging habit before converting raw values?",
      answer: "Print the value and its type before and after cleaning so you know exactly what changed.",
    },
    {
      question: "Why are readable variable names important in data work?",
      answer: "They make the logic easier to audit, explain, reuse, and debug, especially when someone else reads the notebook.",
    },
    {
      question: "What should you validate after a loop summarizes records?",
      answer: "Check the number of processed records, manually verify one sample calculation, and compare totals against expectations.",
    },
  ],
};

function courseLens(courseId: string) {
  if (courseId === "sql-mastery") {
    return {
      artifact: "query",
      data: "business tables",
      stakeholder: "analytics lead",
      metric: "accuracy, readability, and business usefulness",
    };
  }
  if (courseId === "python-for-data") {
    return {
      artifact: "notebook",
      data: "raw datasets",
      stakeholder: "data manager",
      metric: "clean code, reproducible output, and insight quality",
    };
  }
  if (courseId === "data-science-ml") {
    return {
      artifact: "modeling notebook",
      data: "training dataset",
      stakeholder: "business owner",
      metric: "model quality, explainability, and decision impact",
    };
  }
  return {
    artifact: "AI workflow",
    data: "documents, prompts, and tool responses",
    stakeholder: "product team",
    metric: "groundedness, reliability, cost, and user value",
  };
}

export function getModuleMaterial(
  courseId: string,
  module: CourseModule,
  index: number
): ModuleMaterial {
  if (courseId === "python-for-data" && index === 0) {
    return pythonModuleOne;
  }

  const lens = courseLens(courseId);
  const sample = samplesFor(courseId)[index] ?? samplesFor(courseId)[0];

  return {
    theory: module.lessons.map((lesson, lessonIndex) => ({
      title: lesson,
      body:
        `${lesson} matters because it turns ${lens.data} into a decision-ready ${lens.artifact}. ` +
        `In real data work, the goal is not to memorize syntax; the goal is to make a reliable transformation that another person can inspect, reuse, and trust. ` +
        `As you study this lesson, focus on what input you start with, what output you need, and what assumptions could break the result.`,
      example:
        lessonIndex === 0
          ? `Working habit: write the smallest correct version first, inspect the result, then add filters, edge cases, and naming.`
          : lessonIndex === 1
          ? `Quality check: compare row counts, missing values, duplicate keys, and metric totals before and after your transformation.`
          : `Communication check: add a short note explaining what the output means and when it should not be used.`,
    })),
    lab: {
      scenario:
        `You are working with ${lens.data}. Your ${lens.stakeholder} needs a clean ${lens.artifact} that can be reviewed today. Start with the provided starter work, run one small step at a time, and document what changed.`,
      steps: [
        `Create a working file for "${module.title}" and copy the starter example.`,
        `Run the starter version and inspect the first result before changing anything.`,
        `Add one transformation at a time and write a short note for each assumption.`,
        `Check the output against ${lens.metric}.`,
        `Save the final version with clear names so it can be reused in the assignment.`,
      ],
      starter: sample.starter,
      expected:
        `A working ${lens.artifact} that produces the requested output, includes basic checks, and can be explained to a ${lens.stakeholder}.`,
    },
    assignment: {
      brief: module.assignment,
      tasks: [
        `Define the exact business question being answered in this module.`,
        `Prepare the input ${lens.data} and list any quality issues you find.`,
        `Build the required ${lens.artifact} using the module techniques.`,
        `Add at least three validation checks for correctness.`,
        `Write a five-bullet summary of what the result means and what you would do next.`,
      ],
    },
    solution: {
      approach: [
        `Start with the target output and work backward to the required fields.`,
        `Use simple intermediate steps instead of one large unreadable block.`,
        `Validate totals and record counts after every major transformation.`,
        `Name outputs clearly so another learner can understand the work without asking you.`,
      ],
      sample: sample.sample,
    },
    test: [
      {
        question: `What is the most important first step before building the ${lens.artifact}?`,
        answer: `Clarify the exact business question, required output, input data, and success metric.`,
      },
      {
        question: `Why should you validate intermediate results instead of only checking the final answer?`,
        answer: `Because errors are easier to find near the step that created them, and final outputs can look plausible while still being wrong.`,
      },
      {
        question: `What makes a solution production-friendly for this module?`,
        answer: `Clear naming, reproducible steps, documented assumptions, validation checks, and an output that matches stakeholder needs.`,
      },
    ],
  };
}
