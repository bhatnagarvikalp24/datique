import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Assignment } from "./assignments";

/* ─── design tokens ─── */
const C = {
  teal:     "#0f766e",
  tealLight:"#ccfbf1",
  dark:     "#0f172a",
  heading:  "#1e293b",
  body:     "#374151",
  muted:    "#6b7280",
  faint:    "#9ca3af",
  border:   "#e5e7eb",
  bgLight:  "#f9fafb",
  bgCode:   "#f3f4f6",
  amber:    "#d97706",
  amberBg:  "#fffbeb",
  amberBdr: "#fcd34d",
};

/* ─── styles ─── */
const s = StyleSheet.create({
  /* page */
  page: {
    paddingTop: 52,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: C.body,
    lineHeight: 1.6,
  },

  /* ── COVER ── */
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Helvetica",
  },
  coverSidebar: {
    width: 8,
    backgroundColor: C.teal,
  },
  coverMain: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 56,
  },
  coverBrand: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: C.teal,
    fontFamily: "Helvetica-Bold",
    marginBottom: 48,
  },
  coverHeadingType: {
    fontSize: 13,
    color: C.muted,
    fontFamily: "Helvetica",
    marginBottom: 6,
  },
  coverHeadingTopic: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    lineHeight: 1.15,
    marginBottom: 20,
  },
  coverTagline: {
    fontSize: 13,
    color: C.muted,
    marginBottom: 64,
    lineHeight: 1.5,
  },
  coverDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 24,
  },
  coverMetaRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  coverMetaKey: {
    fontSize: 10,
    color: C.faint,
    width: 90,
  },
  coverMetaVal: {
    fontSize: 10,
    color: C.heading,
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },

  /* ── RUNNING HEADER ── */
  runningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 10,
    marginBottom: 32,
  },
  runningBrand: {
    fontSize: 9,
    color: C.teal,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  runningTitle: {
    fontSize: 9,
    color: C.faint,
  },

  /* ── ASSIGNMENT BLOCK ── */
  assignmentBlock: {
    marginBottom: 8,
  },

  /* number + difficulty row */
  assignmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  assignmentNumBadge: {
    backgroundColor: C.teal,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  assignmentNumText: {
    fontSize: 9,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  difficultyText: {
    fontSize: 9,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  /* title */
  assignmentTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginBottom: 16,
    lineHeight: 1.3,
  },

  /* section */
  sectionGap: { marginTop: 18 },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.teal,
    letterSpacing: 1.8,
    marginBottom: 6,
    borderLeftWidth: 2,
    borderLeftColor: C.teal,
    paddingLeft: 6,
  },
  sectionBody: {
    fontSize: 11,
    color: C.body,
    lineHeight: 1.7,
  },

  /* bullet list */
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 14,
    fontSize: 11,
    color: C.teal,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: C.body,
    lineHeight: 1.6,
  },

  /* code / examples */
  codeBlock: {
    fontFamily: "Courier",
    fontSize: 9.5,
    backgroundColor: C.bgCode,
    borderLeftWidth: 3,
    borderLeftColor: C.border,
    padding: 12,
    lineHeight: 1.55,
    color: C.dark,
    marginTop: 4,
  },
  exampleRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  exampleCol: {
    flex: 1,
  },
  exampleColRight: {
    flex: 1,
    marginLeft: 12,
  },
  exampleColLabel: {
    fontSize: 9,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  /* bonus */
  bonusBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: C.amberBdr,
    backgroundColor: C.amberBg,
    padding: 12,
  },
  bonusLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.amber,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  bonusText: {
    fontSize: 11,
    color: "#78350f",
    lineHeight: 1.6,
  },

  /* divider between assignments */
  assignmentDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginTop: 32,
    marginBottom: 32,
  },

  /* page number */
  pageNumber: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageNumberBrand: {
    fontSize: 8,
    color: C.faint,
  },
  pageNumberNum: {
    fontSize: 8,
    color: C.faint,
  },
});

/* ─────────────── shared pieces ─────────────── */

