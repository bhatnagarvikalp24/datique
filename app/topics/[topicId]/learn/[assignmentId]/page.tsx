import { notFound } from "next/navigation";
import { getTopic } from "@/lib/topics";
import { getAssignment, getTopicAssignments } from "@/lib/assignments";
import AssignmentEditor from "@/app/components/AssignmentEditor";

export default async function AssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string; assignmentId: string }>;
  searchParams: Promise<{ purchaseId?: string }>;
}) {
  const { topicId, assignmentId } = await params;
  const { purchaseId } = await searchParams;

  const topic = getTopic(topicId);
  if (!topic) notFound();

  // TODO: re-enable payment gate before launch
  const assignment = getAssignment(topicId, assignmentId);
  if (!assignment) notFound();

  const allAssignments = getTopicAssignments(topicId).map((a) => ({
    id: a.id,
    number: a.number,
    title: a.title,
  }));

  return (
    <AssignmentEditor
      assignment={assignment}
      purchaseId={purchaseId ?? "preview"}
      topicId={topicId}
      allAssignments={allAssignments}
    />
  );
}
