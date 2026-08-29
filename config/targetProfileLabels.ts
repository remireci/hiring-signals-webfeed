export const TARGET_PROFILE_LABELS = {
  it_data: "IT — Data & AI",
  it_development: "IT — Development & Applications",
  it_infrastructure: "IT — Infrastructure & Security",
  finance_accounting: "Finance & Accounting",
  legal_compliance: "Legal & Compliance",
} as const;

export function getTargetProfileLabel(profileId: string): string {
  return (
    TARGET_PROFILE_LABELS[profileId as keyof typeof TARGET_PROFILE_LABELS] ||
    profileId
  );
}
