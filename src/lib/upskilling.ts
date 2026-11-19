import {
  CURRICULUM_ACTIVITIES,
  PAST_SESSIONS,
  type Qualification,
  type QualificationCompetency,
  type Workshop,
} from "@/data/sample";
import { getRosterMark, type DemoState } from "./demo-store";

export function getRelatedActivities(competency: QualificationCompetency, workshops: Workshop[]) {
  return CURRICULUM_ACTIVITIES.filter((activity) =>
    competency.activityIds.includes(activity.id),
  ).flatMap((activity) => {
    const workshop = workshops.find((w) => w.id === activity.workshopId);
    return workshop?.learn.includes(activity.outcome) ? [{ activity, workshop }] : [];
  });
}

export function getRelatedWorkshops(qualification: Qualification, workshops: Workshop[]) {
  const ids = new Set(
    qualification.competencies.flatMap((competency) =>
      getRelatedActivities(competency, workshops).map(({ workshop }) => workshop.id),
    ),
  );
  return workshops.filter((workshop) => ids.has(workshop.id));
}

export function getRelatedLearning(
  competency: QualificationCompetency,
  workshops: Workshop[],
  progress: DemoState,
) {
  const ids = new Set(
    getRelatedActivities(competency, workshops).map(({ workshop }) => workshop.id),
  );
  const result = { attended: 0, passed: 0, notYet: 0, booked: 0 };
  for (const id of ids) {
    const past = PAST_SESSIONS.find((session) => session.workshopId === id && session.attended);
    const mark = getRosterMark(progress, id, "mika");
    const attended = mark.present || !!past;
    const passed = mark.present && mark.skill === "pass";
    if (attended) result.attended++;
    if (passed) result.passed++;
    else if (past?.skillCheck === "Not yet" || (mark.present && mark.skill === "not-yet"))
      result.notYet++;
    if (!attended && progress.booked.includes(id)) result.booked++;
  }
  return result;
}
