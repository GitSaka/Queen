// lib/mockMessages.ts

export type MockMessage = {
  id: string;
  content: string; // Texte de base OU URL du fichier (Image, Vidéo, Audio)
  senderId: string;
  type: 'TEXTE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
  createdAt: string;
};

// ID fictif de l'utilisateur connecté (Vous)
export const MY_USER_ID = "user_amadou_123";

// ID fictif de la fille du village (Fatou)
export const OTHER_USER_ID = "user_fatou_456";

export const mockMessagesList: MockMessage[] = [
  {
    id: "msg_1",
    content: "Salut ! Bien arrivée en ville pour mes études. Le village me manque déjà un peu ☺",
    senderId: OTHER_USER_ID,
    type: "TEXTE",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // Il y a 3 heures
  },
  {
    id: "msg_2",
    content: "Salut Fatou ! Content de te lire. Tu as pu trouver un logement près de ta fac ?",
    senderId: MY_USER_ID,
    type: "TEXTE",
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
  },
  {
    id: "msg_3",
    content: "Oui, regarde mon quartier actuel ! C'est super animé ici ⚡",
    senderId: OTHER_USER_ID,
    type: "TEXTE",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "msg_4",
    // Exemple d'image publique d'illustration
    content: "/images.jpeg, /images.jpeg,/images.jpeg,/images.jpeg,",
    senderId: OTHER_USER_ID,
    type: "IMAGE",
    createdAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    id: "msg_5",
    content: "Ah oui, c'est vraiment joli ! Tu t'en sors avec les premiers cours ?",
    senderId: MY_USER_ID,
    type: "TEXTE",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: "msg_6",
    // Exemple de note vocale fictive (Lien audio direct de test)
    content: "https://soundhelix.com",
    senderId: OTHER_USER_ID,
    type: "AUDIO",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // Il y a 1 heure
  },
  {
    id: "msg_7",
    // Exemple de vidéo courte fictive verticale (Lien mp4 direct de test)
    content: "https://mixkit.co",
    senderId: MY_USER_ID,
    type: "VIDEO",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // Il y a 30 min
  },
];
