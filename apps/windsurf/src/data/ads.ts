export interface Ad {
  title: string;
  description: string;
  logoUrl: string;
  link: string;
  imageUrl: string;
}

export const ads: Ad[] = [
  {
    title: "Neoai",
    description:
      "Invoicing, Time tracking, File reconciliation, Storage, Financial Overview & your own Assistant",
    logoUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-neoai-logo.png",
    imageUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-neoai.png",
    link: "https://go.neoai.khulnasoft.com/8cX3F4o",
  },
  {
    title: "Languine",
    description: "Localization infrastructure made for fast-paced startups.",
    logoUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-languine-logo.png",
    imageUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-languine.png",
    link: "https://go.neoai.khulnasoft.com/NnI1CUO",
  },
];
