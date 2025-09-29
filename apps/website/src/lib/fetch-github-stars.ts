"use server";

export async function fetchGithubStars() {
  const response = await fetch("https://api.github.com/repos/neoai-ai/neoai", {
    next: {
      revalidate: 3600,
    },
  });

  return response.json();
}
