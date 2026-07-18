// lib/mockFeed.ts

export type MockPost = {
  id: string;
  userId: string;
  type: 'TEXTE_COURT' | 'TEXTE_LONG' | 'PHOTO_AVEC_TEXTE' | 'VIDEO_AVEC_TEXTE';
  textContent?: string;
  mediaUrl?: string;
  createdAt: string;
};

export const mockFeedList: MockPost[] = [
  {
    id: "post_1",
    userId: "user_fatou_456",
    type: "TEXTE_COURT",
    textContent: "✨ Ce soir c'est l'anniversaire de ma meilleure amie, hâte de faire la fête ! 🥳",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // Il y a 2 heures
  },
  {
    id: "post_2",
    userId: "user_fatou_456",
    type: "PHOTO_AVEC_TEXTE",
    textContent: "Le coucher de soleil sur les collines du village ce soir... Rien de plus magnifique. ❤️🌅",
    mediaUrl: "/images.jpeg",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // Il y a 5 heures
  },
  {
    id: "post_3",
    userId: "user_fatou_456",
    type: "TEXTE_LONG",
    textContent: "Je tenais à remercier toutes les personnes de la communauté qui m'ont aidée à m'installer en ville pour mes études de Droit. C'est un grand changement pour moi, quitter le village n'était pas facile mais vos messages de soutien et vos conseils précieux me donnent énormément de force au quotidien. Si vous passez près de la fac, faites-moi signe pour qu'on prenne un verre au Glacier de la Paix !",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // Il y a 1 jour
  },
  {
    id: "post_4",
    userId: "user_fatou_456",
    type: "VIDEO_AVEC_TEXTE",
    textContent: "Petite balade matinale avant d'aller en cours. Bon début de semaine à tous ! ☀️🚶‍♀️",
    mediaUrl: "https://mixkit.co",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(), // Il y a 1 jour et demi
  }
];
