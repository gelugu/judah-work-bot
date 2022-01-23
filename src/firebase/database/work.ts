import { read, write } from ".";
import { Session } from "../../interfaces/session";
import { User } from "../../interfaces/user";

export const addNewWorkSession = async (userId: string, session: Session) => {
  await write(userId, {
    currentSession: session.start,
  });

  await updateUserSession(userId, session);
};

export const updateUserSession = async (userId: string, session: Session) => {
  await write(`${userId}/sessions/${session.start}`, session);
};

export const stopUserSession = async (userId: string) => {
  const user = (await read(userId)) as User;

  console.log(user)

  await write(userId, { currentSession: 0 });

  const currentDate = Date.now();
  await updateUserSession(userId, {
    end: currentDate,
    duration: user.sessions[user.currentSession].start - currentDate,
  });
};

export const getCurrentUserSession = async (
  userId: string
): Promise<number> => {
  const user = (await read(userId)) as User;

  console.log(user);

  if (!user || !user.currentSession) return undefined;

  return user.currentSession;
};

export const getUserSessions = async (userId: string): Promise<Session[]> => {
  const user = (await read(`${userId}/sessions`)) as User;
  return Object.keys(user).map((sessionId) => user[sessionId] as Session);
};
