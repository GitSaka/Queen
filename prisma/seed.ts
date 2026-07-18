import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Nettoyage des anciennes données de test...');
  await prisma.userPromptAnswer.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.like.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  console.log('Création des questions de prompts...');
  const promptDimanche = await prisma.prompt.create({
    data: { question: 'Mon dimanche idéal ressemble à...' },
  });
  const promptRecherche = await prisma.prompt.create({
    data: { question: 'Je recherche quelqu\'un qui...' },
  });
  const promptSecret = await prisma.prompt.create({
    data: { question: 'Un truc que peu de gens savent sur moi...' },
  });

  console.log('Création des utilisateurs de test...');

  const aicha = await prisma.user.create({
    data: {
      firstName: 'Aïcha',
      email: 'aicha@test.com',
      passwordHash,
      birthDate: new Date('2000-05-14'),
      gender: 'FEMME',
      city: 'Cotonou',
      bio: 'Passionnée de voyages et de bonne cuisine. J\'aime découvrir de nouveaux endroits et partager de bons moments simples. Je suis quelqu\'un de sérieux dans la vie, mais je garde toujours une bonne dose d\'humour au quotidien.',
      profession: 'Étudiante en gestion',
      education: 'Licence',
      lookingFor: 'RELATION_SERIEUSE',
      smokingHabit: 'NE_FUME_PAS',
      drinkingHabit: 'BUVEUR_OCCASIONNEL',
      childrenStatus: 'PAS_D_ENFANTS',
      religion: 'Chrétienne',
      isOpenToDirectMessages: true,
      verificationStatus: 'VERIFIE',
      preferences: { create: { interestedInGender: ['HOMME'] } },
      promptAnswers: {
        create: [
          { promptId: promptDimanche.id, answer: 'Un bon plat fait maison, de la musique et une balade en fin de journée.', order: 0 },
          { promptId: promptRecherche.id, answer: 'Sait me faire rire et n\'a pas peur d\'être lui-même.', order: 1 },
        ],
      },
    },
  });

  const nadia = await prisma.user.create({
    data: {
      firstName: 'Nadia',
      email: 'nadia@test.com',
      passwordHash,
      birthDate: new Date('1999-03-02'),
      gender: 'FEMME',
      city: 'Porto-Novo',
      bio: 'Toujours partante pour une nouvelle aventure.',
      profession: 'Infirmière',
      lookingFor: 'PAS_SUR_ENCORE',
      isOpenToDirectMessages: false,
      preferences: { create: { interestedInGender: ['HOMME'] } },
    },
  });

  const kevin = await prisma.user.create({
    data: {
      firstName: 'Kevin',
      email: 'kevin@test.com',
      passwordHash,
      birthDate: new Date('1998-11-20'),
      gender: 'HOMME',
      city: 'Cotonou',
      bio: 'Développeur le jour, footballeur le week-end.',
      profession: 'Développeur web',
      education: 'Master',
      lookingFor: 'RELATION_SERIEUSE',
      smokingHabit: 'NE_FUME_PAS',
      drinkingHabit: 'NE_BOIT_PAS',
      childrenStatus: 'PAS_D_ENFANTS',
      preferences: { create: { interestedInGender: ['FEMME'] } },
      promptAnswers: {
        create: [
          { promptId: promptSecret.id, answer: 'J\'ai peur des chats, alors que je fais 1m90.', order: 0 },
        ],
      },
    },
  });

  console.log('Création d\'un match + messages entre Aïcha et Kevin...');
  const [userAId, userBId] = [aicha.id, kevin.id].sort();
  const match = await prisma.match.create({ data: { userAId, userBId } });

  await prisma.message.create({
    data: { matchId: match.id, senderId: aicha.id, content: 'Salut ! J\'ai vu qu\'on avait matché 😊' },
  });
  await prisma.message.create({
    data: { matchId: match.id, senderId: kevin.id, content: 'Hello ! Ta bio m\'a fait sourire' },
  });

  console.log('Terminé ! Comptes créés :');
  console.log('- aicha@test.com / password123 (disponible, prompts remplis)');
  console.log('- nadia@test.com / password123');
  console.log('- kevin@test.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });