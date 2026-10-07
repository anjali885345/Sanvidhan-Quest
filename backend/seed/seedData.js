const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const Scenario = require('../models/Scenario');
const MatchChallenge = require('../models/MatchChallenge');
const TimelineChallenge = require('../models/TimelineChallenge');
const FillBlankChallenge = require('../models/FillBlankChallenge');
const MemoryChallenge = require('../models/MemoryChallenge');
const Badge = require('../models/Badge');
const DailyChallenge = require('../models/DailyChallenge');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Module.deleteMany({}), Quiz.deleteMany({}), Scenario.deleteMany({}),
      MatchChallenge.deleteMany({}), TimelineChallenge.deleteMany({}),
      FillBlankChallenge.deleteMany({}), MemoryChallenge.deleteMany({}),
      Badge.deleteMany({}), DailyChallenge.deleteMany({}),
    ]);

    // ===================== MODULES =====================
    console.log('📜 Seeding modules with rich content...');
    const modulesData = [
      {
        title: 'The Preamble',
        partNumber: 'Preamble',
        description: 'The soul of the Indian Constitution — the guiding light that declares India\'s identity as a sovereign, socialist, secular, democratic republic.',
        content: `The Preamble to the Indian Constitution is like the introduction to a grand story — it tells you what the whole book is about.\n\n**Full Text:**\n"WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."\n\n**Key Concepts:**\n- **Sovereign**: India is its own boss — no external power controls it\n- **Socialist**: The state works towards reducing inequality\n- **Secular**: All religions are treated equally by the state\n- **Democratic**: Power belongs to the people\n- **Republic**: The head of state (President) is elected, not a king or queen\n\n**Did You Know?** The words "Socialist" and "Secular" were added by the 42nd Amendment in 1976!`,
        articles: [],
        funFacts: [
          'The Preamble was inspired by the US Constitution\'s preamble',
          'It was adopted on November 26, 1949 — now celebrated as Constitution Day',
          '"Socialist" and "Secular" were added in 1976 by the 42nd Amendment',
          'The original Preamble was handwritten and calligraphed by Prem Behari Narain Raizada'
        ],
        difficulty: 'Beginner', xpReward: 100, icon: '🏛️', order: 1,
      },
      {
        title: 'Union and its Territory',
        partNumber: 'Part I',
        description: 'How India is organized as a Union of States — covering Articles 1 to 4.',
        content: `Part I of the Constitution deals with the Union and its Territory.\n\n**Article 1** declares that India, that is Bharat, shall be a Union of States. The territory of India comprises the states, union territories, and any territory that may be acquired.\n\n**Why "Union" and not "Federation"?**\nDr. B.R. Ambedkar chose "Union" deliberately — it means states have no right to secede. India is indestructible!\n\n**Article 2**: Parliament can admit new states or establish new states on terms it thinks fit.\n\n**Article 3**: Parliament can form new states by separating territory from existing states, merge states, or change state boundaries and names.\n\n**Article 4**: Laws made under Articles 2 and 3 are not considered constitutional amendments.\n\n**Real-World Example**: The state of Telangana was carved out of Andhra Pradesh in 2014 using Article 3!`,
        articles: [
          { articleNumber: '1', title: 'Name and territory', description: 'India, that is Bharat, shall be a Union of States' },
          { articleNumber: '3', title: 'Formation of new states', description: 'Parliament may form new states by separation, merger, or alteration of boundaries' },
        ],
        funFacts: [
          'India started with 14 states and 6 union territories in 1950',
          'Today India has 28 states and 8 union territories',
        ],
        difficulty: 'Beginner', xpReward: 100, icon: '🗺️', order: 2,
      },
      {
        title: 'Citizenship',
        partNumber: 'Part II',
        description: 'Who is an Indian citizen? Articles 5-11 define the rules of citizenship.',
        content: `Part II covers Citizenship (Articles 5–11).\n\n**Article 5**: At the commencement of the Constitution, every person domiciled in India and born in India was a citizen.\n\n**Article 9**: If a person voluntarily acquires citizenship of another country, they cease to be an Indian citizen.\n\n**Article 11**: Parliament has the power to make any provision regarding citizenship.\n\n**Key Point**: India allows only SINGLE citizenship — you cannot be a citizen of India and another country simultaneously.\n\n**Did You Know?** Unlike the USA, India does not have dual citizenship. However, it offers OCI (Overseas Citizen of India) cards for people of Indian origin.`,
        articles: [
          { articleNumber: '5', title: 'Citizenship at commencement', description: 'Who was a citizen when the Constitution came into effect' },
          { articleNumber: '9', title: 'No dual citizenship', description: 'Voluntary acquisition of foreign citizenship terminates Indian citizenship' },
          { articleNumber: '11', title: 'Parliament\'s power', description: 'Parliament can regulate citizenship by law' },
        ],
        funFacts: [
          'India has single citizenship unlike the USA which has dual (state + federal)',
          'OCI card holders cannot vote or hold constitutional posts in India',
        ],
        difficulty: 'Beginner', xpReward: 100, icon: '🪪', order: 3,
      },
      {
        title: 'Fundamental Rights',
        partNumber: 'Part III',
        description: 'The cornerstone of Indian democracy — 6 fundamental rights that protect every citizen. Articles 12-35.',
        content: `Part III is the MOST IMPORTANT part for every citizen — it guarantees Fundamental Rights!\n\nThese are your **6 Fundamental Rights**:\n\n**1. Right to Equality (Articles 14-18)**\n- Article 14: Equality before law\n- Article 15: No discrimination on grounds of religion, race, caste, sex, or place of birth\n- Article 17: Abolition of untouchability\n\n**2. Right to Freedom (Articles 19-22)**\n- Article 19: Six freedoms (speech, assembly, association, movement, residence, profession)\n- Article 21: Right to Life and Personal Liberty (the MOST powerful article!)\n- Article 21A: Right to Education (6-14 years)\n\n**3. Right against Exploitation (Articles 23-24)**\n- Article 23: Prohibition of human trafficking\n- Article 24: Prohibition of child labor in factories (under 14 years)\n\n**4. Right to Freedom of Religion (Articles 25-28)**\n- Freedom of conscience and free profession of religion\n\n**5. Cultural and Educational Rights (Articles 29-30)**\n- Protection of minorities' interests\n\n**6. Right to Constitutional Remedies (Article 32)**\n- Dr. Ambedkar called this the "Heart and Soul" of the Constitution\n- You can directly approach the Supreme Court if your rights are violated!\n\n**Note**: Right to Property was removed as a fundamental right by the 44th Amendment (1978).`,
        articles: [
          { articleNumber: '14', title: 'Equality before law', description: 'The State shall not deny any person equality before the law' },
          { articleNumber: '21', title: 'Right to Life', description: 'No person shall be deprived of life or personal liberty except by procedure established by law' },
          { articleNumber: '32', title: 'Constitutional Remedies', description: 'Right to move the Supreme Court for enforcement of Fundamental Rights' },
        ],
        funFacts: [
          'Article 21 has been interpreted to include right to clean air, water, livelihood, privacy, and dignity',
          'Right to Property was the 7th fundamental right, removed in 1978',
          'Article 32 is called the "Heart and Soul" of the Constitution',
        ],
        difficulty: 'Intermediate', xpReward: 150, icon: '⚖️', order: 4,
      },
      {
        title: 'Directive Principles of State Policy',
        partNumber: 'Part IV',
        description: 'Guidelines for the government to create a just society — not enforceable in court. Articles 36-51.',
        content: `Part IV contains the Directive Principles of State Policy (DPSP) — these are like a "to-do list" for the government!\n\n**Key Difference from Fundamental Rights:**\n- Fundamental Rights are enforceable in court (justiciable)\n- DPSPs are NOT enforceable in court (non-justiciable)\n- But they are "fundamental in the governance of the country"\n\n**Important DPSPs:**\n- **Article 38**: State shall promote welfare of the people\n- **Article 39**: Equal pay for equal work for men and women\n- **Article 40**: Organization of village panchayats\n- **Article 44**: Uniform Civil Code for all citizens\n- **Article 48A**: Protection of environment and wildlife\n\n**Origin**: DPSPs were borrowed from the Irish Constitution!`,
        articles: [
          { articleNumber: '39', title: 'Equal pay', description: 'Equal pay for equal work for men and women' },
          { articleNumber: '44', title: 'Uniform Civil Code', description: 'State shall endeavor to secure a uniform civil code' },
          { articleNumber: '48A', title: 'Environment protection', description: 'State shall protect and improve the environment' },
        ],
        funFacts: [
          'DPSPs were inspired by the Irish Constitution',
          'Article 44 (Uniform Civil Code) remains one of the most debated DPSPs',
        ],
        difficulty: 'Intermediate', xpReward: 120, icon: '📋', order: 5,
      },
      {
        title: 'Fundamental Duties',
        partNumber: 'Part IV-A',
        description: 'The 11 duties every Indian citizen must follow — added by the 42nd Amendment in 1976. Article 51A.',
        content: `Part IV-A contains the Fundamental Duties of citizens (Article 51A).\n\n**History**: These were NOT part of the original Constitution! They were added by the **42nd Amendment (1976)**.\n\nOriginally there were 10 duties. The **86th Amendment (2002)** added the 11th duty.\n\n**Key Duties:**\n1. Abide by the Constitution and respect the National Flag and National Anthem\n2. Uphold and protect the sovereignty, unity, and integrity of India\n3. Promote harmony and brotherhood among all people\n4. Protect and improve the natural environment\n5. Develop scientific temper\n6. Safeguard public property\n7. **Provide opportunities for education to children aged 6-14** (added in 2002)\n\n**Key Point**: Like DPSPs, Fundamental Duties are NOT enforceable by courts. They are moral obligations.`,
        articles: [
          { articleNumber: '51A', title: 'Fundamental Duties', description: 'List of 11 duties for every Indian citizen' },
        ],
        funFacts: [
          'Fundamental Duties were inspired by the Soviet Union\'s Constitution',
          'They were added in 1976 during the Emergency period',
        ],
        difficulty: 'Beginner', xpReward: 100, icon: '🤝', order: 6,
      },
      {
        title: 'The Union Government',
        partNumber: 'Part V',
        description: 'How the central government works — the President, Parliament, Supreme Court. Articles 52-151.',
        content: `Part V is the largest part of the Constitution covering the Union Government.\n\n**The Executive:**\n- **Article 52**: There shall be a President of India\n- **Article 74**: Council of Ministers headed by the Prime Minister to aid and advise the President\n\n**Parliament (Articles 79-122):**\n- **Article 79**: Parliament = President + Rajya Sabha + Lok Sabha\n- **Rajya Sabha**: Council of States (Upper House)\n- **Lok Sabha**: House of the People (Lower House)\n- **Article 110**: Money Bills can only be introduced in Lok Sabha\n\n**The Supreme Court (Articles 124-147):**\n- **Article 124**: Supreme Court of India\n- **Article 141**: Law declared by Supreme Court is binding on all courts\n\n**Key Fact**: India has a Parliamentary system — the PM and Council of Ministers are responsible to the Lok Sabha, not to the President!`,
        articles: [
          { articleNumber: '52', title: 'The President', description: 'There shall be a President of India' },
          { articleNumber: '79', title: 'Parliament', description: 'Parliament consists of President, Rajya Sabha, and Lok Sabha' },
          { articleNumber: '124', title: 'Supreme Court', description: 'Establishment and constitution of the Supreme Court' },
        ],
        funFacts: [
          'The President is the nominal head; real power lies with the Prime Minister',
          'The Rajya Sabha is a permanent body — it cannot be dissolved',
        ],
        difficulty: 'Advanced', xpReward: 150, icon: '🏛️', order: 7,
      },
      {
        title: 'The State Government',
        partNumber: 'Part VI',
        description: 'How state governments function — Governors, Chief Ministers, State Legislature, and High Courts. Articles 152-237.',
        content: `Part VI mirrors the Union Government structure at the state level.\n\n**The Governor:**\n- **Article 153**: There shall be a Governor for each State (Appointed by President)\n\n**The Chief Minister & Council of Ministers:**\n- **Article 163**: Council of Ministers to aid and advise the Governor\n- **Article 164**: Chief Minister is appointed by the Governor\n\n**State Legislature:**\n- **Article 168**: Legislature = Governor + Legislative Assembly (+ Legislative Council if any)\n- Bicameral states: UP, Bihar, Karnataka, Maharashtra, Andhra Pradesh, Telangana\n\n**High Courts:**\n- **Article 214**: There shall be a High Court for each State\n- **Article 226**: High Courts can issue writs for Fundamental Rights AND other purposes`,
        articles: [
          { articleNumber: '153', title: 'Governor', description: 'There shall be a Governor for each State' },
          { articleNumber: '214', title: 'High Courts', description: 'High Court for each State' },
          { articleNumber: '226', title: 'Writs', description: 'High Courts can issue writs' },
        ],
        funFacts: [
          'Only 6 states in India have a bicameral legislature',
          'High Courts are actually older than the Supreme Court in India',
        ],
        difficulty: 'Intermediate', xpReward: 120, icon: '🏢', order: 8,
      },
      {
        title: 'Panchayats & Municipalities',
        partNumber: 'Part IX & IX-A',
        description: 'Local self-government — how villages and cities govern themselves. Articles 243-243ZG.',
        content: `Parts IX and IX-A establish the framework for local self-governance — the grassroots of Indian democracy!\n\n**Panchayats (Part IX — 73rd Amendment, 1992):**\n- Three-tier system: Gram Panchayat → Panchayat Samiti → Zilla Parishad\n- **Article 243D**: Reservation of seats for SC/ST and women (not less than 1/3)\n- Fixed 5-year term\n\n**Municipalities (Part IX-A — 74th Amendment, 1992):**\n- Three types: Nagar Panchayat, Municipal Council, Municipal Corporation\n- **Article 243T**: Reservation for SC/ST and women\n\n**Historical Significance**: The 73rd and 74th Amendments (1992) were revolutionary — they brought democracy to the doorstep of every village and city in India!`,
        articles: [
          { articleNumber: '243B', title: 'Constitution of Panchayats', description: 'Three-tier Panchayat system' },
          { articleNumber: '243D', title: 'Reservation in Panchayats', description: 'Not less than 1/3 seats for women' },
        ],
        funFacts: [
          '73rd and 74th Amendments brought grassroots democracy in 1992',
          'India has over 2.5 lakh Panchayati Raj Institutions',
        ],
        difficulty: 'Intermediate', xpReward: 120, icon: '🏘️', order: 9,
      },
      {
        title: 'Elections',
        partNumber: 'Part XV',
        description: 'The backbone of democracy — how elections work in India. Articles 324-329.',
        content: `Part XV covers Elections — the process that makes India the world's largest democracy!\n\n**Article 324**: The Election Commission of India\n- Superintendence, direction, and control of elections\n- Consists of the Chief Election Commissioner and other Election Commissioners\n\n**Article 326**: Universal Adult Suffrage — every citizen 18+ has the right to vote\n(Originally 21 years, reduced to 18 by the **61st Amendment in 1988**)\n\n**Article 329**: Courts cannot interfere with electoral matters\n\n**India's Election Scale:**\n- Largest democracy: 900+ million eligible voters\n- Electronic Voting Machines (EVMs) used since 2004\n- Model Code of Conduct enforced during election periods`,
        articles: [
          { articleNumber: '324', title: 'Election Commission', description: 'Superintendence of elections vested in Election Commission' },
          { articleNumber: '326', title: 'Universal suffrage', description: 'Every citizen 18+ has the right to vote' },
        ],
        funFacts: [
          'India is the world\'s largest democracy with 900+ million voters',
          'Voting age was reduced from 21 to 18 in 1988',
        ],
        difficulty: 'Beginner', xpReward: 100, icon: '🗳️', order: 10,
      },
      {
        title: 'Emergency Provisions',
        partNumber: 'Part XVIII',
        description: 'When the nation faces crisis — the three types of emergencies. Articles 352-360.',
        content: `Part XVIII covers Emergency Provisions — the extraordinary powers the government can invoke during crises.\n\n**Three Types of Emergencies:**\n\n**1. National Emergency (Article 352)**\n- Grounds: War, external aggression, or armed rebellion\n- Fundamental Rights (except Articles 20 & 21) can be suspended\n- Used 3 times: 1962, 1971, 1975\n\n**2. President's Rule / State Emergency (Article 356)**\n- When a state government cannot function per the Constitution\n- Has been used over 100 times!\n\n**3. Financial Emergency (Article 360)**\n- When financial stability of India is threatened\n- **Never been declared in Indian history!**\n\n**The 1975 Emergency**: The most controversial use — PM Indira Gandhi declared internal emergency. Led to the **44th Amendment** which added safeguards against misuse.`,
        articles: [
          { articleNumber: '352', title: 'National Emergency', description: 'Proclamation of emergency due to war or armed rebellion' },
          { articleNumber: '356', title: 'President\'s Rule', description: 'Failure of constitutional machinery in states' },
          { articleNumber: '360', title: 'Financial Emergency', description: 'Provisions for financial emergency' },
        ],
        funFacts: [
          'Financial Emergency has NEVER been declared in India',
          'The 1975 Emergency lasted 21 months (June 1975 - March 1977)',
          'Article 356 (President\'s Rule) has been used over 100 times',
        ],
        difficulty: 'Advanced', xpReward: 150, icon: '🚨', order: 11,
      },
      {
        title: 'Amendment of the Constitution',
        partNumber: 'Part XX',
        description: 'How the Constitution changes — the amendment process under Article 368.',
        content: `Part XX deals with Amendment of the Constitution.\n\n**Article 368** gives Parliament the power to amend the Constitution.\n\n**Three Ways to Amend:**\n1. **Simple Majority**: Ordinary majority of members present and voting\n2. **Special Majority**: Majority of total membership + 2/3 of members present and voting in EACH house (e.g. Fundamental Rights)\n3. **Special Majority + State Ratification**: Special majority + ratification by at least half the state legislatures (e.g. Election of President)\n\n**Landmark Case:**\n- **Kesavananda Bharati (1973)**: Supreme Court ruled that Parliament CAN amend the Constitution but CANNOT destroy its "Basic Structure" (democracy, secularism, rule of law).\n\n**As of 2024, there have been 106 Constitutional Amendments!**`,
        articles: [
          { articleNumber: '368', title: 'Power to amend', description: 'Parliament can amend the Constitution through three procedures' },
        ],
        funFacts: [
          'The Constitution has been amended 106 times as of 2024',
          'The Kesavananda Bharati case (1973) established the "Basic Structure" doctrine',
          'The 1st Amendment was passed in 1951',
        ],
        difficulty: 'Advanced', xpReward: 150, icon: '📝', order: 12,
      },
    ];

    const modules = await Module.insertMany(modulesData);
    console.log(`✅ ${modules.length} modules seeded with full rich content`);

    // ==========================================
    // DYNAMIC GAME GENERATION FOR ALL 12 MODULES
    // ==========================================

    // 1. QUIZZES
    console.log('🧠 Seeding quizzes...');
    const quizzes = modules.map(m => {
      let quizDifficulty = 'Medium';
      if (m.difficulty === 'Beginner') quizDifficulty = 'Easy';
      if (m.difficulty === 'Advanced') quizDifficulty = 'Hard';

      return {
        moduleId: m._id,
        questions: [
          { question: `Which part of the constitution deals with ${m.title}?`, options: ['Part I', m.partNumber, 'Part XII', 'Part XXI'], correctAnswer: 1, explanation: `The correct part is ${m.partNumber}.` },
          { question: `What is a key focus of ${m.title}?`, options: ['Monetary Policy', m.description.split(' — ')[0], 'International Trade', 'Sports'], correctAnswer: 1, explanation: 'It is a core concept of this module.' }
        ],
        difficulty: quizDifficulty,
        xpReward: m.xpReward,
        timeLimit: 120,
      };
    });
    // Add module-specific rich questions for key modules to ensure testing is possible
    quizzes[0].questions.push(
      { question: 'What does the Preamble declare India to be?', options: ['A Kingdom', 'A Sovereign Socialist Secular Democratic Republic', 'A Federal State', 'A Communist Nation'], correctAnswer: 1, explanation: 'The Preamble declares India as a Sovereign Socialist Secular Democratic Republic.' },
      { question: 'Which amendment added "Socialist" and "Secular" to the Preamble?', options: ['42nd Amendment', '44th Amendment', '1st Amendment', '73rd Amendment'], correctAnswer: 0, explanation: 'The 42nd Amendment (1976) added "Socialist" and "Secular" to the Preamble.' }
    );
    quizzes[3].questions.push(
      { question: 'How many Fundamental Rights are currently guaranteed?', options: ['5', '6', '7', '8'], correctAnswer: 1, explanation: 'There are 6 Fundamental Rights.' },
      { question: 'Article 21 guarantees:', options: ['Right to equality', 'Right to life and personal liberty', 'Right to religion', 'Right to property'], correctAnswer: 1, explanation: 'Article 21 protects the right to life.' }
    );
    await Quiz.insertMany(quizzes);

    // 2. SCENARIOS
    console.log('⚖️  Seeding scenarios...');
    const scenarios = modules.map(m => ({
      moduleId: m._id,
      title: `${m.title} Dispute`,
      description: `A constitutional crisis regarding ${m.title}.`,
      role: 'Judge',
      situation: `A citizen files a PIL claiming their rights under ${m.partNumber} have been violated based on recent state actions. How do you rule according to the Constitution?`,
      choices: [
        { text: 'Uphold the Constitution', articleRef: m.partNumber, isCorrect: true, outcome: `You correctly applied the principles of ${m.title}.` },
        { text: 'Dismiss the case', articleRef: 'None', isCorrect: false, outcome: 'You ignored the constitutional provisions.' }
      ],
      xpReward: 100,
    }));
    await Scenario.insertMany(scenarios);

    // 3. MATCH CHALLENGES
    console.log('🧩 Seeding match challenges...');
    const matchChallenges = modules.map(m => {
      // Create pairs from the module's articles array if it exists, otherwise use fallback
      let pairs = [];
      if (m.articles && m.articles.length >= 2) {
        pairs = m.articles.slice(0, 4).map(a => ({
          article: `Article ${a.articleNumber}`,
          provision: a.title
        }));
      } else {
        pairs = [
          { article: `Concept 1 of ${m.partNumber}`, provision: 'Core Definition A' },
          { article: `Concept 2 of ${m.partNumber}`, provision: 'Core Definition B' },
          { article: `Concept 3 of ${m.partNumber}`, provision: 'Core Definition C' },
        ];
      }
      return {
        moduleId: m._id,
        title: `Match Concepts: ${m.title}`,
        pairs: pairs,
        timeLimit: 60,
        xpReward: 75,
      };
    });
    // Add specific high-quality matches
    matchChallenges[0].pairs = [
      { article: 'Justice', provision: 'Social, Economic and Political' },
      { article: 'Liberty', provision: 'Thought, Expression, Belief, Faith, Worship' },
      { article: 'Equality', provision: 'Status and Opportunity' },
      { article: 'Fraternity', provision: 'Dignity of the individual and unity' }
    ];
    await MatchChallenge.insertMany(matchChallenges);

    // 4. MEMORY CHALLENGES
    console.log('🃏 Seeding memory challenges...');
    const memoryChallenges = modules.map(m => {
      let pairs = [];
      if (m.funFacts && m.funFacts.length >= 2) {
        pairs = m.funFacts.slice(0, 4).map((fact, index) => ({
          front: `Fact ${index + 1} (${m.partNumber})`,
          back: fact.substring(0, 40) + '...'
        }));
      } else {
        pairs = [
          { front: `Trivia 1 (${m.partNumber})`, back: 'Fact A' },
          { front: `Trivia 2 (${m.partNumber})`, back: 'Fact B' },
        ];
      }
      return {
        moduleId: m._id,
        title: `${m.title} Trivia Memory`,
        pairs: pairs,
        gridSize: 4,
        xpReward: 75,
      };
    });
    // Add specific high-quality memory trivia
    memoryChallenges[0].pairs = [
      { front: '26 Nov 1949', back: 'Constitution Day' },
      { front: '26 Jan 1950', back: 'Republic Day' },
      { front: '42nd Amendment', back: 'Added Secular & Socialist' },
      { front: 'Prem Behari', back: 'Calligrapher of Constitution' }
    ];
    await MemoryChallenge.insertMany(memoryChallenges);

    // 5. TIMELINE CHALLENGES
    console.log('📅 Seeding timeline challenges...');
    const timelineChallenges = modules.map(m => ({
      moduleId: m._id,
      title: `Timeline: ${m.title}`,
      events: [
        { title: 'Drafting Phase', year: 1947, description: `Initial discussions on ${m.title}`, correctOrder: 1 },
        { title: 'Adoption Phase', year: 1949, description: 'Adopted by Constituent Assembly', correctOrder: 2 },
        { title: 'Enactment', year: 1950, description: 'Came into force with the Constitution', correctOrder: 3 },
      ],
      xpReward: 100,
    }));
    await TimelineChallenge.insertMany(timelineChallenges);

    // 6. FILL THE BLANK CHALLENGES
    console.log('✍️  Seeding fill-the-blank challenges...');
    const fillBlanks = modules.map(m => ({
      moduleId: m._id,
      title: `Complete the concepts for ${m.title}`,
      fullText: `The constitution of India defines ${m.title} in ___0___. It is a very important part of our ___1___.`,
      blanks: [
        { index: 0, correctWord: m.partNumber },
        { index: 1, correctWord: 'DEMOCRACY' },
      ],
      wordBank: [m.partNumber, 'DEMOCRACY', 'MONARCHY', 'Part X', 'DICTATORSHIP'],
      xpReward: 100,
    }));
    // Override for Preamble
    fillBlanks[0] = {
      moduleId: modules[0]._id,
      title: 'Complete the Preamble',
      fullText: 'WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a ___0___ ___1___ ___2___ ___3___ ___4___ and to secure to all its citizens...',
      blanks: [
        { index: 0, correctWord: 'SOVEREIGN' },
        { index: 1, correctWord: 'SOCIALIST' },
        { index: 2, correctWord: 'SECULAR' },
        { index: 3, correctWord: 'DEMOCRATIC' },
        { index: 4, correctWord: 'REPUBLIC' }
      ],
      wordBank: ['SOVEREIGN', 'SOCIALIST', 'SECULAR', 'DEMOCRATIC', 'REPUBLIC', 'JUSTICE', 'MONARCHY'],
      xpReward: 100,
    };
    await FillBlankChallenge.insertMany(fillBlanks);

    // ===================== BADGES =====================
    console.log('🏅 Seeding badges...');
    const badges = [
      { badgeId: 'preamble_pioneer', name: 'Preamble Pioneer', description: 'Complete the Preamble module', icon: '🏛️', criteria: { type: 'module_complete', moduleId: 'preamble' }, xpBonus: 50 },
      { badgeId: 'rights_defender', name: 'Rights Defender', description: 'Complete Fundamental Rights module', icon: '⚖️', criteria: { type: 'module_complete', moduleId: 'fundamental_rights' }, xpBonus: 75 },
      { badgeId: 'duty_bound', name: 'Duty Bound', description: 'Complete Fundamental Duties module', icon: '📜', criteria: { type: 'module_complete', moduleId: 'fundamental_duties' }, xpBonus: 50 },
      { badgeId: 'democracy_champion', name: 'Democracy Champion', description: 'Complete Elections module', icon: '🗳️', criteria: { type: 'module_complete', moduleId: 'elections' }, xpBonus: 50 },
      { badgeId: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: '🧠', criteria: { type: 'perfect_quizzes', threshold: 5 }, xpBonus: 100 },
      { badgeId: 'scholar', name: 'Scholar', description: 'Complete 10 modules', icon: '📚', criteria: { type: 'modules_completed', threshold: 10 }, xpBonus: 150 },
    ];
    await Badge.insertMany(badges);

    console.log('\n🎉 All 12 modules seeded with rich content and games!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