function PageFooter({ brand }: { brand: string }) {
  return (
    <View style={s.pageNumber} fixed>
      <Text style={s.pageNumberBrand}>{brand}</Text>
      <Text
        style={s.pageNumberNum}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

function RunningHeader({ left, right }: { left: string; right: string }) {
  return (
    <View style={s.runningHeader} fixed>
      <Text style={s.runningBrand}>{left}</Text>
      <Text style={s.runningTitle}>{right}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/* ─────────────── Cover page ─────────────── */

function CoverPage({
  shortTitle,
  docType,
  count,
  countLabel,
  tagline,
}: {
  shortTitle: string;
  docType: string;
  count: number;
  countLabel: string;
  tagline: string;
}) {
  return (
    <Page size="A4" style={{ flexDirection: "row" }}>
      <View style={s.coverSidebar} />
      <View style={s.coverMain}>
        <Text style={s.coverBrand}>DATAPATH ACADEMY</Text>

        <Text style={s.coverHeadingType}>{docType}</Text>
        <Text style={s.coverHeadingTopic}>{shortTitle}</Text>
        <Text style={s.coverTagline}>{tagline}</Text>

        <View style={s.coverDivider} />

        <View style={s.coverMetaRow}>
          <Text style={s.coverMetaKey}>Topic</Text>
          <Text style={s.coverMetaVal}>{shortTitle}</Text>
        </View>
        <View style={s.coverMetaRow}>
          <Text style={s.coverMetaKey}>{countLabel}</Text>
          <Text style={s.coverMetaVal}>{count}</Text>
        </View>
        <View style={s.coverMetaRow}>
          <Text style={s.coverMetaKey}>Access</Text>
          <Text style={s.coverMetaVal}>Lifetime</Text>
        </View>
        <View style={s.coverMetaRow}>
          <Text style={s.coverMetaKey}>Publisher</Text>
          <Text style={s.coverMetaVal}>DataPath Academy</Text>
        </View>
      </View>
    </Page>
  );
}

/* ─────────────── Assignment block ─────────────── */

function AssignmentBlock({ assignment }: { assignment: Assignment }) {
  return (
    <View style={s.assignmentBlock}>
      {/* number + difficulty */}
      <View style={s.assignmentMeta}>
        <View style={s.assignmentNumBadge}>
          <Text style={s.assignmentNumText}>
            ASSIGNMENT {String(assignment.number).padStart(2, "0")}
          </Text>
        </View>
        <Text style={s.difficultyText}>
          {assignment.difficulty.toUpperCase()}
        </Text>
      </View>

      {/* title */}
      <Text style={s.assignmentTitle}>{assignment.title}</Text>

      {/* objective */}
      <SectionLabel>OBJECTIVE</SectionLabel>
      <Text style={s.sectionBody}>{assignment.objective}</Text>

      {/* problem */}
      <View style={s.sectionGap} />
      <SectionLabel>PROBLEM STATEMENT</SectionLabel>
      <Text style={s.sectionBody}>{assignment.problemStatement}</Text>

      {/* requirements */}
      <View style={s.sectionGap} />
      <SectionLabel>REQUIREMENTS</SectionLabel>
      <BulletList items={assignment.requirements} />

      {/* input format */}
      <View style={s.sectionGap} />
      <SectionLabel>INPUT FORMAT</SectionLabel>
      <Text style={s.sectionBody}>{assignment.inputFormat}</Text>

      {/* output format */}
      <View style={s.sectionGap} />
      <SectionLabel>OUTPUT FORMAT</SectionLabel>
      <Text style={s.codeBlock}>{assignment.outputFormat}</Text>

      {/* examples */}
      {assignment.examples.map((ex, i) => (
        <View key={i}>
          <View style={s.sectionGap} />
          <SectionLabel>{`EXAMPLE ${i + 1}`}</SectionLabel>
          <View style={s.exampleRow}>
            <View style={s.exampleCol}>
              <Text style={s.exampleColLabel}>INPUT</Text>
              <Text style={s.codeBlock}>{ex.input}</Text>
            </View>
            <View style={s.exampleColRight}>
              <Text style={s.exampleColLabel}>EXPECTED OUTPUT</Text>
              <Text style={s.codeBlock}>{ex.output}</Text>
            </View>
          </View>
          {ex.explanation ? (
            <Text style={{ fontSize: 9.5, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>
              {ex.explanation}
            </Text>
          ) : null}
        </View>
      ))}

      {/* bonus */}
      {assignment.bonusTask ? (
        <View style={s.bonusBox}>
          <Text style={s.bonusLabel}>BONUS TASK</Text>
          <Text style={s.bonusText}>{assignment.bonusTask}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ─────────────── Solution block ─────────────── */

function SolutionBlock({ assignment }: { assignment: Assignment }) {
  return (
    <View style={s.assignmentBlock}>
      <View style={s.assignmentMeta}>
        <View style={s.assignmentNumBadge}>
          <Text style={s.assignmentNumText}>
            SOLUTION {String(assignment.number).padStart(2, "0")}
          </Text>
        </View>
        <Text style={s.difficultyText}>{assignment.difficulty.toUpperCase()}</Text>
      </View>

      <Text style={s.assignmentTitle}>{assignment.title}</Text>

      <SectionLabel>PROBLEM RECAP</SectionLabel>
      <Text style={s.sectionBody}>{assignment.objective}</Text>

      <View style={s.sectionGap} />
      <SectionLabel>FULL SOLUTION</SectionLabel>
      <Text style={s.codeBlock}>{assignment.solution}</Text>

      {assignment.bonusTask ? (
        <View style={{ marginTop: 18 }}>
          <SectionLabel>BONUS NOTE</SectionLabel>
          <Text style={s.sectionBody}>{assignment.bonusTask}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ─────────────── Single-assignment documents ─────────────── */

export function AssignmentPDF({
  topicTitle,
  topicShortTitle,
  assignment,
}: {
  topicTitle: string;
  topicShortTitle: string;
  assignment: Assignment;
}) {
  return (
    <Document title={`${topicShortTitle} — Assignment ${String(assignment.number).padStart(2, "0")}`} author="DataPath Academy">
      <CoverPage
        shortTitle={topicShortTitle}
        docType={`Assignment ${String(assignment.number).padStart(2, "0")}`}
        count={assignment.number}
        countLabel="Assignment"
        tagline={assignment.title}
      />
      <Page size="A4" style={s.page}>
        <RunningHeader
          left="DATAPATH ACADEMY"
          right={`${topicShortTitle} — Assignment ${String(assignment.number).padStart(2, "0")}`}
        />
        <AssignmentBlock assignment={assignment} />
        <PageFooter brand="DataPath Academy · datapath.academy" />
      </Page>
    </Document>
  );
}

export function SolutionPDF({
  topicTitle,
  topicShortTitle,
  assignment,
}: {
  topicTitle: string;
  topicShortTitle: string;
  assignment: Assignment;
}) {
  return (
    <Document title={`${topicShortTitle} — Solution ${String(assignment.number).padStart(2, "0")}`} author="DataPath Academy">
      <CoverPage
        shortTitle={topicShortTitle}
        docType={`Solution ${String(assignment.number).padStart(2, "0")}`}
        count={assignment.number}
        countLabel="Solution"
        tagline={assignment.title}
      />
      <Page size="A4" style={s.page}>
        <RunningHeader
          left="DATAPATH ACADEMY"
          right={`${topicShortTitle} — Solution ${String(assignment.number).padStart(2, "0")}`}
        />
        <SolutionBlock assignment={assignment} />
        <PageFooter brand="DataPath Academy · datapath.academy" />
      </Page>
    </Document>
  );
}

/* ─────────────── Bulk documents (all assignments) ─────────────── */

export function AssignmentsPDF({
  topicTitle,
  topicShortTitle,
  assignments,
}: {
  topicTitle: string;
  topicShortTitle: string;
  assignments: Assignment[];
}) {
  return (
    <Document title={`${topicTitle} — Assignments`} author="DataPath Academy">
      <CoverPage
        shortTitle={topicShortTitle}
        docType="Assignments"
        count={assignments.length}
        countLabel="Assignments"
        tagline={`${assignments.length} graded assignment${assignments.length !== 1 ? "s" : ""} with examples, requirements, and bonus tasks.`}
      />

      <Page size="A4" style={s.page}>
        <RunningHeader
          left="DATAPATH ACADEMY"
          right={`${topicShortTitle} — Assignments`}
        />

        {assignments.map((a, i) => (
          <View key={a.id}>
            <AssignmentBlock assignment={a} />
            {i < assignments.length - 1 && (
              <View style={s.assignmentDivider} />
            )}
          </View>
        ))}

        <PageFooter brand="DataPath Academy · datapath.academy" />
      </Page>
    </Document>
  );
}

export function SolutionsPDF({
  topicTitle,
  topicShortTitle,
  assignments,
}: {
  topicTitle: string;
  topicShortTitle: string;
  assignments: Assignment[];
}) {
  return (
    <Document title={`${topicTitle} — Solutions`} author="DataPath Academy">
      <CoverPage
        shortTitle={topicShortTitle}
        docType="Solutions"
        count={assignments.length}
        countLabel="Solutions"
        tagline={`Complete, explained solutions for all ${assignments.length} assignment${assignments.length !== 1 ? "s" : ""}.`}
      />

      <Page size="A4" style={s.page}>
        <RunningHeader
          left="DATAPATH ACADEMY"
          right={`${topicShortTitle} — Solutions`}
        />

        {assignments.map((a, i) => (
          <View key={a.id}>
            <SolutionBlock assignment={a} />
            {i < assignments.length - 1 && (
              <View style={s.assignmentDivider} />
            )}
          </View>
        ))}

        <PageFooter brand="DataPath Academy · datapath.academy" />
      </Page>
    </Document>
  );
}
