import { SupportedLanguage, TranslatedContent, QuizQuestion } from "./curriculum";


const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const USE_REAL_AI = !!API_KEY;


export async function processDocument(
  rawText: string,
  targetLanguage: SupportedLanguage,
  documentId: string,
  onProgress?: (step: string) => void
): Promise<TranslatedContent> {
  onProgress?.("Translating document…");
  const translatedText = await translateText(rawText, targetLanguage);

  onProgress?.("Generating study guide…");
  const { summary, keyPoints } = await generateStudyGuide(translatedText, targetLanguage);

  onProgress?.("Building adaptive quiz…");
  const questions = await generateQuiz(translatedText, targetLanguage, documentId);

  return {
    language: targetLanguage,
    translatedText,
    summary,
    keyPoints,
    ttsEnabled: true,
    generatedAt: new Date().toISOString(),
    quizzes: [
      {
        id:          `${documentId}-${targetLanguage}-${Date.now()}`,
        language:    targetLanguage,
        documentId,
        questions,
        generatedAt: new Date().toISOString(),
      },
    ],
  };
}


async function translateText(text: string, lang: SupportedLanguage): Promise<string> {
  if (lang === "english") return text;

  if (USE_REAL_AI) {
    const prompt = `You are an expert Nigerian language translator specialising in educational content.

Translate the following English curriculum text into ${LANG_NAMES[lang]}.
- Preserve all factual content and educational meaning.
- Use culturally appropriate examples and terminology.
- Keep any numerical values, dates, and proper nouns as-is unless a standard ${LANG_NAMES[lang]} equivalent exists.
- Output ONLY the translated text, nothing else.

TEXT TO TRANSLATE:
${text.slice(0, 8000)}`; 

    return await callClaude(prompt);
  }

  return simulateTranslation(text, lang);
}


async function generateStudyGuide(
  translatedText: string,
  lang: SupportedLanguage
): Promise<{ summary: string; keyPoints: string[] }> {
  if (USE_REAL_AI) {
    const prompt = `You are an expert educator creating study materials in ${LANG_NAMES[lang]}.

Based on the following text, produce:
1. A clear SUMMARY (3–5 sentences, suitable for a secondary school student).
2. Exactly 5 KEY POINTS as bullet points.

Respond ONLY in valid JSON with this exact shape:
{ "summary": "...", "keyPoints": ["...", "...", "...", "...", "..."] }

TEXT:
${translatedText.slice(0, 6000)}`;

    const raw = await callClaude(prompt);
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return { summary: parsed.summary, keyPoints: parsed.keyPoints };
    } catch {
      
      return { summary: raw.slice(0, 500), keyPoints: [] };
    }
  }

  return simulateStudyGuide(translatedText, lang);
}

async function generateQuiz(
  translatedText: string,
  lang: SupportedLanguage,
  documentId: string
): Promise<QuizQuestion[]> {
  if (USE_REAL_AI) {
    const prompt = `You are an expert educator creating adaptive quiz questions in ${LANG_NAMES[lang]}.

Based on the following text, generate exactly 10 multiple-choice questions with:
- Mix of easy (4), medium (4), and hard (2) difficulty levels.
- 4 answer options each.
- A brief explanation of the correct answer.
- Use gender-neutral and culturally diverse language.

Respond ONLY in valid JSON as an array of objects with this exact shape:
[{
  "id": "q1",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "...",
  "difficulty": "easy",
  "topic": "..."
}]

TEXT:
${translatedText.slice(0, 6000)}`;

    const raw = await callClaude(prompt);
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return parsed.map((q: QuizQuestion, i: number) => ({ ...q, id: `${documentId}-q${i + 1}` }));
    } catch {
      return simulateQuiz(lang, documentId);
    }
  }

  return simulateQuiz(lang, documentId);
}


async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:  "POST",
    headers: {
      "Content-Type":         "application/json",
      "x-api-key":            API_KEY!,
      "anthropic-version":    "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Claude API error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.content
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");
}


const LANG_NAMES: Record<SupportedLanguage, string> = {
  english: "English",
  hausa:   "Hausa",
  igbo:    "Igbo",
  yoruba:  "Yorùbá",
};


