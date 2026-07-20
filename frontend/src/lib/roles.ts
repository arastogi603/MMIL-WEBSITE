export const CLUB_ROLES = [
  "president",
  "vice-president",
  "ctc",
  "co-ctc",
  "general-secretary",
  "management-head",
  "design-head",
  "programming-head",
  "technical-head",
  "web-development-head"
];

export const isCoreTeam = (role: string | undefined | null): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return lowerRole === 'admin' || lowerRole === 'core-team' || CLUB_ROLES.includes(lowerRole);
};

export const formatRoleName = (role: string): string => {
  return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};