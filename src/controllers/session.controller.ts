import { createSession } from "@/models/session.model";
import { findUserById, updateUserXPAndStreak } from "@/models/user.model";
import { unlockBadge, findBadgesByUser } from "@/models/badge.model";
import { countDistinctSubjectsRevised } from "@/models/subject.model";
import { calculateSessionXP, checkNewBadges, computeNewStreak } from "@/lib/xp";

export async function completeSession(params: {
  userId: string;
  subjectId: string | null;
  durationMinutes: number;
}): Promise<{ xpEarned: number; newBadges: string[]; newStreak: number }> {
  const { userId, subjectId, durationMinutes } = params;

  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  const xpEarned = calculateSessionXP(durationMinutes);
  const newTotalXP = user.xp + xpEarned;
  const newStreak = computeNewStreak(user.last_session_date, user.streak);
  const today = new Date().toISOString().split("T")[0];

  // Sauvegarde la session
  await createSession({
    user_id: userId,
    subject_id: subjectId,
    duration_minutes: durationMinutes,
    xp_earned: xpEarned,
  });

  // Mise à jour XP et streak
  await updateUserXPAndStreak(userId, newTotalXP, newStreak, today);

  // Vérification des badges
  const existingBadges = await findBadgesByUser(userId);
  const subjectsRevised = await countDistinctSubjectsRevised(userId);
  const sessionHour = new Date().getHours();

  const newBadgeIds = checkNewBadges({
    totalXP: newTotalXP,
    streak: newStreak,
    totalSessions: existingBadges.length + 1,
    subjectsRevised,
    sessionDuration: durationMinutes,
    sessionHour,
    existingBadgeIds: existingBadges.map((b) => b.badge_id),
  });

  // Unlock les nouveaux badges en parallèle
  await Promise.all(newBadgeIds.map((id) => unlockBadge(userId, id)));

  return { xpEarned, newBadges: newBadgeIds, newStreak };
}
