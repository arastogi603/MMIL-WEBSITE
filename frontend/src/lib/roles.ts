export const CLUB_ROLES = [
  "system_admin",
  "president",
  "vice-president",
  "ctc",
  "co-ctc",
  "general-secretary",
  "management-head",
  "design-head",
  "programming-head",
  "technical-head",
  "web-development-head",
  "technical",
  "programming",
  "design",
  "web-development"
];

export const isAdminRights = (role: string | undefined | null): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return lowerRole === 'system_admin' || lowerRole === 'admin' || lowerRole === 'president' || lowerRole === 'ctc';
};

export const isCoreTeam = (role: string | undefined | null): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return isAdminRights(role) || lowerRole === 'core-team' || CLUB_ROLES.includes(lowerRole);
};

export const formatRoleName = (role: string): string => {
  if (!role) return "Student";
  if (role.toLowerCase() === "student") return "Student";
  return role.split('_').map(w => w.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(' ');
};