function simulateTranslation(text: string, lang: SupportedLanguage): string {
  const excerpts: Record<SupportedLanguage, string> = {
    english: text,
    hausa: `[Fassarar Hausa – Kwaikwaiyo]\n\n${HAUSA_DEMO}\n\n---\nAbun da ke cikin asali:\n${text.slice(0, 800)}…`,
    igbo:  `[Ntụgharị Igbo – Nleda]\n\n${IGBO_DEMO}\n\n---\nOdee mbụ:\n${text.slice(0, 800)}…`,
    yoruba: `[Ìtumọ̀ Yorùbá – Ìdánwò]\n\n${YORUBA_DEMO}\n\n---\nÈdè àkọ̀sílẹ̀:\n${text.slice(0, 800)}…`,
  };
  return excerpts[lang];
}

function simulateStudyGuide(text: string, lang: SupportedLanguage): { summary: string; keyPoints: string[] } {
  const labels: Record<SupportedLanguage, { summary: string; points: string[] }> = {
    english: {
      summary: `This curriculum document covers foundational concepts. Students should understand the core principles, key vocabulary, and practical applications of the subject matter.`,
      points: [
        "Understand the foundational principles of the topic",
        "Identify key vocabulary and terminology",
        "Apply concepts to real-world Nigerian contexts",
        "Practice active recall through self-testing",
        "Connect new knowledge to prior learning",
      ],
    },
    hausa: {
      summary: `Wannan takarda ta koyarwa ta ƙunshi ra'ayoyin asali. Ɗalibai ya kamata su fahimci ƙa'idoji masu mahimmanci da kuma yadda ake amfani da su a rayuwa ta yau da kullun.`,
      points: [
        "Fahimci ƙa'idojin asali na wannan batu",
        "Gane kalmomi masu mahimmanci da ma'anarsu",
        "Sanya ra'ayoyi a cikin mahallin Najeriya",
        "Yi amfani da gwajin kai don ƙarfafa koyo",
        "Haɗa sabon ilimi da abin da aka riga aka sani",
      ],
    },
    igbo: {
      summary: `Akwụkwọ mmụta a na-ekpuchi echiche ndị bụ isi. Ụmụ akwụkwọ kwesịrị ịghọta ụkpụrụ ndị dị mkpa yana otu e si ejikwa ha n'ọrụ ndụ ụbọchị nke ọ bụla.`,
      points: [
        "Ghọta ụkpụrụ isi nke isiokwu a",
        "Chọpụta okwu ndị dị mkpa na nkọwa ha",
        "Tinye echiche n'ọnọdụ Naịjịrịa",
        "Nwee ule onwe gị iji kwado ọmụmụ ihe",
        "Jikọọ ihe ọhụrụ mụtara na ihe a maara tupu ya",
      ],
    },
    yoruba: {
      summary: `Àkọsílẹ̀ ẹ̀kọ́ yìí bo àwọn èrò ìpìlẹ̀. Àwọn akẹ́kọ̀ọ́ yẹ kí wọn ní òye nípa àwọn ìlànà pàtàkì àti bí a ṣe ń lò wọn nínú ìgbésí ayé ọjọ́ títí.`,
      points: [
        "Loye àwọn ìlànà ìpìlẹ̀ ti ẹ̀kọ́ yìí",
        "Dámọ̀ àwọn ọ̀rọ̀ pàtàkì àti ìtumọ̀ wọn",
        "Fi àwọn èrò sínú ìlọ́po Nàìjíríà",
        "Ṣe ìdánwò ara ẹni láti dáná ìkẹ́kọ̀ọ́ mọ́",
        "So ìmọ̀ tuntun pọ̀ mọ́ ohun tí a ti mọ tẹ́lẹ̀",
      ],
    },
  };

  const l = labels[lang];
  console.log(text);
  return { summary: l.summary, keyPoints: l.points };
}

function simulateQuiz(lang: SupportedLanguage, documentId: string): QuizQuestion[] {
  const QUESTIONS: Record<SupportedLanguage, Omit<QuizQuestion, "id">[]> = {
    english: ENGLISH_QUESTIONS,
    hausa:   HAUSA_QUESTIONS,
    igbo:    IGBO_QUESTIONS,
    yoruba:  YORUBA_QUESTIONS,
  };

  return QUESTIONS[lang].map((q, i) => ({ ...q, id: `${documentId}-q${i + 1}` }));
}


