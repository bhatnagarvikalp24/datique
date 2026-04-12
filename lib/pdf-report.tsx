import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ProfileReport } from "./evaluator";

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  rose:    "#f43f5e",
  roseDark:"#be123c",
  roseLight:"#fff1f2",
  roseMid: "#fecdd3",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6b7280",
  gray300: "#d1d5db",
  gray100: "#f3f4f6",
  white:   "#ffffff",
  green:   "#16a34a",
  greenBg: "#f0fdf4",
  amber:   "#d97706",
  amberBg: "#fffbeb",
  red:     "#dc2626",
  redBg:   "#fef2f2",
  blue:    "#2563eb",
  blueBg:  "#eff6ff",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  // Cover header band
  coverBand: {
    backgroundColor: C.rose,
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 30,
  },
  coverBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  coverDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.white,
    marginRight: 8,
  },
  coverBrand: {
    fontSize: 11,
    color: C.roseMid,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1.25,
    marginBottom: 8,
  },
  coverTagline: {
    fontSize: 13,
    color: C.roseMid,
    marginBottom: 20,
  },
  coverMeta: {
    flexDirection: "row",
    gap: 16,
  },
  coverMetaChip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  coverMetaText: {
    fontSize: 10,
    color: C.white,
  },

  // Content area
  content: {
    paddingHorizontal: 40,
    paddingTop: 28,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 24,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    backgroundColor: C.rose,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: C.gray500,
    marginTop: 2,
  },

  // Cards
  card: {
    backgroundColor: C.gray100,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  cardRose: {
    backgroundColor: C.roseLight,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: C.rose,
  },

  // Score pill
  scorePill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  scorePillText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  // Big score ring area
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 14,
  },
  bigScoreBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.rose,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bigScoreNum: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1,
  },
  bigScoreLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  scoreRightCol: {
    flex: 1,
  },

  // Dimension bars
  dimRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dimLabel: {
    fontSize: 9,
    color: C.gray700,
    width: 110,
  },
  dimBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: C.gray300,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  dimBarFill: {
    height: 6,
    backgroundColor: C.rose,
    borderRadius: 3,
  },
  dimScore: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.gray700,
    width: 20,
    textAlign: "right",
  },

  // Photo card
  photoCard: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.gray300,
    padding: 12,
    marginBottom: 10,
  },
  photoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  photoNum: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
  },
  verdictChip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  verdictText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  // Bullet lists
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bulletDot: {
    fontSize: 10,
    color: C.rose,
    marginRight: 6,
    marginTop: 1,
    width: 10,
  },
  bulletText: {
    fontSize: 9,
    color: C.gray700,
    flex: 1,
    lineHeight: 1.5,
  },

  // Prompt cards
  promptCard: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.gray300,
    padding: 12,
    marginBottom: 10,
  },
  promptOriginalBox: {
    backgroundColor: C.gray100,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  promptOriginalText: {
    fontSize: 9,
    color: C.gray700,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.5,
  },
  promptRewriteBox: {
    backgroundColor: C.roseLight,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
    borderLeftWidth: 2,
    borderLeftColor: C.rose,
  },
  promptRewriteLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.rose,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  promptRewriteText: {
    fontSize: 9,
    color: C.gray900,
    lineHeight: 1.5,
  },

  // Quick wins
  quickWinCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  quickWinNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.rose,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  quickWinNumText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  quickWinRight: {
    flex: 1,
  },
  quickWinAction: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
    marginBottom: 3,
  },
  quickWinWhy: {
    fontSize: 9,
    color: C.gray700,
    lineHeight: 1.5,
  },
  effortChip: {
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  effortText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // Text styles
  body: {
    fontSize: 10,
    color: C.gray700,
    lineHeight: 1.6,
  },
  bodyBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
    lineHeight: 1.6,
  },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  divider: {
    height: 1,
    backgroundColor: C.gray300,
    marginVertical: 16,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 16,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: C.gray500,
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.rose,
  },

  // Closing note box
  closingBox: {
    backgroundColor: C.roseLight,
    borderRadius: 10,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.roseMid,
  },
  closingTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.roseDark,
    marginBottom: 6,
  },
  closingText: {
    fontSize: 10,
    color: C.gray700,
    lineHeight: 1.6,
  },

  // Rewrite bio box
  bioRewriteBox: {
    backgroundColor: C.blueBg,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: C.blue,
    marginTop: 8,
  },
  bioRewriteLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  bioRewriteText: {
    fontSize: 10,
    color: C.gray900,
    lineHeight: 1.65,
    fontFamily: "Helvetica-Oblique",
  },

  // Vibe section
  vibeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  vibeBox: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
  },
  vibeLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  vibeText: {
    fontSize: 9,
    lineHeight: 1.5,
  },

  // Strengths
  strengthRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  strengthIcon: {
    fontSize: 10,
    marginRight: 8,
    color: C.green,
  },
  strengthText: {
    fontSize: 10,
    color: C.gray700,
    flex: 1,
    lineHeight: 1.5,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 8) return C.green;
  if (score >= 5) return C.amber;
  return C.red;
}
function scoreBg(score: number) {
  if (score >= 8) return C.greenBg;
  if (score >= 5) return C.amberBg;
  return C.redBg;
}
function verdictColor(v: string) {
  if (v === "Keep") return C.green;
  if (v === "Improve") return C.amber;
  return C.red;
}
function verdictBg(v: string) {
  if (v === "Keep") return C.greenBg;
  if (v === "Improve") return C.amberBg;
  return C.redBg;
}
function effortColor(e: string) {
  if (e === "Low") return C.green;
  if (e === "Medium") return C.amber;
  return C.red;
}
function effortBg(e: string) {
  if (e === "Low") return C.greenBg;
  if (e === "Medium") return C.amberBg;
  return C.redBg;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionAccent} />
      <View>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle && <Text style={s.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function Bullet({ text, color }: { text: string; color?: string }) {
  return (
    <View style={s.bulletRow}>
      <Text style={[s.bulletDot, color ? { color } : {}]}>•</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

function DimBar({ label, score }: { label: string; score: number }) {
  return (
    <View style={s.dimRow}>
      <Text style={s.dimLabel}>{label}</Text>
      <View style={s.dimBarBg}>
        <View style={[s.dimBarFill, { width: `${score * 10}%`, backgroundColor: scoreColor(score) }]} />
      </View>
      <Text style={[s.dimScore, { color: scoreColor(score) }]}>{score}/10</Text>
    </View>
  );
}

function PageFooter({ page, name }: { page: string; name: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{name} · Datique Profile Report</Text>
      <Text style={s.footerText}>{page}</Text>
      <Text style={s.footerBrand}>datique.app</Text>
    </View>
  );
}

// ─── Main Document ────────────────────────────────────────────────────────────

export function ProfileReportPDF({
  report,
  submissionMeta,
}: {
  report: ProfileReport;
  submissionMeta: { name: string | null; age: number; app: string };
}) {
  const displayName = submissionMeta.name ?? "Your Profile";
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`Datique Report — ${displayName}`}
      author="Datique AI"
      subject="Dating Profile Review"
    >
      {/* ── PAGE 1: Cover + Overall Score + Quick Wins ── */}
      <Page size="A4" style={s.page}>
        {/* Cover band */}
        <View style={s.coverBand}>
          <View style={s.coverBrandRow}>
            <View style={s.coverDot} />
            <Text style={s.coverBrand}>MATCHFIX AI · PROFILE REVIEW</Text>
          </View>
          <Text style={s.coverTitle}>
            {displayName}&apos;s{"\n"}{submissionMeta.app} Review
          </Text>
          <Text style={s.coverTagline}>&quot;{report.tagline}&quot;</Text>
          <View style={s.coverMeta}>
            <View style={s.coverMetaChip}>
              <Text style={s.coverMetaText}>Age {submissionMeta.age}</Text>
            </View>
            <View style={s.coverMetaChip}>
              <Text style={s.coverMetaText}>{submissionMeta.app}</Text>
            </View>
            <View style={s.coverMetaChip}>
              <Text style={s.coverMetaText}>{today}</Text>
            </View>
          </View>
        </View>

        <View style={s.content}>
          {/* Overall score + dimensions */}
          <SectionHeader title="Overall Score" subtitle="How your profile stacks up across 5 key dimensions" />

          <View style={s.scoreRow}>
            <View style={s.bigScoreBox}>
              <Text style={s.bigScoreNum}>{report.overallScore}</Text>
              <Text style={s.bigScoreLabel}>/ 100</Text>
            </View>
            <View style={s.scoreRightCol}>
              <Text style={[s.body, { marginBottom: 8 }]}>{report.tldr}</Text>
            </View>
          </View>

          <View style={s.card}>
            <Text style={s.label}>DIMENSION BREAKDOWN</Text>
            <DimBar label="Photo Quality" score={report.dimensions.photoQuality} />
            <DimBar label="Photo Variety" score={report.dimensions.photoVariety} />
            <DimBar label="Bio Authenticity" score={report.dimensions.bioAuthenticity} />
            <DimBar label="Humor & Wit" score={report.dimensions.humorWit} />
            <DimBar label="Intent Clarity" score={report.dimensions.intentClarity} />
          </View>

          <View style={s.divider} />

          {/* Quick Wins */}
          <SectionHeader title="Your 3 Highest-Impact Fixes" subtitle="Do these first — they'll move the needle the most" />

          {report.quickWins.map((w) => (
            <View key={w.priority} style={[s.quickWinCard, { backgroundColor: C.gray100 }]}>
              <View style={s.quickWinNum}>
                <Text style={s.quickWinNumText}>{w.priority}</Text>
              </View>
              <View style={s.quickWinRight}>
                <Text style={s.quickWinAction}>{w.action}</Text>
                <Text style={s.quickWinWhy}>{w.why}</Text>
                <View style={[s.effortChip, { backgroundColor: effortBg(w.effort) }]}>
                  <Text style={[s.effortText, { color: effortColor(w.effort) }]}>
                    {w.effort} Effort
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Strengths */}
          <View style={s.divider} />
          <SectionHeader title="What&apos;s Already Working" subtitle="Build on these — don't change them" />
          <View style={s.card}>
            {report.strengths.map((s_text, i) => (
              <View key={i} style={s.strengthRow}>
                <Text style={s.strengthIcon}>✓</Text>
                <Text style={s.strengthText}>{s_text}</Text>
              </View>
            ))}
          </View>
        </View>

        <PageFooter page="1 of 3" name={displayName} />
      </Page>

      {/* ── PAGE 2: Photos ── */}
      <Page size="A4" style={s.page}>
        <View style={[s.coverBand, { paddingTop: 24, paddingBottom: 20 }]}>
          <Text style={[s.coverBrand, { marginBottom: 6 }]}>MATCHFIX AI · PROFILE REVIEW</Text>
          <Text style={[s.coverTitle, { fontSize: 20, marginBottom: 0 }]}>Photo Analysis</Text>
        </View>

        <View style={s.content}>
          <View style={[s.cardRose, { marginBottom: 14 }]}>
            <Text style={s.label}>PHOTO STRATEGY OVERVIEW</Text>
            <Text style={s.body}>{report.photosOverview}</Text>
            {report.recommendedPhotoOrder.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={[s.label, { marginBottom: 4 }]}>RECOMMENDED ORDER</Text>
                <Text style={s.body}>
                  {report.recommendedPhotoOrder.map((n) => `Photo ${n}`).join("  →  ")}
                </Text>
              </View>
            )}
          </View>

          {report.photos.map((photo) => (
            <View key={photo.photoNumber} style={s.photoCard}>
              <View style={s.photoCardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={s.photoNum}>Photo {photo.photoNumber}</Text>
                  <View style={[s.scorePill, { backgroundColor: scoreBg(photo.score) }]}>
                    <Text style={[s.scorePillText, { color: scoreColor(photo.score) }]}>
                      {photo.score}/10
                    </Text>
                  </View>
                </View>
                <View style={[s.verdictChip, { backgroundColor: verdictBg(photo.verdict) }]}>
                  <Text style={[s.verdictText, { color: verdictColor(photo.verdict) }]}>
                    {photo.verdict}
                  </Text>
                </View>
              </View>

              {photo.strengths.length > 0 && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={s.label}>STRENGTHS</Text>
                  {photo.strengths.map((st, i) => <Bullet key={i} text={st} color={C.green} />)}
                </View>
              )}

              {photo.issues.length > 0 && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={s.label}>ISSUES</Text>
                  {photo.issues.map((is, i) => <Bullet key={i} text={is} color={C.red} />)}
                </View>
              )}

              <View style={[s.card, { marginBottom: 0, backgroundColor: C.amberBg }]}>
                <Text style={[s.label, { color: C.amber }]}>TIP</Text>
                <Text style={s.body}>{photo.tip}</Text>
              </View>
            </View>
          ))}
        </View>

        <PageFooter page="2 of 3" name={displayName} />
      </Page>

      {/* ── PAGE 3: Prompts + Vibe + Bio Rewrite + Closing ── */}
      <Page size="A4" style={s.page}>
        <View style={[s.coverBand, { paddingTop: 24, paddingBottom: 20 }]}>
          <Text style={[s.coverBrand, { marginBottom: 6 }]}>MATCHFIX AI · PROFILE REVIEW</Text>
          <Text style={[s.coverTitle, { fontSize: 20, marginBottom: 0 }]}>Prompts, Vibe & Bio</Text>
        </View>

        <View style={s.content}>
          {/* Prompts */}
          <SectionHeader title="Prompt-by-Prompt Breakdown" subtitle="Each prompt scored, critiqued, and rewritten" />
          <View style={[s.card, { marginBottom: 12 }]}>
            <Text style={s.body}>{report.bioOverview}</Text>
          </View>

          {report.prompts.map((prompt, i) => (
            <View key={i} style={s.promptCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={s.bodyBold}>Prompt {i + 1}</Text>
                <View style={[s.scorePill, { backgroundColor: scoreBg(prompt.score) }]}>
                  <Text style={[s.scorePillText, { color: scoreColor(prompt.score) }]}>
                    {prompt.score}/10
                  </Text>
                </View>
              </View>

              <View style={s.promptOriginalBox}>
                <Text style={s.label}>ORIGINAL</Text>
                <Text style={s.promptOriginalText}>{prompt.original}</Text>
              </View>

              {prompt.whatWorks ? (
                <Bullet text={`What works: ${prompt.whatWorks}`} color={C.green} />
              ) : null}
              {prompt.whatDoesnt ? (
                <Bullet text={`What doesn't: ${prompt.whatDoesnt}`} color={C.red} />
              ) : null}

              <View style={s.promptRewriteBox}>
                <Text style={s.promptRewriteLabel}>✦ REWRITE SUGGESTION</Text>
                <Text style={s.promptRewriteText}>{prompt.rewrite}</Text>
              </View>
            </View>
          ))}

          <View style={s.divider} />

          {/* Vibe */}
          <SectionHeader title="Vibe & Positioning" subtitle="Who your profile attracts vs. who you want to attract" />
          <View style={s.vibeRow}>
            <View style={[s.vibeBox, { backgroundColor: C.gray100 }]}>
              <Text style={[s.vibeLabel, { color: C.gray500 }]}>CURRENT VIBE</Text>
              <Text style={[s.vibeText, { color: C.gray700 }]}>{report.currentVibe}</Text>
            </View>
            <View style={[s.vibeBox, { backgroundColor: C.roseLight }]}>
              <Text style={[s.vibeLabel, { color: C.rose }]}>TARGET VIBE</Text>
              <Text style={[s.vibeText, { color: C.gray700 }]}>{report.targetVibe}</Text>
            </View>
          </View>
          {report.vibeMismatch ? (
            <View style={[s.card, { backgroundColor: C.amberBg }]}>
              <Text style={s.label}>THE GAP</Text>
              <Text style={s.body}>{report.vibeMismatch}</Text>
            </View>
          ) : (
            <View style={[s.card, { backgroundColor: C.greenBg }]}>
              <Text style={[s.label, { color: C.green }]}>ALIGNED</Text>
              <Text style={s.body}>Your profile vibe matches what you&apos;re going for. Great sign.</Text>
            </View>
          )}

          <View style={s.divider} />

          {/* Bio rewrite */}
          <SectionHeader title="Rewritten Bio" subtitle="A stronger version in your voice — feel free to adapt it" />
          <View style={s.bioRewriteBox}>
            <Text style={s.bioRewriteLabel}>✦ SUGGESTED REWRITE</Text>
            <Text style={s.bioRewriteText}>{report.rewrittenBio}</Text>
          </View>

          <View style={s.divider} />

          {/* Closing */}
          <View style={s.closingBox}>
            <Text style={s.closingTitle}>Final Note from Datique AI</Text>
            <Text style={s.closingText}>{report.closingNote}</Text>
          </View>
        </View>

        <PageFooter page="3 of 3" name={displayName} />
      </Page>
    </Document>
  );
}
