const USERNAME_MAP: Record<string, string> = {
  polmorera13: "polmorera13@gmail.com",
};

export function mapUsernameToEmail(username: string): string {
  return USERNAME_MAP[username.trim()] ?? username.trim();
}