const HAUSA_DEMO = `Ilimi shi ne maɓalli na nasara. Kowane ɗalibi yana da ikon koyo da haɓaka iyawarsa. Ta hanyar ƙoƙari da sadaukarwa, ana iya cimma manyan burin rayuwa. Ilimi ba wai kawai a makaranta ake samu ba, yana cikin kowane ɓangare na rayuwarmu.`;

const IGBO_DEMO = `Ọmụmụ ihe bụ igodo ịga nke ọma. Onye ọ bụla nwere ike ịmụta ihe ma mepee ụzọ ya. Site na mbọ na iguzosi ike n'ezi, ọ ga-ekwe omume ịrụ ihe ndị dị oke mkpa n'ndụ. Ọmụmụ ihe adịghị naanị n'ụlọ akwụkwọ, ọ dị n'akụkụ ọ bụla nke ndụ anyị.`;

const YORUBA_DEMO = `Ẹ̀kọ́ ni bọ́ọ̀lù àṣeyọrí. Gbogbo akẹ́kọ̀ọ́ ní agbára láti kọ́ àti láti gbéga ìmọ̀ wọn. Nípa iṣẹ́ àti ìfọkànbalẹ̀, ó ṣeéṣe láti ní àṣeyọrí nínú ìgbésí ayé. Ẹ̀kọ́ kìí ṣe tí ilé-ìwé nìkan, ó wà ní gbogbo apá ìgbésí ayé wa.`;

const ENGLISH_QUESTIONS: Omit<QuizQuestion, "id">[] = [
  { question: "What is the main purpose of a curriculum document?", options: ["To entertain students", "To guide teaching and learning objectives", "To replace teachers", "To reduce school time"], correctIndex: 1, explanation: "A curriculum document outlines the learning objectives, content, and assessment strategies for a course.", difficulty: "easy", topic: "Education" },
  { question: "Which skill is most important for foundational literacy?", options: ["Advanced mathematics", "Reading comprehension", "Computer programming", "Foreign language fluency"], correctIndex: 1, explanation: "Reading comprehension is the cornerstone of foundational literacy, enabling access to all other subjects.", difficulty: "easy", topic: "Literacy" },
  { question: "What does 'MTB-MLE' stand for?", options: ["Modern Technology-Based Multilingual Education", "Mother-Tongue-Based Multilingual Education", "Multi-Teacher-Based Multilingual Evaluation", "Maximum-Time-Based Modular Learning Evaluation"], correctIndex: 1, explanation: "MTB-MLE stands for Mother-Tongue-Based Multilingual Education, which starts instruction in the learner's first language.", difficulty: "medium", topic: "Education Policy" },
  { question: "How does adaptive learning benefit students?", options: ["It gives all students the same content", "It reduces the amount of content to study", "It adjusts difficulty based on student performance", "It eliminates the need for teachers"], correctIndex: 2, explanation: "Adaptive learning systems monitor student responses and adjust the difficulty and type of content accordingly.", difficulty: "medium", topic: "EdTech" },
  { question: "What is a Progressive Web App (PWA)?", options: ["A web app that only works online", "A native mobile app", "A web app with offline capabilities and app-like features", "A programming language"], correctIndex: 2, explanation: "A PWA uses modern web technologies to deliver app-like experiences including offline access and installability.", difficulty: "easy", topic: "Technology" },
  { question: "Why is caching important in low-bandwidth educational apps?", options: ["It makes the app look better", "It allows content to be accessed without re-downloading it", "It increases the app file size", "It prevents students from cheating"], correctIndex: 1, explanation: "Caching stores previously fetched content locally, enabling access without network requests — critical in areas with poor connectivity.", difficulty: "medium", topic: "Technology" },
  { question: "What is active recall in the context of studying?", options: ["Re-reading notes passively", "Testing yourself on material to strengthen memory", "Watching educational videos repeatedly", "Copying notes verbatim"], correctIndex: 1, explanation: "Active recall involves retrieving information from memory (e.g. through quizzes), which has been shown to significantly improve retention.", difficulty: "medium", topic: "Learning Science" },
  { question: "Which of the following best describes 'gender-responsive' educational content?", options: ["Content only for female students", "Content that uses examples relevant only to boys", "Content that uses inclusive language and diverse examples for all genders", "Content that ignores gender entirely"], correctIndex: 2, explanation: "Gender-responsive content ensures representation and relevance for all students regardless of gender.", difficulty: "hard", topic: "Inclusive Education" },
  { question: "In a B2B SaaS model for schools, who is the primary customer?", options: ["Individual students", "Parents", "Ministries of Education and school networks", "Book publishers"], correctIndex: 2, explanation: "B2B (Business-to-Business) means selling to organisations; for school SaaS, that means institutions and government bodies rather than end-users.", difficulty: "hard", topic: "Business Model" },
  { question: "What is the significance of 'human-in-the-loop' in AI education tools?", options: ["AI makes all final decisions", "Teachers review and approve AI-generated content before it reaches students", "Students control the AI", "The loop refers to repeated AI training"], correctIndex: 1, explanation: "Human-in-the-loop ensures that educators validate AI outputs for accuracy, cultural relevance, and bias before distribution.", difficulty: "hard", topic: "AI Ethics" },
];

