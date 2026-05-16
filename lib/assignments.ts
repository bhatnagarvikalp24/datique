export type TestCase = {
  id: string;
  description: string;
  stdin: string;
  expectedOutput: string;
  hidden: boolean;
};

export type Assignment = {
  id: string;
  topicId: string;
  number: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  objective: string;
  problemStatement: string;
  requirements: string[];
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  bonusTask?: string;
};

export const ASSIGNMENTS: Assignment[] = [
  {
    id: "python-basics-1",
    topicId: "python",
    number: 1,
    title: "Student Marks & Eligibility Checker",
    difficulty: "easy",
    objective:
      "Build a Python program using variables, addition, and if-elif-else conditional statements to calculate student marks and determine their grade.",
    problemStatement: `Create a Python program that:
1. Reads marks for 3 subjects from input
2. Calculates the Total Marks and Average Marks
3. Determines whether the student Passed or Failed
4. Determines the student's Grade

Pass/Fail: Average ≥ 40 → "Pass", otherwise → "Fail"

Grade criteria:
- Average ≥ 90 → "A+"
- Average 75–89 → "A"
- Average 60–74 → "B"
- Average 40–59 → "C"
- Below 40 → "F"`,
    requirements: [
      "Use at least 5 variables",
      "Use addition (+) to compute total",
      "Compute average using division",
      "Use if-elif-else for pass/fail and grade",
      "Print output in the exact format shown",
    ],
    inputFormat:
      "Three integers on separate lines — marks for Maths, Science, and English respectively.",
    outputFormat: `Total Marks: <total>
Average: <average rounded to 2 decimal places>
Result: <Pass or Fail>
Grade: <A+, A, B, C, or F>`,
    examples: [
      {
        input: "85\n72\n90",
        output: "Total Marks: 247\nAverage: 82.33\nResult: Pass\nGrade: A",
        explanation: "Total = 247, Average = 82.33 → Pass, Grade A",
      },
      {
        input: "20\n30\n25",
        output: "Total Marks: 75\nAverage: 25.0\nResult: Fail\nGrade: F",
        explanation: "Total = 75, Average = 25.0 → Fail, Grade F",
      },
    ],
    starterCode: `# Student Marks & Eligibility Checker
# Read marks for 3 subjects (do not change the input lines)
maths = int(input())
science = int(input())
english = int(input())

# TODO: Calculate total marks using addition
total = 0  # Replace 0 with the correct expression

# TODO: Calculate average marks
average = 0  # Replace 0 with the correct expression

# TODO: Determine result — "Pass" if average >= 40, else "Fail"
result = ""  # Write your if-else logic here

# TODO: Determine grade using if-elif-else
grade = ""  # Write your if-elif-else logic here

# Output (do not change these lines)
print(f"Total Marks: {total}")
print(f"Average: {round(average, 2)}")
print(f"Result: {result}")
print(f"Grade: {grade}")
`,
    solution: `# Student Marks & Eligibility Checker

# Input
maths = int(input())
science = int(input())
english = int(input())

# Calculate total and average
total = maths + science + english
average = total / 3

# Pass / Fail
if average >= 40:
    result = "Pass"
else:
    result = "Fail"

# Grade
if average >= 90:
    grade = "A+"
elif average >= 75:
    grade = "A"
elif average >= 60:
    grade = "B"
elif average >= 40:
    grade = "C"
else:
    grade = "F"

# Output
print(f"Total Marks: {total}")
print(f"Average: {round(average, 2)}")
print(f"Result: {result}")
print(f"Grade: {grade}")

# Bonus
if average > 95:
    print("Outstanding Performance!")
`,
    testCases: [
      {
        id: "tc1",
        description: "Passing student — Grade A",
        stdin: "85\n72\n90",
        expectedOutput: "Total Marks: 247\nAverage: 82.33\nResult: Pass\nGrade: A",
        hidden: false,
      },
      {
        id: "tc2",
        description: "Failing student — Grade F",
        stdin: "20\n30\n25",
        expectedOutput: "Total Marks: 75\nAverage: 25.0\nResult: Fail\nGrade: F",
        hidden: false,
      },
      {
        id: "tc3",
        description: "Top scorer — Grade A+",
        stdin: "95\n97\n99",
        expectedOutput: "Total Marks: 291\nAverage: 97.0\nResult: Pass\nGrade: A+",
        hidden: true,
      },
      {
        id: "tc4",
        description: "Borderline pass — Grade C",
        stdin: "40\n40\n40",
        expectedOutput: "Total Marks: 120\nAverage: 40.0\nResult: Pass\nGrade: C",
        hidden: true,
      },
    ],
    bonusTask:
      'Add a condition: if average is above 95, print "Outstanding Performance!" after the grade output.',
  },
  {
    id: "python-basics-2",
    topicId: "python",
    number: 2,
    title: "ATM Machine Simulation",
    difficulty: "easy",
    objective:
      "Build a simple ATM system using variables, while loops, if-elif-else statements, arithmetic operations, and user input to simulate balance checking, deposits, and withdrawals.",
    problemStatement: `Create a Python program that simulates a basic ATM:

1. User starts with a balance of ₹10,000
2. A menu is shown repeatedly with four options:
   1. Check Balance
   2. Deposit Money
   3. Withdraw Money
   4. Exit
3. The user picks an option and the program responds accordingly.
4. The loop continues until the user selects Exit.

Rules:
- Deposit: amount must be greater than 0; add it to balance
- Withdraw: amount must be > 0 and ≤ current balance
- Exit: stop the loop immediately using break
- Any other choice: print "Invalid choice"`,
    requirements: [
      "Use a while True loop for the menu",
      "Use if-elif-else to handle all four menu choices",
      "Validate deposit amount (must be > 0)",
      "Validate withdrawal amount (must be > 0 and ≤ balance)",
      "Use break to exit the loop on choice 4",
      "Print output in the exact format shown",
    ],
    inputFormat: `Multiple lines of input simulating user responses.
First line: menu choice (1–4).
If choice is 2 or 3: next line is the amount.
Repeat until choice 4 is entered.`,
    outputFormat: `Welcome to ATM

1. Check Balance
2. Deposit
3. Withdraw
4. Exit

(After choice 1)
Current Balance: ₹<balance>

(After choice 2 — valid deposit)
Amount Deposited Successfully
Current Balance: ₹<balance>

(After choice 2 — invalid deposit)
Invalid amount. Please enter a positive value.

(After choice 3 — valid withdrawal)
Amount Withdrawn Successfully
Current Balance: ₹<balance>

(After choice 3 — insufficient funds)
Insufficient balance.

(After choice 3 — invalid amount)
Invalid amount. Please enter a positive value.

(After choice 4)
Thank you for using ATM. Goodbye!`,
    examples: [
      {
        input: "1\n4",
        output: `Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nCurrent Balance: ₹10000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!`,
        explanation: "User checks balance (₹10000) then exits.",
      },
      {
        input: "2\n5000\n3\n3000\n4",
        output: `Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nAmount Deposited Successfully\nCurrent Balance: ₹15000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nAmount Withdrawn Successfully\nCurrent Balance: ₹12000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!`,
        explanation: "Deposit ₹5000 → balance 15000, withdraw ₹3000 → balance 12000, then exit.",
      },
    ],
    starterCode: `# ATM Machine Simulation
balance = 10000

print("Welcome to ATM")

while True:
    print()
    print("1. Check Balance")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Exit")
    print()

    choice = int(input("Enter choice: "))

    if choice == 1:
        # TODO: Print current balance in format: Current Balance: ₹<balance>
        pass

    elif choice == 2:
        amount = int(input("Enter amount to deposit: "))
        # TODO: Validate amount > 0, then add to balance and print success message
        # If invalid, print: Invalid amount. Please enter a positive value.
        pass

    elif choice == 3:
        amount = int(input("Enter amount to withdraw: "))
        # TODO: Validate amount > 0 and amount <= balance
        # If insufficient balance, print: Insufficient balance.
        # If invalid amount, print: Invalid amount. Please enter a positive value.
        # Otherwise deduct and print success message
        pass

    elif choice == 4:
        print("Thank you for using ATM. Goodbye!")
        break

    else:
        print("Invalid choice")
`,
    solution: `# ATM Machine Simulation
balance = 10000

print("Welcome to ATM")

while True:
    print()
    print("1. Check Balance")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Exit")
    print()

    choice = int(input("Enter choice: "))

    if choice == 1:
        print(f"Current Balance: ₹{balance}")

    elif choice == 2:
        amount = int(input("Enter amount to deposit: "))
        if amount > 0:
            balance = balance + amount
            print("Amount Deposited Successfully")
            print(f"Current Balance: ₹{balance}")
        else:
            print("Invalid amount. Please enter a positive value.")

    elif choice == 3:
        amount = int(input("Enter amount to withdraw: "))
        if amount <= 0:
            print("Invalid amount. Please enter a positive value.")
        elif amount > balance:
            print("Insufficient balance.")
        else:
            balance = balance - amount
            print("Amount Withdrawn Successfully")
            print(f"Current Balance: ₹{balance}")

    elif choice == 4:
        print("Thank you for using ATM. Goodbye!")
        break

    else:
        print("Invalid choice")
`,
    testCases: [
      {
        id: "tc1",
        description: "Check balance then exit",
        stdin: "1\n4",
        expectedOutput: "Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nCurrent Balance: ₹10000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!",
        hidden: false,
      },
      {
        id: "tc2",
        description: "Deposit then withdraw then exit",
        stdin: "2\n5000\n3\n3000\n4",
        expectedOutput: "Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nAmount Deposited Successfully\nCurrent Balance: ₹15000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nAmount Withdrawn Successfully\nCurrent Balance: ₹12000\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!",
        hidden: false,
      },
      {
        id: "tc3",
        description: "Withdraw more than balance",
        stdin: "3\n15000\n4",
        expectedOutput: "Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nInsufficient balance.\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!",
        hidden: true,
      },
      {
        id: "tc4",
        description: "Deposit invalid (zero) amount",
        stdin: "2\n0\n4",
        expectedOutput: "Welcome to ATM\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nInvalid amount. Please enter a positive value.\n\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\n\nThank you for using ATM. Goodbye!",
        hidden: true,
      },
    ],
    bonusTask:
      "Bonus 1: After every transaction, ask 'Do you want another transaction? (yes/no)' and exit if the user types 'no'.\nBonus 2: Add PIN verification at the start — correct PIN is 1234, user gets only 3 attempts before the program exits.",
  },
  {
    id: "python-basics-3",
    topicId: "python",
    number: 3,
    title: "Smart Duplicate Attendance Detector",
    difficulty: "easy",
    objective:
      "Use sets and loops to detect duplicate entries in a list while preserving original order — without using list(set()) which destroys order.",
    problemStatement: `A school attendance system accidentally records multiple entries when students scan their ID cards more than once.

You are given this attendance list (hardcoded in your program):
attendance = ["Riya", "Aman", "Riya", "Karan", "Aman", "Neha", "Riya"]

Your task is to:
1. Find all students whose attendance was marked more than once
2. Print duplicate student names only once, in the order they first appeared as duplicates
3. Create a final clean attendance list without duplicates
4. Maintain the original order in the cleaned list

Important: You are NOT allowed to use list(set(attendance)) — it destroys the original order.`,
    requirements: [
      "Use a set (e.g. seen = set()) to track students already processed",
      "Do NOT use list(set(attendance)) to remove duplicates",
      "Print each duplicate name exactly once, in order of first duplicate occurrence",
      "The clean list must preserve the original order of first appearances",
      "Print output in the exact format shown",
    ],
    inputFormat:
      "No input required — the attendance list is hardcoded in the program.",
    outputFormat: `Duplicate Students:
Riya
Aman

Clean Attendance List:
['Riya', 'Aman', 'Karan', 'Neha']`,
    examples: [
      {
        input: "",
        output: "Duplicate Students:\nRiya\nAman\n\nClean Attendance List:\n['Riya', 'Aman', 'Karan', 'Neha']",
        explanation:
          "Riya appears 3 times, Aman appears 2 times — both are duplicates. The clean list keeps the first occurrence of each name in original order.",
      },
    ],
    starterCode: `# Smart Duplicate Attendance Detector
attendance = ["Riya", "Aman", "Riya", "Karan", "Aman", "Neha", "Riya"]

# TODO: Find and print duplicate students
# Hint: use a set called 'seen' to track what you've already processed
seen = set()

print("Duplicate Students:")
# Your duplicate-detection loop here

# TODO: Build a clean attendance list (no duplicates, original order preserved)
# Do NOT use: list(set(attendance))
clean = []
# Your order-preserving dedup loop here

print()
print("Clean Attendance List:")
print(clean)
`,
    solution: `# Smart Duplicate Attendance Detector
attendance = ["Riya", "Aman", "Riya", "Karan", "Aman", "Neha", "Riya"]

# Detect duplicates in order of first duplicate occurrence
seen = set()
duplicates = []
duplicates_set = set()

for student in attendance:
    if student in seen and student not in duplicates_set:
        duplicates.append(student)
        duplicates_set.add(student)
    seen.add(student)

print("Duplicate Students:")
for student in duplicates:
    print(student)

# Build clean list preserving original order
seen = set()
clean = []
for student in attendance:
    if student not in seen:
        clean.append(student)
        seen.add(student)

print()
print("Clean Attendance List:")
print(clean)
`,
    testCases: [
      {
        id: "tc1",
        description: "Standard attendance list — two duplicates",
        stdin: "",
        expectedOutput:
          "Duplicate Students:\nRiya\nAman\n\nClean Attendance List:\n['Riya', 'Aman', 'Karan', 'Neha']",
        hidden: false,
      },
    ],
    bonusTask:
      "Print the total number of extra scans at the end.\nExample output: 'Extra Scans: 3'\n(Riya scanned 2 extra times + Aman scanned 1 extra time = 3 total extra scans)",
  },
  {
    id: "python-basics-4",
    topicId: "python",
    number: 4,
    title: "The Suspicious Transaction Detector",
    difficulty: "medium",
    objective:
      "Use lists, dictionaries, sets, and tuples to build a fraud-detection style program that finds repeated transactions, counts unique ones, and aggregates spending per user.",
    problemStatement: `A payment company noticed that some users are making repeated transactions of the exact same amount within a short time.

You are given a list of transactions (hardcoded in your program):
transactions = [
    ("Aman", 500),
    ("Riya", 1200),
    ("Aman", 500),
    ("Karan", 300),
    ("Riya", 1200),
    ("Riya", 700)
]

Each tuple is (username, amount).

Your tasks:
1. Detect suspicious transactions — same user AND same amount appearing more than once. Print each suspicious transaction only once.
2. Count the total number of unique transactions.
3. Build a dictionary of User → Total Money Spent (sum of ALL their transactions, including duplicates).`,
    requirements: [
      "Use a set to detect duplicate (user, amount) tuples",
      "Print each suspicious transaction exactly once in order of first duplicate occurrence",
      "Count unique transactions using a set (not manual counting)",
      "Aggregate total spending per user in a dictionary using .get() or similar",
      "Print output in the exact format shown including the → arrow",
    ],
    inputFormat:
      "No input required — the transactions list is hardcoded in the program.",
    outputFormat: `Suspicious Transactions:
('Aman', 500)
('Riya', 1200)

Unique Transactions Count: 4

Total Spending:
Aman → 1000
Riya → 3100
Karan → 300`,
    examples: [
      {
        input: "",
        output:
          "Suspicious Transactions:\n('Aman', 500)\n('Riya', 1200)\n\nUnique Transactions Count: 4\n\nTotal Spending:\nAman → 1000\nRiya → 3100\nKaran → 300",
        explanation:
          "Aman's ₹500 and Riya's ₹1200 each appear twice → suspicious. 4 unique (user, amount) pairs exist. Riya's total = 1200+1200+700 = 3100.",
      },
    ],
    starterCode: `# Suspicious Transaction Detector
transactions = [
    ("Aman", 500),
    ("Riya", 1200),
    ("Aman", 500),
    ("Karan", 300),
    ("Riya", 1200),
    ("Riya", 700)
]

# TODO: Detect suspicious transactions
# A transaction is suspicious if the same (user, amount) tuple appears more than once
# Print each suspicious transaction only once
seen = set()

print("Suspicious Transactions:")
# Your loop here

# TODO: Count unique transactions (use a set)
print()
print(f"Unique Transactions Count: ???")

# TODO: Build a spending dictionary  {user: total_amount}
spending = {}
# Your loop here

print()
print("Total Spending:")
# Print each user → total in original order
`,
    solution: `# Suspicious Transaction Detector
transactions = [
    ("Aman", 500),
    ("Riya", 1200),
    ("Aman", 500),
    ("Karan", 300),
    ("Riya", 1200),
    ("Riya", 700)
]

# 1. Detect suspicious transactions
seen = set()
suspicious = []
suspicious_set = set()

for txn in transactions:
    if txn in seen and txn not in suspicious_set:
        suspicious.append(txn)
        suspicious_set.add(txn)
    seen.add(txn)

print("Suspicious Transactions:")
for txn in suspicious:
    print(txn)

# 2. Unique transaction count
unique_count = len(set(transactions))
print()
print(f"Unique Transactions Count: {unique_count}")

# 3. Total spending per user
spending = {}
for user, amount in transactions:
    spending[user] = spending.get(user, 0) + amount

print()
print("Total Spending:")
for user, total in spending.items():
    print(f"{user} → {total}")
`,
    testCases: [
      {
        id: "tc1",
        description: "Standard transaction list — two suspicious pairs",
        stdin: "",
        expectedOutput:
          "Suspicious Transactions:\n('Aman', 500)\n('Riya', 1200)\n\nUnique Transactions Count: 4\n\nTotal Spending:\nAman → 1000\nRiya → 3100\nKaran → 300",
        hidden: false,
      },
    ],
    bonusTask:
      "After the spending summary, print the user who spent the most money.\nExpected output: 'Highest Spender: Riya'",
  },
];

export function getTopicAssignments(topicId: string): Assignment[] {
  return ASSIGNMENTS.filter((a) => a.topicId === topicId);
}

export function getAssignment(topicId: string, assignmentId: string): Assignment | undefined {
  return ASSIGNMENTS.find((a) => a.topicId === topicId && a.id === assignmentId);
}
