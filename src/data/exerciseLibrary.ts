import { ExerciseTemplate } from '@/types/workout';

// Bibliothèque complète des exercices (triée par ordre alphabétique)
export const exerciseLibrary: ExerciseTemplate[] = [
  {
    id: 'b_iso_abducteurs',
    name: 'Abducteurs (Machine)',
    defaultSets: 3,
    defaultReps: '15',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+machine+abducteurs',
    notes: 'Mouvement contrôlé, pause en position ouverte.',
    muscleGroup: 'Fessiers'
  },
  {
    id: 'b_bodyweight_airsquat',
    name: 'Air Squat',
    defaultSets: 3,
    defaultReps: '20',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/results?search_query=air+squat+technique',
    notes: 'Squat au poids du corps, descente profonde.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_beltsquat',
    name: 'Belt Squat',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=belt+squat+machine',
    notes: 'Charge suspendue à la ceinture, soulage le dos.',
    muscleGroup: 'Quadriceps / Fessiers'
  },
  {
    id: 'h3_iso_bicep_larry',
    name: 'Biceps Curl Larry Scott',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=larry+scott+curl+biceps',
    notes: 'Sur pupitre incliné, isolation maximale du biceps.',
    muscleGroup: 'Biceps'
  },
  {
    id: 'h3_iso_bicep_neutre',
    name: 'Biceps Curl neutre (Marteau)',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=curl+marteau+biceps',
    notes: 'Prise neutre, travaille le brachial.',
    muscleGroup: 'Biceps'
  },
  {
    id: 'h3_iso_bicep',
    name: 'Biceps curl poulie',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=AsAVbBko26o',
    notes: 'Ne pas balancer le corps, coudes fixes.',
    muscleGroup: 'Biceps'
  },
  {
    id: 'b_sante_bird',
    name: 'Bird Dog',
    defaultSets: 2,
    defaultReps: '5 / côté',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    notes: 'Équilibre et stabilité lombaire.',
    muscleGroup: 'Gainage / Core'
  },
  {
    id: 'b_iso_bulgarian',
    name: 'Bulgarian Split Squat',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    notes: 'Pied arrière surélevé, focus fessier.',
    muscleGroup: 'Quadriceps / Fessiers'
  },
  {
    id: 'h3_sante_lu',
    name: 'Cercle de Lu',
    defaultSets: 1,
    defaultReps: '15',
    defaultRestTime: '0',
    videoUrl: 'https://www.youtube.com/watch?v=bcd86P6P_c8',
    notes: 'Mouvement fluide, amplitude maximale.',
    muscleGroup: 'Mobilité épaules'
  },
  {
    id: 'b_gain_crunch_oblique',
    name: 'Crunch oblique sur machine',
    defaultSets: 3,
    defaultReps: '15',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/results?search_query=crunch+oblique+machine',
    notes: 'Rotation contrôlée, contraction des obliques.',
    muscleGroup: 'Abdos'
  },
  {
    id: 'b_gain_crunch_machine',
    name: 'Crunch sur machine',
    defaultSets: 3,
    defaultReps: '15',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/results?search_query=crunch+machine+abdos',
    notes: 'Enrouler le buste, pas tirer avec les bras.',
    muscleGroup: 'Abdos'
  },
  {
    id: 'b_force_rdl',
    name: 'Deadlift roumain (RDL)',
    defaultSets: 4,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwvgQ',
    notes: 'Sentir l\'étirement, barre contre les cuisses.',
    muscleGroup: 'Ischios / Fessiers'
  },
  {
    id: 'h1_force_dc',
    name: 'Développé couché haltères',
    defaultSets: 4,
    defaultReps: '8',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=vj2w851ZpEE',
    notes: 'Trajectoire stable, contrôle de la descente.',
    muscleGroup: 'Poitrine'
  },
  {
    id: 'h1_force_incline',
    name: 'Développé incliné haltères',
    defaultSets: 4,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=developpe+incline+halteres',
    notes: 'Banc incliné 30-45°, focus haut de la poitrine.',
    muscleGroup: 'Poitrine'
  },
  {
    id: 'h2_hyper_dm',
    name: 'Développé militaire haltères',
    defaultSets: 3,
    defaultReps: '8',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    notes: 'Sur banc, extension complète des bras.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'h2_force_dips_l',
    name: 'Dips lestés (Barre)',
    defaultSets: 4,
    defaultReps: '6',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=vX_X6Ssh3-c',
    notes: 'Descente profonde, jonction poitrine/abdos.',
    muscleGroup: 'Poitrine / Triceps'
  },
  {
    id: 'h1_calis_dips_r',
    name: 'Dips sur anneaux',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=Ikeg_v5fvz4',
    notes: 'Épaules doivent toucher les anneaux.',
    muscleGroup: 'Poitrine / Triceps'
  },
  {
    id: 'h2_iso_dips_machine',
    name: 'Dips sur machine (assistés)',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=dips+machine+assiste',
    notes: 'Aide au contrepoids, bon pour progresser.',
    muscleGroup: 'Poitrine / Triceps'
  },
  {
    id: 'h2_calis_flag',
    name: 'Drapeau (Human Flag) 45°',
    defaultSets: 3,
    defaultReps: '8 sec',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=vS_oA1S7_4k',
    notes: 'Prise de barre solide, bras tendus.',
    muscleGroup: 'Gainage / Full Body'
  },
  {
    id: 'elliptique',
    name: 'Elliptique',
    defaultSets: 1,
    defaultReps: '5 min',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=bcd86P6P_c8',
    notes: 'Échauffement cardio initial - Résistance 8-12',
    muscleGroup: 'Cardio'
  },
  {
    id: 'h3_iso_lateral',
    name: 'Élévations latérales haltères',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    notes: 'Bras légèrement fléchis, monter aux épaules.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'b_sante_lombaire',
    name: 'Extension lombaire',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=extension+lombaire+banc',
    notes: 'Mouvement contrôlé, ne pas hyper-étendre.',
    muscleGroup: 'Lombaires'
  },
  {
    id: 'h3_iso_tricep',
    name: 'Extension triceps poulie',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=3Hxs9xZQm7A',
    notes: 'Explosif en poussée, 2s retenue descente.',
    muscleGroup: 'Triceps'
  },
  {
    id: 'b_iso_fentes',
    name: 'Fentes marchées haltères',
    defaultSets: 3,
    defaultReps: '20',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=DlhojghkaQ0',
    notes: 'Genou arrière frôle le sol.',
    muscleGroup: 'Quadriceps / Fessiers'
  },
  {
    id: 'b_force_hacksquat',
    name: 'Hack Squat',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=hack+squat+machine',
    notes: 'Dos plaqué, pieds bas pour quadriceps.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_deadlift',
    name: 'Hexbar Deadlift',
    defaultSets: 4,
    defaultReps: '6',
    defaultRestTime: '2 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=6Q_z9D-tLbg',
    notes: 'Dos plat, poussée dans les talons.',
    muscleGroup: 'Full Legs / Dos'
  },
  {
    id: 'b_force_hip_t',
    name: 'Hip Thrust',
    defaultSets: 4,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+hip+thrust+fr',
    notes: 'Forte contraction en haut du mouvement, pause 1s.',
    muscleGroup: 'Fessiers'
  },
  {
    id: 'b_gain_hollow',
    name: 'Hollow Body Hold',
    defaultSets: 3,
    defaultReps: '30 sec',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/results?search_query=hollow+body+hold',
    notes: 'Bas du dos plaqué au sol, jambes et épaules décollées.',
    muscleGroup: 'Gainage / Core'
  },
  {
    id: 'h1_calis_hspu',
    name: 'HSPU contre mur',
    defaultSets: 3,
    defaultReps: '5',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=DBv3BvBS4H8',
    notes: 'Corps gainé, ne pas cambrer le dos.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'b_iso_ischio',
    name: 'Ischio couché (Leg Curl)',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+leg+curl+allonge',
    notes: 'Garder le bassin plaqué au banc, contraction maximale.',
    muscleGroup: 'Ischios'
  },
  {
    id: 'h1_calis_jumping_mu',
    name: 'Jumping Muscle Up',
    defaultSets: 4,
    defaultReps: '5',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/results?search_query=jumping+muscle+up',
    notes: 'Impulsion des jambes pour aider la transition.',
    muscleGroup: 'Full Upper'
  },
  {
    id: 'b_force_kb_goblet',
    name: 'KB Gobelet Squat',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=goblet+squat+kettlebell',
    notes: 'Kettlebell contre la poitrine, coudes entre les genoux.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_iso_kickback',
    name: 'Kick Back (Normal)',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+kick+back+poulie',
    notes: 'Mouvement contrôlé, squeeze en haut.',
    muscleGroup: 'Fessiers'
  },
  {
    id: 'b_iso_kickback_diag',
    name: 'Kick Back Décalé (Diagonal)',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+kick+back+decale+fessier',
    notes: 'Jambe vers l\'extérieur pour cibler le moyen fessier.',
    muscleGroup: 'Fessiers'
  },
  {
    id: 'b_iso_ext',
    name: 'Leg Extension',
    defaultSets: 3,
    defaultReps: '15',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+leg+extension',
    notes: 'Contraction maximale des quadriceps.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_legpress_hammer',
    name: 'Leg Press Hammer',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=leg+press+hammer+strength',
    notes: 'Mouvement linéaire, charge lourde possible.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_leg_p',
    name: 'Leg Press Linéaire',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    notes: 'Ne pas verrouiller les genoux en haut.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_legpress_pendulaire',
    name: 'Leg Press Pendulaire',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=leg+press+pendulaire',
    notes: 'Mouvement en arc, bon pour les fessiers.',
    muscleGroup: 'Quadriceps / Fessiers'
  },
  {
    id: 'b_gain_knee_r',
    name: 'Montée de genoux à la barre',
    defaultSets: 4,
    defaultReps: '20',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=RD_A-Z15ErY',
    notes: 'Ne pas balancer, monter les genoux haut.',
    muscleGroup: 'Abdos'
  },
  {
    id: 'h1_calis_mu',
    name: 'Muscle up aux anneaux',
    defaultSets: 4,
    defaultReps: '3',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=pXiGenBKjWk',
    notes: 'Transition explosive, pieds sur pointe pour durcir.',
    muscleGroup: 'Full Upper'
  },
  {
    id: 'h1_calis_mu_saute',
    name: 'Muscle up sauté (descente ralentie)',
    defaultSets: 4,
    defaultReps: '5',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/results?search_query=muscle+up+saute+negatif',
    notes: 'Sauter pour la transition, contrôler la descente 3-5s.',
    muscleGroup: 'Full Upper'
  },
  {
    id: 'h2_iso_oiseau',
    name: 'Oiseau haltères',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=H530fW3KWfk',
    notes: 'Focus sur l\'arrière de l\'épaule.',
    muscleGroup: 'Épaules arrière'
  },
  {
    id: 'b_force_pendulum',
    name: 'Pendulum Squat',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=pendulum+squat+machine',
    notes: 'Mouvement pendulaire, focus quadriceps.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'h2_hyper_pike',
    name: 'Pike Push up surélevé',
    defaultSets: 3,
    defaultReps: '8',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=spOsLWBIP6g',
    notes: 'Pieds sur box, tête vers l\'avant.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'b_gain_planche_spiderman',
    name: 'Planche Spiderman',
    defaultSets: 3,
    defaultReps: '10 / côté',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/results?search_query=spiderman+plank',
    notes: 'Amener le genou au coude, gainage dynamique.',
    muscleGroup: 'Gainage / Core'
  },
  {
    id: 'b_gain_planche_kb',
    name: 'Planche avec passage KB',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=plank+kettlebell+drag',
    notes: 'Passer le KB sous le corps, anti-rotation.',
    muscleGroup: 'Gainage / Core'
  },
  {
    id: 'b_gain_planche_lat',
    name: 'Planche latérale lestée',
    defaultSets: 3,
    defaultReps: '40 sec',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/watch?v=YrcNsxTwLBA',
    notes: 'Poids posé sur la hanche supérieure.',
    muscleGroup: 'Gainage / Core'
  },
  {
    id: 'h2_bodyweight_pompe',
    name: 'Pompe classique',
    defaultSets: 3,
    defaultReps: '15',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=pompe+parfaite+technique',
    notes: 'Corps gainé, descente contrôlée.',
    muscleGroup: 'Poitrine / Triceps'
  },
  {
    id: 'h2_bodyweight_pompe_decline',
    name: 'Pompe déclinée',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=pompe+declinee+pieds+sureleves',
    notes: 'Pieds surélevés, focus haut de poitrine.',
    muscleGroup: 'Poitrine'
  },
  {
    id: 'h2_bodyweight_pompe_pike',
    name: 'Pompe en Pike',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=pike+push+up',
    notes: 'Hanches en l\'air, travail des épaules.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'h2_calis_pompe_explo',
    name: 'Pompe explosive',
    defaultSets: 4,
    defaultReps: '8',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=pompe+explosive+clap',
    notes: 'Poussée explosive, mains décollent du sol.',
    muscleGroup: 'Poitrine'
  },
  {
    id: 'b_force_presse',
    name: 'Presse à cuisses',
    defaultSets: 4,
    defaultReps: '12',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+presse+a+cuisse',
    notes: 'Dos bien plaqué, ne pas verrouiller les genoux.',
    muscleGroup: 'Quadriceps'
  },
  {
    id: 'b_force_rdl_jt',
    name: 'RDL (Soulevé de terre jambes tendues)',
    defaultSets: 4,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=tuto+rdl+musculation',
    notes: 'Jambes quasi-tendues, étirement ischio-fessiers.',
    muscleGroup: 'Ischios / Fessiers'
  },
  {
    id: 'h3_iso_scott',
    name: 'Scott (Curl pupitre)',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=curl+pupitre+scott',
    notes: 'Bras appuyés sur le pupitre, isolation biceps.',
    muscleGroup: 'Biceps'
  },
  {
    id: 'h3_iso_skull',
    name: 'Skull Crusher',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=skull+crusher+triceps',
    notes: 'Barre EZ, descendre vers le front, coudes fixes.',
    muscleGroup: 'Triceps'
  },
  {
    id: 'b_force_squat',
    name: 'Squat (Barre)',
    defaultSets: 4,
    defaultReps: '8',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/results?search_query=squat+barre+technique',
    notes: 'Dos droit, descendre sous le parallèle.',
    muscleGroup: 'Quadriceps / Fessiers'
  },
  {
    id: 'b_cardio_tapis',
    name: 'Tapis 15% Pente',
    defaultSets: 1,
    defaultReps: '7 min',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=kIvFkHdIpqI',
    notes: 'Marche active, ne pas se tenir aux barres.',
    muscleGroup: 'Cardio'
  },
  {
    id: 'h2_hyper_row_h',
    name: 'Tirage horizontal Technogym',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=vVnK7vK9N30',
    notes: 'Méthode 3D-3G (Alterné), focus sur le dos.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h2_iso_menton',
    name: 'Tirage menton barre EZ',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=0w6Wp_zR-w0',
    notes: 'Coudes plus hauts que les poignets.',
    muscleGroup: 'Épaules'
  },
  {
    id: 'h2_calis_tirage_trx',
    name: 'Tirage TRX',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=tirage+trx+dos',
    notes: 'Corps gainé, tirer la poitrine vers les poignées.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h3_hyper_row_v',
    name: 'Tirage vertical supination',
    defaultSets: 3,
    defaultReps: '10',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/watch?v=mr74_9VkeOk',
    notes: 'Poitrine vers le haut, coudes vers le bas.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h3_calis_traction_aussie',
    name: 'Traction australienne supination',
    defaultSets: 3,
    defaultReps: '12',
    defaultRestTime: '1 min',
    videoUrl: 'https://www.youtube.com/results?search_query=traction+australienne+supination',
    notes: 'Corps horizontal, tirer la poitrine à la barre.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h3_calis_traction_elast',
    name: 'Traction élastique (assistée)',
    defaultSets: 3,
    defaultReps: '8',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=traction+elastique+assiste',
    notes: 'Élastique sous les pieds pour progresser.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h1_calis_traction_exp',
    name: 'Traction explosive',
    defaultSets: 5,
    defaultReps: '3',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=rR_T0M8I-2U',
    notes: 'Monter le plus haut possible rapidement.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h1_force_traction',
    name: 'Traction lestée',
    defaultSets: 3,
    defaultReps: '6',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=mr74_9VkeOk',
    notes: 'Menton au dessus de la barre, bras tendus en bas.',
    muscleGroup: 'Dos'
  },
  {
    id: 'h3_sante_scap',
    name: 'Traction scapulaire',
    defaultSets: 2,
    defaultReps: '10',
    defaultRestTime: '45 s',
    videoUrl: 'https://www.youtube.com/watch?v=-ZIpSoTRsuE',
    notes: 'Bras tendus, bouger uniquement les omoplates.',
    muscleGroup: 'Postural'
  },
  {
    id: 'h1_force_traction_supi',
    name: 'Traction supination',
    defaultSets: 3,
    defaultReps: '8',
    defaultRestTime: '1 min 30',
    videoUrl: 'https://www.youtube.com/results?search_query=traction+supination+biceps',
    notes: 'Prise supination, travaille aussi les biceps.',
    muscleGroup: 'Dos / Biceps'
  },
  {
    id: 'h2_calis_zanetti',
    name: 'Zanetti Press',
    defaultSets: 3,
    defaultReps: '6',
    defaultRestTime: '2 min',
    videoUrl: 'https://www.youtube.com/results?search_query=zanetti+press+anneaux',
    notes: 'Aux anneaux, de la position iron cross vers le haut.',
    muscleGroup: 'Épaules / Full Upper'
  }
];

// Groupes musculaires pour le filtrage
export const muscleGroups = [
  'Tous',
  'Poitrine',
  'Dos',
  'Épaules',
  'Triceps',
  'Biceps',
  'Quadriceps',
  'Ischios',
  'Fessiers',
  'Abdos',
  'Lombaires',
  'Cardio',
  'Gainage / Core',
  'Mobilité',
  'Postural',
  'Full Body',
  'Full Upper'
];

// Fonction pour rechercher des exercices
export function searchExercises(query: string, muscleGroup?: string): ExerciseTemplate[] {
  let results = exerciseLibrary;

  if (muscleGroup && muscleGroup !== 'Tous') {
    results = results.filter(ex =>
      ex.muscleGroup?.toLowerCase().includes(muscleGroup.toLowerCase())
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(ex =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.notes?.toLowerCase().includes(lowerQuery) ||
      ex.muscleGroup?.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}