const HAUSA_QUESTIONS: Omit<QuizQuestion, "id">[] = [
  { question: "Menene manufar takardar koyarwa?", options: ["Don ƙarfafa ɗalibai su yi bacci", "Don jagorantar manufofin koyarwa da koyo", "Don maye gurbin malamai", "Don rage lokacin makaranta"], correctIndex: 1, explanation: "Takardar koyarwa ta bayyana manufofin koyo da abubuwan da za a koyar.", difficulty: "easy", topic: "Ilimi" },
  { question: "Wanne ƙwarewa ta fi muhimmanci don ƙarfin karatu?", options: ["Lissafi mai zurfi", "Fahimtar karatu", "Shirye-shiryen kwamfuta", "Harshen waje"], correctIndex: 1, explanation: "Fahimtar karatu ita ce ginshiƙin ilimin karatu wanda ke ba da damar shiga dukkan fannonin karatu.", difficulty: "easy", topic: "Karatu" },
  { question: "Menene 'koyon harshen uwa' a cikin ilimi?", options: ["Koyo da yare na kasashen waje", "Fara koyarwa da yaren da yaron ya girma da shi", "Koyon harsuna da yawa a lokaci guda", "Shirin gwamnati na harsuna"], correctIndex: 1, explanation: "Koyon harshen uwa yana nufin fara koyarwa da yaren farko na ɗalibi kafin a gabatar da sauran harsuna.", difficulty: "medium", topic: "Manufofin Ilimi" },
  { question: "Ta yaya koyon daidaita (adaptive learning) ke amfanar da ɗalibai?", options: ["Yana ba kowa abubuwa iri ɗaya", "Yana rage adadin abubuwa da za a yi karatu", "Yana daidaita wahalhalu bisa ga ƙwarewar ɗalibi", "Yana kawar da buƙatar malamai"], correctIndex: 2, explanation: "Tsarin koyon daidaita yana lura da amsar ɗalibai kuma yana daidaita wahalhalu daidai da haka.", difficulty: "medium", topic: "Fasahar Ilimi" },
  { question: "Me ake nufi da 'offline' a cikin aikace-aikacen ilimi?", options: ["Amfani da aikace-aikacen ba tare da intanet ba", "Amfani da aikace-aikacen ta hanyar intanet kawai", "Nau'in harshe na musamman", "Shirin buga littafi"], correctIndex: 0, explanation: "Offline yana nufin ikon amfani da aikace-aikacen ba tare da haɗin intanet ba.", difficulty: "easy", topic: "Fasaha" },
  { question: "Me yasa adanawa (caching) ke da muhimmanci a cikin aikace-aikacen ilimi tare da ƙaramin bandwidith?", options: ["Yana sa aikace-aikacen ya zama kyakkyawa", "Yana ba da damar shiga abun ciki ba tare da sauke shi sake ba", "Yana ƙara girman fayil din aikace-aikacen", "Yana hana ɗalibai yaudara"], correctIndex: 1, explanation: "Adanawa yana ajiye abun ciki da aka saukewa a baya a gida, yana ba da damar shiga ba tare da buƙatar hanyar sadarwa ba.", difficulty: "medium", topic: "Fasaha" },
  { question: "Menene 'active recall' a cikin karatu?", options: ["Sake karanta bayanai a hankali", "Gwada kanka kan kayan aiki don ƙarfafa ƙwaƙwalwa", "Kallon bidiyo na ilimi a kai a kai", "Kwafi bayanai daidai dai"], correctIndex: 1, explanation: "Active recall yana nufin dawo da bayani daga ƙwaƙwalwa (misali ta hanyar gwaji), wanda ya nuna yana inganta riƙewa sosai.", difficulty: "medium", topic: "Kimiyyar Koyo" },
  { question: "Wanne daga cikin waɗannan ya fi bayyana abun ciki 'mai amsa ga jinsi'?", options: ["Abun ciki ne kawai ga ɗaliban mata", "Abun ciki da ke amfani da misalai kawai don yara maza", "Abun ciki da ke amfani da harshe mai haɗa kai da misalai iri-iri na dukkan jinsi", "Abun ciki da ke watsi da jinsi gaba ɗaya"], correctIndex: 2, explanation: "Abun ciki mai amsa ga jinsi yana tabbatar da wakilci da dacewa ga dukkan ɗalibai ba tare da la'akari da jinsi ba.", difficulty: "hard", topic: "Ilimin Haɗa Kai" },
  { question: "A cikin tsarin B2B SaaS don makarantu, wanne shine babban abokin ciniki?", options: ["Ɗalibai ɗaya ɗaya", "Iyaye", "Ma'aikatar Ilimi da hanyoyin makarantu", "Mawallafa littattafai"], correctIndex: 2, explanation: "B2B yana nufin siyarwa ga ƙungiyoyi; don makaranta SaaS, hakan yana nufin cibiyoyi da ƙungiyoyin gwamnati.", difficulty: "hard", topic: "Tsarin Kasuwanci" },
  { question: "Mene ne mahimmancin 'human-in-the-loop' a cikin kayan aikin AI na ilimi?", options: ["AI yana yanke duk shawarwari na ƙarshe", "Malamai suna duba da amincewa da abun ciki da AI ya samar kafin ya kai ɗalibai", "Ɗalibai ne ke sarrafa AI", "Loop yana nufin horar da AI akai-akai"], correctIndex: 1, explanation: "Human-in-the-loop yana tabbatar da cewa malamai suna inganta samar da AI don daidaito, dacewa da al'adu, da nuna son kai kafin rarraba.", difficulty: "hard", topic: "Ɗabi'ar AI" },
];

