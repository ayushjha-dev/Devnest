export const COURSE_SECTIONS = [
  "B.Tech CSE(AIML) Apollo",
  "B.Tech CSE(AIML) Aurora",
  "B.Tech CSE(CS) Crypto",
  "B.Tech CSE(DS) Dossier",
  "B.Tech CSE(CORE ) Pheonix",
  "B.Tech CSE(CORE) frontier",
  "B.Tech CSE(AIML) Neural Minds",
  "B.Tech CSE(CS) Cyber Data Nexus",
  "B.Tech CSE(CORE) Syntax Squad",
  "B.Tech CSE(CORE) Binary Brains",
  "B.Tech CSE(AIML) 1st Year",
  "B.Tech CSE(CS) 1st Year",
] as const;

export type CourseSection = (typeof COURSE_SECTIONS)[number];
