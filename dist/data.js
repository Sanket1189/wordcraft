const parseWords = (text) => text.split('\n').filter(Boolean).map(line => {
  const [word, meaning, example] = line.split('|');
  return { word, meaning, example };
});
const lesson = (title, idea, pattern, example) => ({ title, idea, pattern, example });

const DAYS = [
  {
    theme: 'Clear thinking', note: 'Express ideas with confidence',
    words: parseWords(`Impulsive|acting suddenly without thinking carefully|Buying that expensive phone was an impulsive decision.
Reckless|acting without caring about danger or consequences|Driving that fast in the rain was reckless.
Sustain|keep something going for a long time|The team cannot sustain this pace forever.
Conceive|imagine or form an idea in your mind|I cannot conceive of a better solution.
Disrupt|interrupt the normal way something works|The storm disrupted train services.
Persistent|continuing despite difficulty|Her persistent effort finally paid off.
Inherent|existing naturally as part of something|Every investment has an inherent risk.
Articulate|able to express thoughts clearly|She is articulate when explaining difficult ideas.
Infer|reach a conclusion from evidence|From his tone, I inferred that he was upset.
Alleviate|make pain or a problem less severe|A short break may alleviate some stress.`),
    lessons: [
      lesson('“Would” is not always hypothetical','Would can be “will” viewed from a past point in reported speech.','said + would + base verb','He said he would call me.'),
      lesson('“Could”: past ability vs possibility','Learn two common meanings of could: an ability someone had in the past, and something that may happen.','could + base verb','I could swim at six. / It could rain tonight.'),
      lesson('“I was wondering…” means now','Past-looking forms often make a present request softer and more polite.','I was wondering if + subject + could','I was wondering if you could send the file.')
    ]
  },
  {
    theme: 'Precision', note: 'Notice details and communicate them',
    words: parseWords(`Meticulous|very careful about small details|She is meticulous when checking reports.
Convey|communicate an idea, feeling, or message|I could not convey what I really meant.
Detract|reduce the value or quality of something|The poor lighting detracts from the room.
Apprehensive|worried about something that may happen|I am apprehensive about tomorrow's interview.
Erratic|unpredictable; not following a regular pattern|His sleep schedule has become erratic.
Eloquent|expressing ideas clearly and beautifully|She gave an eloquent speech.
Tangible|real, clear, or measurable|We need tangible results, not promises.
Frivolous|not serious or worthwhile|The court dismissed the claim as frivolous.
Diligent|careful and hardworking|He is a diligent student who reviews every day.
Exemplify|be a strong example of something|Her actions exemplify good leadership.`),
    lessons: [
      lesson('“Would you mind…?”','Answer “No, not at all” when you are happy to do the request.','would you mind + verb-ing','Would you mind closing the door?'),
      lesson('Have something done','Use the causative when you arrange for another person to perform a service.','have + object + past participle','I had my laptop repaired.'),
      lesson('Used to vs be used to','Used to describes an old habit that stopped. Be used to describes something that feels normal now.','used to + base verb / be used to + noun or -ing','I used to wake late. Now I am used to waking early.')
    ]
  },
  {
    theme: 'Strong opinions', note: 'Agree, disagree and explain why',
    words: parseWords(`Contend|argue or claim that something is true|Some experts contend that prices will rise.
Elusive|difficult to find, achieve, or understand|A permanent solution remains elusive.
Impeccable|extremely good; without faults|Her timing was impeccable.
Deterrent|something that discourages an action|Heavy fines can act as a deterrent.
Exacerbate|make an already bad situation worse|Ignoring the issue could exacerbate it.
Mundane|ordinary, repetitive, and uninteresting|I spent Sunday doing mundane chores.
Assertive|confident without being aggressive|Be assertive when setting your boundaries.
Conspicuous|very noticeable or easy to see|His bright jacket made him conspicuous.
Predicament|a difficult or unpleasant situation|I found myself in an awkward predicament.
Unwarranted|not justified or necessary|The criticism was completely unwarranted.`),
    lessons: [
      lesson("Needn't have vs didn't need to","Needn't have means the action happened unnecessarily; didn't need to leaves it unclear.","needn't have + past participle","You needn't have brought food."),
      lesson('So do I / Neither do I','Agree without repeating the whole sentence; match the auxiliary in the first statement.','so/neither + auxiliary + subject','I love coffee. — So do I.'),
      lesson('Assertive, not aggressive','Use calm “I” statements and clear reasons instead of blame.','I + position + because + reason','I disagree because the cost is too high.')
    ]
  },
  {
    theme: 'People & feelings', note: 'Describe personalities naturally',
    words: parseWords(`Hesitant|unsure or slow to act|I was hesitant to ask her about it.
Genuine|real, honest, or sincere|He seems like a genuinely kind person.
Awkward|uncomfortable or socially strange|The silence became awkward.
Nosy|too interested in private matters|My neighbors can be rather nosy.
Grumpy|easily annoyed or in a bad mood|Why are you so grumpy today?
Overwhelmed|feeling you have too much to handle|I felt overwhelmed by all the work.
Clingy|wanting too much attention from someone|He gets clingy when she does not reply.
Gullible|too willing to believe what people say|Do not be gullible; check the source.
Stubborn|unwilling to change an opinion|He is too stubborn to admit he was wrong.
Considerate|thinking about other people's needs|It was considerate of her to call first.`),
    lessons: [
      lesson('Adjective + preposition','Many feeling adjectives naturally pair with a particular preposition.','adjective + of/about/with','I am nervous about the exam.'),
      lesson('Make vs make someone feel','Use make + object + adjective to describe an emotional effect.','make + person + adjective','That comment made me uncomfortable.'),
      lesson('“A bit” for softer descriptions','Put a bit before a negative adjective to make criticism sound gentler.','a bit + adjective','He is a bit stubborn sometimes.')
    ]
  },
  {
    theme: 'Everyday reactions', note: 'Sound natural in real conversations',
    words: parseWords(`Oblivious|completely unaware of something|He was oblivious to everyone waiting.
Petty|caring too much about small issues|Do not be petty over a small mistake.
Naive|inexperienced and too ready to believe|I was naive enough to trust the message.
Intimidating|making someone feel nervous|She seemed intimidating at first.
Sincere|honest and genuine in feeling|His apology sounded sincere.
Baffled|completely confused|I am baffled by his decision.
Tempted|feeling a strong desire to do something|I am tempted to order another pizza.
Vivid|very clear and detailed in the mind|I have a vivid memory of that day.
Sarcastic|using the opposite meaning to mock or joke|“Great timing,” she said sarcastically.
Reassure|make someone feel less worried|She reassured me that all was well.`),
    lessons: [
      lesson("Don't have to vs mustn't","Don't have to means optional; mustn't means prohibited.","don't have to = no obligation","You don't have to come. / You mustn't enter."),
      lesson('Should can show probability','Should sometimes means “I expect this to happen,” not advice.','subject + should + base verb','The train should arrive soon.'),
      lesson('Sounding sincere','Present a clear apology, ownership and repair—without excuses.','sorry + for + -ing','I am sorry for interrupting. I will listen.')
    ]
  },
  {
    theme: 'Calm confidence', note: 'Handle pressure with better words',
    words: parseWords(`Composed|calm and in control of your feelings|She remained composed during the argument.
Resilient|able to recover quickly from difficulty|Children can be remarkably resilient.
Adaptable|able to adjust to new conditions|An adaptable person learns quickly.
Candid|honest and direct in a helpful way|Let me be candid about the problem.
Pragmatic|focused on practical solutions|We need a pragmatic approach.
Reluctant|unwilling and hesitant|He was reluctant to share the news.
Vulnerable|open to emotional or physical harm|It is okay to feel vulnerable sometimes.
Empathetic|able to understand another's feelings|She was empathetic and listened carefully.
Decisive|able to make decisions quickly and firmly|Good leaders are calm and decisive.
Tactful|careful not to upset or offend|He gave tactful feedback.`),
    lessons: [
      lesson('Although vs despite','Although takes a clause; despite takes a noun or -ing form.','although + clause / despite + noun','Although I was tired, I went. Despite being tired, I went.'),
      lesson('Had better','Use had better for strong advice when a negative consequence is likely.','had better + base verb','You had better leave before the storm.'),
      lesson('Polite disagreement','Acknowledge the other view before sharing your concern.','I see your point, but…','I see your point, but I worry about the cost.')
    ]
  },
  {
    theme: 'Reading situations', note: 'Understand what is really happening',
    words: parseWords(`Ambiguous|having more than one possible meaning|The instructions were ambiguous.
Subtle|not obvious; delicate or slight|There was a subtle change in her tone.
Apparent|easy to see or understand|It became apparent that we were lost.
Dubious|doubtful or not trustworthy|That sounds like a dubious excuse.
Coherent|logical, clear, and connected|She gave a coherent explanation.
Contradict|say the opposite of a statement|The evidence contradicts his story.
Distort|change facts so they become misleading|Do not distort what I said.
Overlook|fail to notice something|I overlooked a small error.
Perceive|notice or understand something|People perceive risk differently.
Reveal|make something previously hidden known|The report revealed several problems.`),
    lessons: [
      lesson('Must have vs might have','Use must have for a strong past deduction; might have for a possibility.','modal + have + past participle','She must have left. / She might have left.'),
      lesson('Seem vs look','Seem gives a general impression. Look describes an impression based mainly on what you can see.','seem/look + adjective','The plan seems risky. You look tired.'),
      lesson('Indirect questions','After an opening phrase, use statement word order—not question order.','Do you know + question word + subject + verb','Do you know where he is?')
    ]
  },
  {
    theme: 'Conversation flow', note: 'Keep discussions clear and natural',
    words: parseWords(`Elaborate|explain in more detail|Could you elaborate on that point?
Clarify|make something easier to understand|Please clarify what you mean.
Acknowledge|show that you recognize something|He acknowledged that I was right.
Interject|interrupt briefly with a comment|May I interject for a moment?
Digress|move away from the main subject|I am sorry—I digress.
Reiterate|say something again for emphasis|Let me reiterate the main point.
Concise|brief but clear|Keep your answer concise.
Relevant|closely connected to the subject|That detail is not relevant here.
Persuasive|good at convincing people|She made a persuasive argument.
Misinterpret|understand something incorrectly|Do not misinterpret my silence.`),
    lessons: [
      lesson('Do you mean…?','Check your understanding before you react or disagree.','Do you mean + clause?','Do you mean we need to start again?'),
      lesson('Actually: correction, not decoration','Actually often corrects an assumption; overusing it can sound confrontational.','Actually, + correction','Actually, the meeting is on Friday.'),
      lesson('However vs therefore','However introduces a contrast. Therefore introduces a result.','sentence; however/therefore, sentence','The plan is costly; however, it may save time.')
    ]
  },
  {
    theme: 'Choices & consequences', note: 'Talk about decisions with nuance',
    words: parseWords(`Feasible|possible and practical|Is the plan financially feasible?
Viable|capable of working successfully|We need a viable alternative.
Compromise|an agreement where each side gives up something|We finally reached a compromise.
Prioritize|decide what is most important|You need to prioritize your health.
Anticipate|expect and prepare for something|We anticipate heavy traffic tonight.
Inevitable|certain to happen|Some change is inevitable.
Consequence|a result of an action|Every choice has a consequence.
Rational|based on reason and logic|Try to make a rational decision.
Spontaneous|done naturally without planning|We took a spontaneous trip.
Regret|feel sorry about a past choice|I regret not speaking up earlier.`),
    lessons: [
      lesson('First vs second conditional','Use the first for a real future possibility and the second for an imagined one.','if + present, will / if + past, would','If it rains, we will stay in. If I were rich, I would travel.'),
      lesson('Wish about the present','Use wish + past form for a present reality you want to be different.','wish + past simple','I wish I had more time.'),
      lesson('Rather than','Show a preferred alternative without a long comparison.','verb + rather than + verb','Let us solve it rather than blame each other.')
    ]
  },
  {
    theme: 'Trust & relationships', note: 'Speak about connection and boundaries',
    words: parseWords(`Reliable|consistently dependable|She is reliable and always arrives on time.
Loyal|giving strong and steady support|He remained loyal to his friends.
Resentful|angry because of unfair treatment|She felt resentful after being ignored.
Forgiving|willing to stop feeling angry|He is forgiving when people apologize.
Manipulative|controlling people unfairly for personal gain|That message felt manipulative.
Supportive|giving encouragement or help|My family has been very supportive.
Detached|not emotionally involved|He sounded strangely detached.
Affectionate|showing fondness and love|They are warm and affectionate.
Compatible|able to exist or work well together|We have compatible values.
Reciprocal|given or felt equally by both sides|Trust should be reciprocal.`),
    lessons: [
      lesson('Each other vs one another','Both describe a shared action between people; each other is most common.','subject + verb + each other','We support each other.'),
      lesson('Let vs allow','Both can mean giving permission. Let takes a base verb; allow takes to + verb.','let + person + base verb / allow + person + to verb','She let me leave. She allowed me to leave.'),
      lesson('Setting a boundary','State the behavior, its effect, and what you need—calmly and directly.','When X, I feel Y. I need Z.','When plans change late, I feel stressed. Please tell me earlier.')
    ]
  },
  {
    theme: 'Work with ease', note: 'Useful English for any workplace',
    words: parseWords(`Delegate|give a task to another person|A good manager knows when to delegate.
Collaborate|work together toward a result|The two teams will collaborate.
Streamline|make a process simpler and faster|This tool will streamline our workflow.
Accountable|responsible for actions or results|We are accountable for the final decision.
Proactive|acting before a problem occurs|She took a proactive approach.
Competent|having the needed skill or ability|He is a competent and careful engineer.
Transparent|open, clear, and honest|The process should be transparent.
Constructive|helpful and intended to improve|Thank you for the constructive feedback.
Consensus|general agreement in a group|The team reached a consensus.
Initiative|the ability to act without being told|She showed initiative and solved it herself.`),
    lessons: [
      lesson('Present perfect for updates','Use it for a recent action that matters now; avoid a finished past time word.','have/has + past participle','I have finished the report.'),
      lesson('By vs until','By is a deadline; until is a continuing duration.','by + deadline / until + end point','Send it by Friday. I will wait until Friday.'),
      lesson('Constructive feedback','Name the strength, the specific issue and the next step.','works well + could improve + next step','The structure works well; the ending could be clearer.')
    ]
  },
  {
    theme: 'Travel & discovery', note: 'Describe places, plans and surprises',
    words: parseWords(`Scenic|having beautiful natural views|We took the scenic route home.
Remote|far away from cities or crowds|They stayed in a remote village.
Bustling|full of energetic activity|The market was bustling at noon.
Serene|calm, peaceful, and untroubled|The lake looked serene at sunrise.
Cramped|too small and crowded|The hotel room felt cramped.
Venture|go somewhere new or risky|We ventured beyond the tourist area.
Wander|walk without a fixed direction|We wandered through the old streets.
Navigate|find a route through a place|It was hard to navigate the narrow roads.
Hospitality|friendly treatment of guests|We were touched by their hospitality.
Itinerary|a detailed travel plan|Our itinerary includes three cities.`),
    lessons: [
      lesson('Been to vs gone to','Been to means visited and returned; gone to means still there or on the way.','have been to / have gone to','Maya has been to Goa. Raj has gone to Goa.'),
      lesson('So…that vs such…that','Use so with an adjective; such with an adjective + noun.','so + adjective / such + noun','It was so peaceful. It was such a peaceful place.'),
      lesson('Natural recommendations','Use worth + -ing or “you might want to” for friendly suggestions.','worth + verb-ing','The old town is worth visiting.')
    ]
  },
  {
    theme: 'News & evidence', note: 'Discuss information carefully',
    words: parseWords(`Credible|able to be believed or trusted|Use a credible source.
Biased|unfairly favoring one side|The article felt politically biased.
Allegation|a claim not yet proven|The company denied the allegation.
Verify|check that something is true|Verify the story before sharing it.
Speculate|guess without firm evidence|I do not want to speculate.
Misleading|giving a wrong impression|The headline was misleading.
Authentic|real and not copied or fake|Experts confirmed the signature was authentic.
Context|information that explains a situation|The quote needs more context.
Corroborate|support a claim with more evidence|Two witnesses corroborated her account.
Refute|prove that a statement is false|The new evidence refutes the rumor.`),
    lessons: [
      lesson('According to','Attribute information to a source without claiming it as your own fact.','according to + source','According to the report, prices fell.'),
      lesson('Passive for unknown actors','Use the passive when the action matters more than who did it.','be + past participle','The documents were released yesterday.'),
      lesson('“Suggests that” for careful claims','Use suggests that when evidence points to an answer but does not prove it completely.','evidence + suggests that + clause','The data suggests that demand is slowing.')
    ]
  },
  {
    theme: 'Money & value', note: 'Talk about spending without confusion',
    words: parseWords(`Affordable|not too expensive|We found an affordable apartment.
Extravagant|costing more than is necessary|The wedding was beautiful but extravagant.
Frugal|careful about spending money|She is frugal but not stingy.
Lucrative|producing a lot of profit|It became a lucrative business.
Scarce|not available in sufficient quantity|Clean water is scarce in the region.
Abundant|existing in large quantities|Fresh fruit is abundant in summer.
Worthwhile|worth the time, money, or effort|The course was difficult but worthwhile.
Allocate|assign money or resources for a purpose|We allocated more money to repairs.
Splurge|spend freely on a treat|I decided to splurge on good headphones.
Stingy|unwilling to spend or share|Do not be stingy with praise.`),
    lessons: [
      lesson('Worth vs worthwhile','Worth is followed by a noun or -ing action. Worthwhile describes something valuable enough for your time or effort.','worth + noun/-ing / be worthwhile','The book is worth reading. The course was worthwhile.'),
      lesson('Fewer vs less','Use fewer with countable nouns and less with uncountable amounts.','fewer + count noun / less + mass noun','Fewer bills, less stress.'),
      lesson('Cost vs spend','Use cost with the thing or service as the subject. Use spend with the person as the subject.','thing + costs + amount / person + spends + amount + on + thing','The trip cost ₹5,000. I spent ₹5,000 on the trip.')
    ]
  },
  {
    theme: 'Habits & growth', note: 'Build language for personal progress',
    words: parseWords(`Consistent|done in the same steady way|Small, consistent effort creates results.
Disciplined|able to control your actions|She is disciplined about her routine.
Procrastinate|delay something that needs doing|I procrastinate when a task feels huge.
Motivate|give someone a reason to act|Clear goals motivate me.
Momentum|progress that becomes stronger over time|Do not lose your momentum now.
Plateau|a period when progress stops|My fitness progress reached a plateau.
Refine|improve through small changes|Practice helps you refine your pronunciation.
Cultivate|develop a quality over time|Cultivate the habit of reading daily.
Accomplish|successfully complete something|We accomplished more than expected.
Sustainable|able to continue for a long time|Choose a sustainable study routine.`),
    lessons: [
      lesson('Stop doing vs stop to do','Stop doing ends an activity; stop to do pauses one activity for another.','stop + -ing / stop + to verb','I stopped smoking. I stopped to answer the phone.'),
      lesson('Little by little','Use adverbial phrases to show gradual change naturally.','little by little / over time','Little by little, speaking became easier.'),
      lesson('It takes…','Describe the time or effort needed for a result.','it takes + time + to verb','It takes twenty minutes to review the words.')
    ]
  },
  {
    theme: 'Conflict & repair', note: 'Navigate disagreement maturely',
    words: parseWords(`Confront|deal directly with a difficult issue|We need to confront the real problem.
Escalate|become or make more serious|The argument quickly escalated.
Defuse|make a tense situation calmer|Her joke helped defuse the tension.
Reconcile|restore a friendly relationship|They reconciled after a long conversation.
Grievance|a complaint about unfair treatment|Employees raised a formal grievance.
Hostile|unfriendly and ready to argue|The conversation became hostile.
Defensive|quick to protect yourself from criticism|He became defensive when questioned.
Misunderstanding|a failure to understand correctly|It was a simple misunderstanding.
Compassion|kind concern for suffering|She treated him with compassion.
Amends|something done to repair harm|He tried to make amends.`),
    lessons: [
      lesson('If I were you',"Use this fixed phrase to give advice from another person's position.",'if I were you, I would…','If I were you, I would apologize.'),
      lesson('The third conditional','Imagine a different past and its unreal result.','if + had + participle, would have + participle','If I had listened, I would have avoided the mistake.'),
      lesson('De-escalating language','Replace absolute blame with a specific observation and a shared goal.','I may be wrong, but…','I may be wrong, but I think we misunderstood each other.')
    ]
  },
  {
    theme: 'Health & balance', note: 'Describe wellbeing with care',
    words: parseWords(`Fatigued|extremely tired|I felt fatigued after the long journey.
Restless|unable to relax or stay still|I had a restless night.
Nourish|provide what is needed for health|Good food nourishes the body.
Sedentary|involving too much sitting|A sedentary lifestyle can affect health.
Moderate|not extreme in amount or degree|Try some moderate exercise.
Chronic|continuing for a long time|He lives with chronic back pain.
Recover|return to normal after illness or difficulty|Give yourself time to recover.
Rejuvenate|make someone feel fresh and energetic again|A quiet weekend can rejuvenate you.
Mindful|paying calm attention to the present|Be mindful of your breathing.
Wellbeing|the state of being healthy and content|Sleep is essential for wellbeing.`),
    lessons: [
      lesson('Feel vs feel like','Feel takes an adjective; feel like takes a noun or -ing form.','feel + adjective / feel like + -ing','I feel tired. I feel like resting.'),
      lesson('Too and enough','Too means more than desirable; enough means sufficient.','too + adjective / adjective + enough','I am too tired to drive. I am well enough to work.'),
      lesson('“Might want to” for gentle advice','Use might want to when you want to suggest an action without sounding like you are giving an order.','you might want to + base verb','You might want to take a short break.')
    ]
  },
  {
    theme: 'Creativity & ideas', note: 'Give shape to imagination',
    words: parseWords(`Innovative|introducing a new and useful idea|They found an innovative solution.
Original|new and not copied|Her concept feels fresh and original.
Imaginative|showing creative thinking|The film has an imaginative story.
Inspire|fill someone with a desire to create or act|Her work inspired me to begin.
Envision|imagine a future possibility|Can you envision the finished space?
Improvise|create or perform without preparation|We had to improvise when the power failed.
Experiment|try an idea to learn what happens|Experiment with a different style.
Unconventional|different from what is usual|He chose an unconventional career path.
Insightful|showing a deep understanding|That was an insightful observation.
Transform|change completely in form or character|A few edits transformed the design.`),
    lessons: [
      lesson('What if…?','Use what if to explore a possibility without presenting it as a decision.','what if + present or past?','What if we use a simpler design?'),
      lesson('Gerunds as subjects','An -ing form can name an activity and act as the subject.','verb-ing + singular verb','Reading improves your vocabulary.'),
      lesson('Building on an idea','Yes, and… acknowledges an idea before extending it.','yes, and + addition','Yes, and we could add a practice quiz.')
    ]
  },
  {
    theme: 'Change & uncertainty', note: 'Stay clear when the future is not',
    words: parseWords(`Uncertain|not known or definite|The future remains uncertain.
Volatile|likely to change suddenly|The market has been volatile.
Gradual|happening slowly over time|Recovery was gradual but steady.
Drastic|extreme and sudden|We do not need drastic changes.
Transition|the process of changing states|The transition took several months.
Obsolete|no longer useful because something newer exists|The old device is now obsolete.
Emerging|starting to become important or visible|She studies emerging technologies.
Fluctuate|rise and fall irregularly|Fuel prices fluctuate throughout the year.
Stabilize|become steady and unlikely to change|Prices began to stabilize.
Unprecedented|never known or done before|The city faced unprecedented rainfall.`),
    lessons: [
      lesson('Be about to','Use it for something expected to happen very soon.','be about to + base verb','The show is about to start.'),
      lesson('Likely and unlikely','Use be likely to for probability; do not use “will likely to”.','be likely/unlikely + to verb','Prices are likely to rise.'),
      lesson('Future in progress','Use will be + -ing for an action in progress at a future time.','will be + verb-ing','This time tomorrow, I will be flying home.')
    ]
  },
  {
    theme: 'Mastery', note: 'Bring precision and confidence together',
    words: parseWords(`Nuance|a small but important difference|The translation misses an important nuance.
Fluent|able to speak smoothly and easily|She is fluent in three languages.
Versatile|useful in many different ways|It is a versatile expression.
Proficient|skilled and competent|He is proficient in written English.
Intuitive|easy to understand without explanation|The app feels intuitive to use.
Compelling|very convincing or interesting|She presented a compelling case.
Discern|recognize something not immediately obvious|It was hard to discern his intention.
Synthesize|combine ideas into a connected whole|The essay synthesizes several viewpoints.
Mastery|complete knowledge or skill|Mastery comes from deliberate practice.
Confident|sure of your ability or judgment|Speak slowly and sound confident.`),
    lessons: [
      lesson('Emphasis with “do”','Add do/does/did before a base verb to strongly confirm a statement.','do/does/did + base verb','I do understand your concern.'),
      lesson('The power of pausing','A short pause sounds more confident than filling silence with “um” or rushing.','idea • pause • next idea','I agree with the goal… but the timing worries me.'),
      lesson('Keep the habit alive','Review with spaced practice: today, tomorrow, in three days and next week.','learn → retrieve → use → review','Use three new words in a real conversation today.')
    ]
  }
];

// Guard against accidental repeated vocabulary across the course.
const seenWords = new Set();
DAYS.forEach(day => day.words.forEach(item => {
  const key = item.word.toLowerCase();
  if (seenWords.has(key)) console.warn('Repeated course word:', item.word);
  seenWords.add(key);
}));