const IGBO_QUESTIONS: Omit<QuizQuestion, "id">[] = [
  { question: "Kedu ebumnuche nke akwụkwọ mmụta?", options: ["Iji nọpụ ụmụ akwụkwọ obi", "Iji duzie ebumnuche nkuzi na mmụta ihe", "Iji dochie ndị nkuzi", "Iji belata oge ụlọ akwụkwọ"], correctIndex: 1, explanation: "Akwụkwọ mmụta na-akọwapụta ebumnuche mmụta, ọdịnaya, na atụmatụ nyocha.", difficulty: "easy", topic: "Agụmakwụkwọ" },
  { question: "Nkà ole kwesịrị ịdị mkpa maka ọmụmụ ihe bụ isi?", options: ["Mgbakọ dị elu", "Nghọta ọgụgụ", "Mmemme kọmpụta", "Asụsụ obodo ọzọ"], correctIndex: 1, explanation: "Nghọta ọgụgụ bụ ntọala nke ọmụmụ ihe bụ isi, na-enye ohere ịnweta isiokwu niile ọzọ.", difficulty: "easy", topic: "Ọmụmụ Ihe" },
  { question: "Gịnị bụ ụzọ mmụta 'asụsụ nne' n'agụmakwụkwọ?", options: ["Mmụta n'asụsụ mba ọzọ", "Ịmalite nkuzi n'asụsụ nke mbụ nke onye na-amụ", "Mmụta ọtụtụ asụsụ n'otu oge", "Mmemme gọọmentị maka asụsụ"], correctIndex: 1, explanation: "Mmụta asụsụ nne pụtara ịmalite nkuzi n'asụsụ izizi nke ụmụ akwụkwọ tupu iwepụta asụsụ ndị ọzọ.", difficulty: "medium", topic: "Iwu Agụmakwụkwọ" },
  { question: "Kedu ka mmụta na-atọgharị (adaptive learning) si bara ụmụ akwụkwọ uru?", options: ["Ọ na-enye onye ọ bụla ọdịnaya otu ahụ", "Ọ na-ebelata ọnụọgụ ihe e nwere ike ịmụ", "Ọ na-agbanwe ike ya dabere n'ọrụ ụmụ akwụkwọ", "Ọ na-ewepụ mkpa nke ndị nkuzi"], correctIndex: 2, explanation: "Usoro mmụta na-atọgharị na-elekọta azịza ụmụ akwụkwọ ma na-agbanwe ike ya dị ka ya kwesịrị.", difficulty: "medium", topic: "Teknụzụ Agụmakwụkwọ" },
  { question: "Gịnị pụtara 'offline' n'ngwa agụmakwụkwọ?", options: ["Iji ngwa ahụ na-enweghị ịntanetị", "Iji ngwa ahụ site na ịntanetị naanị", "Ụdị asụsụ pụrụ iche", "Mmemme ị pịnta akwụkwọ"], correctIndex: 0, explanation: "Offline pụtara ike iji ngwa ahụ na-enweghị njikọ ịntanetị.", difficulty: "easy", topic: "Teknụzụ" },
  { question: "Gịnị mere caching dị mkpa n'ngwa agụmakwụkwọ nwere bandwidth dị obere?", options: ["Ọ na-eme ka ngwa ahụ dị mma", "Ọ na-enye ohere ịnweta ọdịnaya na-enyeghị ntụgharị ya ọzọ", "Ọ na-abawanye nha faịlụ ngwa ahụ", "Ọ na-egbochi ụmụ akwụkwọ ụgha"], correctIndex: 1, explanation: "Caching na-echekwa ọdịnaya etinyere tupu ya n'ebe obibi, na-enye ohere ịnweta ya na-arịọghị netwọk.", difficulty: "medium", topic: "Teknụzụ" },
  { question: "Gịnị bụ 'active recall' n'ọmụmụ ihe?", options: ["Ịgụkarị ndetu n'ụzọ na-adịghị ike", "Ịtụle onwe gị n'ihe ọmụma iji kwado ọchịchọ", "Ilele vidiyo nkuzi ọtụtụ mgbe", "Ịdezie ndetu kpọmkwem"], correctIndex: 1, explanation: "Active recall pụtara ịweghachi ọmụmụ ihe n'echiche (dị ka site na ule), nke egosiri na-eziwanye nchekwa nke ọma.", difficulty: "medium", topic: "Sayensị Mmụta Ihe" },
  { question: "Nke ole n'ime ndị a kọwapụtara ọdịnaya 'na-aza maka ụdị mmadụ'?", options: ["Ọdịnaya naanị maka ụmụ akwụkwọ nke ụmụ nwanyị", "Ọdịnaya na-eji ihe atụ naanị maka ụmụ okorọbịa", "Ọdịnaya na-eji asụsụ gụnyere mmadụ niile na ihe atụ dị iche iche maka ụdị mmadụ niile", "Ọdịnaya na-elegharị ụdị mmadụ kpamkpam"], correctIndex: 2, explanation: "Ọdịnaya na-aza maka ụdị mmadụ na-ahụ na ntọala na mkpa dị maka ụmụ akwụkwọ niile n'agbanyeghị ụdị mmadụ ha.", difficulty: "hard", topic: "Agụmakwụkwọ Gụnyere Mmadụ Niile" },
  { question: "N'ụdị B2B SaaS maka ụlọ akwụkwọ, onye bụ onye ahịa bụ isi?", options: ["Ụmụ akwụkwọ n'onwe ha", "Ndị ọchịchọ", "Ụlọ ọrụ Agụmakwụkwọ na netwọk ụlọ akwụkwọ", "Ndị ebipụta akwụkwọ"], correctIndex: 2, explanation: "B2B pụtara ire ahịa nye ụlọ ọrụ; maka ụlọ akwụkwọ SaaS, nke ahụ pụtara ụlọ ọrụ na ụlọ ọrụ gọọmentị.", difficulty: "hard", topic: "Ụdị Azụmahịa" },
  { question: "Kedu ihe dị mkpa maka 'human-in-the-loop' n'ngwa AI agụmakwụkwọ?", options: ["AI na-eme mkpebi niile ikpeazụ", "Ndị nkuzi na-atụle ma kwado ọdịnaya AI wepụtara tupu ọ ruo ụmụ akwụkwọ", "Ụmụ akwụkwọ na-achịkwa AI", "Loop na-ezo ụzọ ọzọ agụziwanye AI"], correctIndex: 1, explanation: "Human-in-the-loop na-ahụ na ndị nkuzi na-enyocha mmepụta AI maka eziokwu, mkpa omenala, na ụpụ ọchọchọ tupu nkesa.", difficulty: "hard", topic: "Usoro Ikpe AI" },
];

