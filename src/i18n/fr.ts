import type { Translations } from './types';
export type { Translations };

export const fr: Translations = {
  site: {
    name: 'ECVL',
    fullName: 'Écologie Citoyenne pour Villeneuve-Loubet',
    tagline: 'Ensemble pour un territoire plus vert et solidaire',
    description:
      'Association loi 1901 engagée pour l\'environnement et le lien social à Villeneuve-Loubet.',
  },
  nav: {
    home: 'Accueil',
    repairCafe: 'Repair Café',
    garden: 'Jardin Partagé',
    donate: 'Faire un don',
    contact: 'Contact',
    participate: 'Participer',
  },
  hero: {
    title: 'Écologie Citoyenne pour Villeneuve-Loubet',
    subtitle: 'Ensemble pour un territoire plus vert et solidaire',
    cta: 'Rejoindre un événement',
    learnMore: 'En savoir plus',
  },
  events: {
    title: 'Prochains événements',
    subtitle: 'Rejoignez-nous lors de nos prochaines activités',
    noEvents: 'Aucun événement à venir pour le moment. Revenez bientôt !',
    register: "S'inscrire",
    viewAll: 'Voir tous les événements',
    on: 'Le',
    at: 'à',
  },
  activities: {
    title: 'Nos activités',
    repairCafe: {
      title: 'Repair Café',
      short: 'Réparez plutôt que jeter ! Des bénévoles vous aident à réparer vos objets du quotidien.',
      cta: 'En savoir plus',
    },
    garden: {
      title: 'Jardin Partagé',
      short: 'Un espace de jardinage collaboratif ouvert à tous les habitants.',
      cta: 'En savoir plus',
    },
    fruitPicking: {
      title: 'Glanage de fruits',
      short: 'Cueillette collective de fruits pour lutter contre le gaspillage alimentaire.',
    },
  },
  donate: {
    title: 'Soutenir l\'association',
    subtitle: 'Chaque don nous aide à mener nos projets pour un Villeneuve-Loubet plus écologique.',
    cta: 'Faire un don sur HelloAsso',
    taxInfo: 'Les dons sont déductibles à 66 % de vos impôts.',
  },
  facebook: {
    title: 'Suivez-nous sur Facebook',
    subtitle: 'Actualités, photos et annonces de nos activités',
    consentText: 'Cliquez pour charger notre fil Facebook. Ce contenu est hébergé par Facebook et soumis à leur politique de confidentialité.',
    loadButton: 'Afficher le flux',
    viewPage: 'Voir la page Facebook →',
  },
  footer: {
    rights: 'Tous droits réservés.',
    legal: 'Mentions légales',
    association: 'Association loi 1901',
    followUs: 'Suivez-nous',
  },
  repairCafe: {
    title: 'Repair Café',
    subtitle: 'Réparer, c\'est résister au gaspillage',
    intro:
      'Le Repair Café est un lieu convivial où des bénévoles qualifiés vous aident gratuitement à réparer vos appareils électroniques, vêtements, vélos, meubles et bien plus encore.',
    howItWorks: {
      title: 'Comment ça marche ?',
      steps: [
        'Apportez votre objet cassé ou défectueux.',
        'Un réparateur bénévole vous accueille et diagnostique le problème.',
        'Vous participez activement à la réparation.',
        'Repartez avec votre objet réparé et de nouvelles compétences !',
      ],
    },
    whatWeRepair: {
      title: 'Ce que l\'on répare',
      items: [
        'Électroménager & électronique',
        'Vêtements & textiles',
        'Vélos & trottinettes',
        'Meubles & objets du quotidien',
        'Jouets',
      ],
    },
    ifixitBot: {
      eyebrow: 'Vous êtes pressé·e ?',
      title: 'Réparez maintenant avec l\'assistant iFixit',
      description: 'Pas besoin d\'attendre la prochaine session ! L\'assistant iFixit vous guide pas à pas pour réparer votre appareil dès aujourd\'hui.',
      cta: 'Lancer l\'assistant iFixit',
      url: 'https://fixbot.ifixit.com/',
    },
    selfRepair: {
      title: 'Ressources pour réparer soi-même',
      ifixit: 'iFixit — Guides de réparation gratuits',
      ifixitUrl: 'https://www.ifixit.com',
      repairCafeIntl: 'Repair Café International',
      repairCafeIntlUrl: 'https://www.repaircafe.org/fr/',
    },
    repairMonitor: {
      title: 'Nos statistiques de réparation',
      subtitle: 'Résultats de nos précédentes sessions via RepairMonitor',
      noData: 'Les données des sessions précédentes seront disponibles ici prochainement.',
      fakeDataBadge: 'Données fictives',
      fakeDataNote: 'Aperçu de ce que permettra l\'intégration RepairMonitor — les vraies données apparaîtront ici une fois connectées.',
    },
    nextSessions: 'Prochaines sessions',
    register: 'S\'inscrire sur HelloAsso',
  },
  garden: {
    title: 'Jardin Partagé',
    subtitle: 'Cultiver ensemble, partager la nature',
    intro:
      'Notre jardin partagé est un espace de biodiversité et de lien social ouvert à tous les habitants de Villeneuve-Loubet. Venez cultiver, apprendre et partager dans la bonne humeur !',
    whatWeGrow: {
      title: 'Ce que nous cultivons',
      items: [
        'Légumes de saison',
        'Plantes aromatiques & médicinales',
        'Fleurs mellifères pour les pollinisateurs',
        'Arbres fruitiers',
      ],
    },
    participate: {
      title: 'Comment participer ?',
      steps: [
        'Devenir membre de l\'association.',
        'Participer aux réunions de jardinage.',
        "S'engager sur une parcelle ou en soutien collectif.",
      ],
    },
    principles: {
      title: 'Nos principes',
      items: [
        'Jardinage 100 % bio',
        'Partage des récoltes',
        'Accueil de tous les niveaux',
        'Respect de la biodiversité',
      ],
    },
    fruitPicking: {
      title: 'Glanage de fruits',
      description:
        'Chaque été, nous organisons des sorties de glanage pour cueillir les fruits des arbres non exploités. Rien ne se perd !',
    },
    membership: {
      title: 'Devenir bénévole',
      description:
        'Rejoignez l’équipe de bénévoles du jardin partagé ! Inscrivez-vous via HelloAsso pour participer aux ateliers et prendre soin du jardin ensemble.',
    },
    nextEvents: 'Prochains ateliers jardinage',
  },
  participate: {
    title: 'Participer à l\'association',
    subtitle: 'Bénévole pour le Repair Café ou le Jardin Partagé',
    intro: 'Devenir bénévole ECVL, c\'est rejoindre une équipe engagée et conviviale pour agir concrètement pour l\'environnement et le lien social à Villeneuve-Loubet. Pas besoin d\'expertise : votre bonne volonté et votre curiosité suffisent !',
    repairCafe: {
      title: 'Bénévole Repair Café',
      schedule: '1er samedi du mois — après-midi de 4h',
      description: 'Chaque premier samedi du mois, nous ouvrons les portes du Repair Café pour aider les habitants à faire réparer leurs objets. En tant que bénévole, vous accueillez les visiteurs et prêtez main-forte aux réparateurs selon vos compétences. La session dure environ 4 heures l\'après-midi. Venez quand vous pouvez, chaque présence compte !',
      tasks: [
        'Accueil des visiteurs et gestion de la file',
        'Réparations (si vous avez des compétences en électronique, couture, mécanique...)',
        'Mise en place et rangement de l\'espace',
        'Animation et lien social avec les participants',
      ],
    },
    garden: {
      title: 'Bénévole Jardin Partagé',
      schedule: 'Ateliers réguliers au jardin de l\'Abreuvoir',
      description: 'Le jardin de l\'Abreuvoir est un espace partagé où nous cultivons ensemble selon les principes du jardinage biologique. Des ateliers réguliers sont organisés tout au long de l\'année : semis, entretien, récolte, compostage. En adhérant, vous vous engagez à respecter la charte du jardin et à contribuer à son entretien collectif.',
      tasks: [
        'Semis, plantation et entretien des cultures',
        'Arrosage et désherbage',
        'Récolte et partage des productions',
        'Compostage et amélioration du sol',
        'Participation aux décisions collectives',
      ],
    },
    widgetTitle: 'Je m\'inscris comme bénévole',
  },
};
