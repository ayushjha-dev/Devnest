export const COURSE_SECTIONS = [
  "B.Tech CSE(AIML) Apollo",
  "B.Tech CSE(AIML) Aurora",
  "B.Tech CSE(AIML) Innovators",
  "B.Tech CSE(AIML) Neural Minds",
  "B.Tech CSE(CORE) Binary Brains",
  "B.Tech CSE(CORE) Frontier",
  "B.Tech CSE(CORE) Pheonix",
  "B.Tech CSE(CORE) Stackhive",
  "B.Tech CSE(CORE) Syntax Squad",
  "B.Tech CSE(CS) Crypto",
  "B.Tech CSE(CS) Cyber Data Nexus",
  "B.Tech CSE(CS) Innovators",
  "B.Tech CSE(DS) Cyber Data Nexus",
  "B.Tech CSE(DS) Dossier",
] as const;

export type CourseSection = (typeof COURSE_SECTIONS)[number];