const YORUBA_QUESTIONS: Omit<QuizQuestion, "id">[] = [
  { question: "Kí ni ète àkọ́sílẹ̀ ẹ̀kọ́?", options: ["Láti jẹ́ kí àwọn akẹ́kọ̀ọ́ sùn", "Láti darí àwọn ète ìkọ́nilẹ́kọ̀ọ́ àti ẹ̀kọ́", "Láti rọ́pò àwọn olùkọ́", "Láti dín àkókò ilé-ìwé kù"], correctIndex: 1, explanation: "Àkọ́sílẹ̀ ẹ̀kọ́ ń ṣàlàyé àwọn ète ìkẹ́kọ̀ọ́, àkóónú, àti àwọn ìlànà ìgbésẹ̀ ìdánwò.", difficulty: "easy", topic: "Ẹ̀kọ́" },
  { question: "Ìmọ̀ wo ni ó ṣe pàtàkì jùlọ fún ìmọ̀-ìwé ìpìlẹ̀?", options: ["Mathimatiki gíga", "Òye kíkà", "Ètò kọ̀mpútà", "Èdè àjèjì"], correctIndex: 1, explanation: "Òye kíkà ni ìpìlẹ̀ ìmọ̀-ìwé ìpìlẹ̀, tó ń fún ní ààyè láti wọ gbogbo àwọn àbẹ̀tẹ́lẹ̀ ẹ̀kọ́ mìíràn.", difficulty: "easy", topic: "Ìmọ̀-Ìwé" },
  { question: "Kí ni ẹ̀kọ́ 'èdè ìyá' túmọ̀ sí?", options: ["Ẹ̀kọ́ ní èdè àjèjì", "Bíbẹ̀rẹ̀ ìkọ́nilẹ́kọ̀ọ́ nínú èdè àkọ́kọ́ akẹ́kọ̀ọ́", "Ẹ̀kọ́ ọ̀pọ̀ èdè ní àkókò kan náà", "Ètò ìjọba fún àwọn èdè"], correctIndex: 1, explanation: "Ẹ̀kọ́ èdè ìyá túmọ̀ sí bíbẹ̀rẹ̀ ìkọ́nilẹ́kọ̀ọ́ nínú èdè àkọ́kọ́ akẹ́kọ̀ọ́ ṣáájú ìfihàn àwọn èdè mìíràn.", difficulty: "medium", topic: "Ìlànà Ẹ̀kọ́" },
  { question: "Báwo ni ẹ̀kọ́ tó ń ṣ'àdáptù (adaptive learning) ṣe ń ràn àwọn akẹ́kọ̀ọ́ lọ́wọ́?", options: ["Ó ń fún gbogbo ènìyàn ní àkóónú kan náà", "Ó ń dín iye ohun tó ní láti kẹ́kọ̀ọ́ kù", "Ó ń ṣàtúnṣe ìṣòro rẹ̀ dá lórí iṣẹ́ akẹ́kọ̀ọ́", "Ó ń pa àìníláti àwọn olùkọ́ run"], correctIndex: 2, explanation: "Àwọn ètò ẹ̀kọ́ adáptù ń ṣ'àkíyèsí àwọn ìdáhùn akẹ́kọ̀ọ́ tí wọ́n sì ń ṣàtúnṣe ìṣoro fún ìdánilójú.", difficulty: "medium", topic: "Iṣẹ́-Ẹ̀kọ́ Ìmọ̀-ẹ̀rọ" },
  { question: "Kí ni 'offline' túmọ̀ sí nínú àwọn àpèsè ẹ̀kọ́?", options: ["Lílo àpèsè láì sí ìntánẹ́ẹ̀tì", "Lílo àpèsè nípasẹ̀ ìntánẹ́ẹ̀tì nìkan", "Ìrú èdè pàtàkì kan", "Ètò títẹ̀wé"], correctIndex: 0, explanation: "Offline túmọ̀ sí agbára láti lo àpèsè láìsí ìsopọ̀ ìntánẹ́ẹ̀tì.", difficulty: "easy", topic: "Imọ̀-ẹ̀rọ" },
  { question: "Ẹ̀kọ́ àìsọnù (caching) ṣe pàtàkì tó? fún àwọn àpèsè ẹ̀kọ́ tó ní bandwidth kéré?", options: ["Ó ń mú kí àpèsè náà wò dára", "Ó ń fún ní ààyè sí àkóónú láìsí ìgba títúnbọ̀sínlẹ̀ rẹ̀", "Ó ń pọ̀ sí iye fáìlì àpèsè", "Ó ń dẹ́kun àwọn akẹ́kọ̀ọ́ láti jìbìtì"], correctIndex: 1, explanation: "Caching ń fi àkóónú tó ti gba tẹ́lẹ̀ pamọ́ ní àgbègbè, tó ń fún ní ààyè láìsí ìbéèrè nẹ́tíwọ̀ọ̀kì.", difficulty: "medium", topic: "Imọ̀-ẹ̀rọ" },
  { question: "Kí ni 'active recall' nínú ìkẹ́kọ̀ọ́?", options: ["Títúnkàá àwọn àkọsílẹ̀ ní pẹ̀lẹ́pẹ̀lẹ́", "Ìdánwò ara ẹni lórí ohun tó kẹ́kọ̀ọ́ láti sọ ìrántí di àárín", "Títẹ́jú bọ́ọ̀lù àfikún ẹ̀kọ́ lọ́pọ̀ ìgbà", "Ìdàkẹjẹ̀ àwọn àkọsílẹ̀ gẹ́gẹ́ bí ó ti rí"], correctIndex: 1, explanation: "Active recall jẹ́ gbígba ìmọ̀ padà láti ìrántí (bí ìdánwò), èyí tí a ti fi hàn pé ó ń mú ìdádúró pọ̀ sí.", difficulty: "medium", topic: "Sáyẹ́ǹsì Ẹ̀kọ́" },
  { question: "Èwo nínú àwọn wọ̀nyí ló ṣàpèjúwe àkóónú 'tó ń fèsì sí ìbálò'?", options: ["Àkóónú fún àwọn akẹ́kọ̀ọ́ obìnrin nìkan", "Àkóónú tó ń lo àwọn àpẹẹrẹ fún àwọn ọmọkùnrin nìkan", "Àkóónú tó ń lo èdè àgbàwò àti àwọn àpẹẹrẹ oríṣiríṣi fún gbogbo ìbálò", "Àkóónú tó ń fojú fò ìbálò pátápátá"], correctIndex: 2, explanation: "Àkóónú tó ń fèsì sí ìbálò ń rí i dájú pé àwọn ọmọ ilé-ìwé gbogbo ní àṣojú àti àsopọ̀ láìbíkítà ìbálò wọn.", difficulty: "hard", topic: "Ẹ̀kọ́ Àgbàwò" },
  { question: "Nínú àwọn ètò B2B SaaS fún àwọn ilé-ìwé, tani onígbọ̀wọ́ pàtàkì?", options: ["Àwọn akẹ́kọ̀ọ́ kọ̀ọ̀kan", "Àwọn òbí", "Àwọn Ìjọba Ẹ̀kọ́ àti àwọn nẹ́tíwọ̀ọ̀kì ilé-ìwé", "Àwọn atẹ̀wé ìwé"], correctIndex: 2, explanation: "B2B túmọ̀ sí títa sí àwọn àjọ; fún ilé-ìwé SaaS, ìyẹn túmọ̀ sí àwọn ilé-iṣẹ́ àti àwọn ara ìjọba.", difficulty: "hard", topic: "Àwòṣe Iṣẹ́" },
  { question: "Kí ni ìjẹ́pàtàkì 'human-in-the-loop' nínú àwọn irinṣẹ́ AI ẹ̀kọ́?", options: ["AI ń ṣèpinnu gbogbo ìpinnu ìkẹyìn", "Àwọn olùkọ́ ń ṣàyẹ̀wò tí wọ́n sì ń fọwọ́ sí àkóónú tí AI ṣe ṣáájú kí ó tó dé àwọn akẹ́kọ̀ọ́", "Àwọn akẹ́kọ̀ọ́ ní ìṣàkóso lórí AI", "Loop tọ́ka sí ìgba títúnṣe AI"], correctIndex: 1, explanation: "Human-in-the-loop ń rí i dájú pé àwọn olùkọ́ ń ṣàyẹ̀wò àbájáde AI fún ìdánilójú, ìbáradọ̀pọ̀ àṣà, àti ojúṣajú ṣáájú ìpínpín.", difficulty: "hard", topic: "Ìlànà AI" },
];