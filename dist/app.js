const app = document.querySelector('#app');
const completed = new Set(JSON.parse(localStorage.getItem('wordcraft-completed') || '[]'));

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const saveProgress = () => localStorage.setItem('wordcraft-completed', JSON.stringify([...completed]));

function buildLessonGuide(item) {
  const title = item.title.toLowerCase();
  const rules = [
    [/context practice/, ['A word becomes useful when it is connected to a real person, place, action, or problem. A short scene gives your memory several clues instead of only one definition.','Instead of memorizing “calm,” say: “I stayed calm when the train was delayed.”','Do not force many new words into one unnatural sentence. Three well-used words are enough.','Write two connected sentences about a real situation and include three words from today.']],
    [/speaking drill/, ['Speaking creates a different kind of memory from silent reading. Recalling a meaning before checking it also shows which words need another review.','Choose one word, explain it simply, and then use it in a sentence about your own life.','Do not rush through the list. Clear pronunciation and a complete sentence matter more than speed.','Record a sixty-second voice note, listen once, and repeat any unclear sentence.']],
    [/would.*hypothetical|reported.*would/, ['When a future promise is reported from a past viewpoint, “will” normally moves back to “would.” The event may still be real or planned—it is not automatically imaginary.','Direct: “I will help.” Reported: “She said she would help.”','Do not add an if-clause unless you truly mean a condition. “He said he would call” is reported speech, not a conditional.','Report this sentence: Maya said, “I will finish it tonight.”']],
    [/could/, ['Context decides the meaning. Could may describe past ability, a present or future possibility, or a polite request. The time is not determined by the word alone.','Past ability: “I could swim at six.” Possibility: “It could rain later.”','Do not assume every sentence with could refers to the past. Look for time words and the speaker’s purpose.','Make one sentence for past ability and one polite request using could.']],
    [/mind/, ['The question asks whether the action would bother someone. That is why “No, not at all” means you are happy to do it. After mind, use an -ing form.','“Would you mind waiting?” — “No, not at all.”','Avoid “mind to wait.” The natural pattern is mind + waiting, helping, closing, or another -ing form.','Politely ask someone to lower the music using “Would you mind…?”']],
    [/have something done|causative/, ['This structure shows that you arranged a service rather than performed the action yourself. The tense appears on have, while the service verb stays as a past participle.','“I had my phone repaired” means another person repaired it for me.','“I repaired my phone” means you personally did the repair. Do not use the two sentences as if they mean the same thing.','Describe one service you arranged recently: hair, delivery, repair, or cleaning.']],
    [/used to|get used to|be used to/, ['Used to + verb describes an old habit. Be used to + noun or -ing describes something familiar now. Get used to describes the process of becoming comfortable with it.','“I used to wake early.” / “I am used to waking early.”','After be used to or get used to, do not use the base verb: say “used to working,” not “used to work.”','Write three stages: not familiar, becoming familiar, and familiar now.']],
    [/needn.t have|didn.t need/, ['Needn’t have tells us the action happened but was unnecessary. Didn’t need to only tells us there was no necessity—the context may reveal whether it happened.','“You needn’t have waited” means you did wait.','Do not use needn’t have when the person definitely did not perform the action.','Imagine a friend bought unnecessary food. Respond naturally.']],
    [/so do i|neither/, ['The auxiliary in the reply must match the first statement: am, can, have, did, or do. Use so after a positive statement and neither after a negative one.','“I am tired.” — “So am I.” / “I cannot drive.” — “Neither can I.”','Avoid “So I do” when you mean “me too.” That word order usually has a different emphatic meaning.','Respond to: “I watched that movie” and “I do not eat meat.”']],
    [/mustn.t|don.t have to/, ['These forms have opposite practical effects. Don’t have to removes an obligation, while mustn’t creates a prohibition.','“You don’t have to come” means it is optional. “You mustn’t enter” means do not enter.','Do not use mustn’t when you only mean something is unnecessary. It can sound like a strict ban.','Write one optional action and one prohibited action.']],
    [/should.*probability/, ['Should can express an expectation based on normal conditions. In that use, the speaker believes something is likely, but does not promise it.','“The parcel should arrive today” means that is the expected result.','Do not read every should as advice. Ask whether the sentence recommends an action or predicts a likely result.','Use should to predict when a friend, train, or delivery will arrive.']],
    [/first conditional/, ['The condition is realistic and possible. Use a present form after if, even though the meaning refers to the future.','“If I finish early, I will call you.”','Do not normally put will directly after if: avoid “If I will finish early…”','Complete: If I have time this evening, …']],
    [/second conditional/, ['This pattern creates distance from present reality. The speaker imagines a different situation and its possible result.','“If I lived near the beach, I would swim every day.”','Use a past form in the if-clause, but understand that the meaning is present or future, not past.','Imagine you had one extra free day every week. What would you do?']],
    [/third conditional/, ['Both the condition and result belong to an unreal past. The speaker looks back and imagines how events could have been different.','“If I had left earlier, I would have caught the train.”','Keep both halves in the past pattern. Avoid mixing “if I had…” with “I would catch…”.','Change one small past decision and describe the imagined result.']],
    [/although|despite/, ['Both introduce contrast, but they take different grammar. Although is followed by a subject and verb. Despite is followed by a noun, pronoun, or -ing form.','“Although it rained, we went out.” / “Despite the rain, we went out.”','Avoid “despite it rained.” Use “despite the rain” or “although it rained.”','Join these ideas both ways: I was tired. I finished the work.']],
    [/had better/, ['Had better is stronger than ordinary advice. It suggests that an unpleasant result may follow if the person ignores the advice.','“You had better charge your phone before the trip.”','Use the base verb after better. Avoid “had better to leave.”','Give strong advice to someone who may miss a flight.']],
    [/wish/, ['Wish + past form describes a present reality you want to change. The past form creates distance from what is true now.','“I wish I knew the answer” means I do not know it now.','Do not use a present form after wish for this meaning: avoid “I wish I know.”','Write one wish about time, ability, or your daily routine.']],
    [/must have|might have/, ['Modal + have + past participle lets you make a deduction about a past event. Must have shows strong confidence, while might have shows only possibility.','“She must have forgotten.” / “She might have taken another bus.”','Do not use must have for a confirmed fact. It expresses a conclusion based on evidence.','Your friend is late and not answering. Make one strong and one uncertain guess.']],
    [/indirect question/, ['An indirect question begins politely, then uses normal statement order. The question word remains, but the subject comes before the verb.','Direct: “Where is he?” Indirect: “Do you know where he is?”','Avoid a second question order inside the sentence: not “Do you know where is he?”','Turn “When does the shop close?” into an indirect question.']],
    [/present perfect/, ['This tense connects a past action or experience to the present. It is common for updates, recent results, and experiences without a finished past time.','“I have finished the report” focuses on the result now.','Do not combine it with a finished time such as yesterday. Say “I finished it yesterday.”','Give one update about something you have completed today.']],
    [/passive/, ['The passive moves attention from the person doing the action to the action or result. Use it when the actor is unknown, obvious, or less important.','Active: “They repaired the road.” Passive: “The road was repaired.”','The main verb must be a past participle, and the form of be must match the tense.','Turn “Someone stole my bicycle” into a passive sentence.']],
    [/reported speech/, ['Reported speech retells another person’s words without quoting them exactly. Pronouns, time expressions, and tense may shift to fit the new viewpoint.','Direct: “I am busy.” Reported: “She said she was busy.”','Do not keep pronouns unchanged automatically. Ask who “I,” “you,” and “we” refer to in the new sentence.','Report something a friend told you yesterday.']],
    [/question/, ['English questions normally need an auxiliary before the subject. With be, move be before the subject. With most other verbs, use do, does, or did.','“Where does she work?” / “Why were they late?”','Do not combine an auxiliary with a second past form: say “Did you go?” not “Did you went?”','Write one present question and one past question about today’s topic.']],
    [/article/, ['A or an introduces one nonspecific countable thing. The points to something already known, previously mentioned, or uniquely understood.','“I saw a dog. The dog was waiting outside.”','Do not use a or an with plural nouns or most uncountable nouns.','Describe an object near you, then mention the same object again.']],
    [/countable|uncountable/, ['Countable nouns can use numbers and plural forms. Uncountable nouns are treated as a mass or amount and normally do not take a plural ending.','“three chairs” but “some furniture”; “many tasks” but “much work.”','Avoid forms such as “informations” or “advices.” Say “pieces of information” or “some advice.”','Choose the correct word: many/much time, many/much messages.']],
    [/comparative|superlative|the more/, ['Comparison forms show relative difference. Use than when comparing two items and the when identifying the highest or lowest in a group.','“This route is shorter than that one.” / “It is the shortest route.”','Avoid double comparison forms such as “more easier” or “most fastest.”','Compare two places, products, or habits using one adjective.']],
    [/gerund|verb-ing/, ['An -ing form can name an activity or follow a preposition. In these positions, it behaves more like a noun than a main verb.','“Reading helps me relax.” / “I learn by reading.”','After a preposition, avoid the infinitive: say “before leaving,” not “before to leave.”','Start a sentence with an activity you enjoy.']],
    [/too and enough/, ['Too shows an unwanted excess. Enough shows that the amount or degree is sufficient for a purpose.','“It is too dark to read.” / “It is bright enough to read.”','Word order changes: too comes before an adjective, while enough usually comes after it.','Describe something that is too expensive and something cheap enough to buy.']],
    [/so and such/, ['So strengthens an adjective or adverb. Such strengthens a noun phrase, often with a or an before a singular countable noun.','“The film was so funny.” / “It was such a funny film.”','Avoid “such funny” without a noun. Use “so funny” or “such a funny story.”','Describe today’s weather once with so and once with such.']],
    [/frequency/, ['Frequency adverbs show how often something happens. They usually come before a main verb but after the verb be.','“I usually walk.” / “I am usually early.”','Do not use the same position with every verb. Compare “often goes” with “is often.”','Describe three habits using always, usually, and rarely.']],
    [/modal|can|might|must|should/, ['A modal adds meaning such as ability, possibility, advice, or necessity. It is followed by the base form of the verb for every subject.','“She can drive.” / “They might arrive late.”','Do not add s, to, or a past ending after a modal: not “can drives” or “must to go.”','Make one sentence about ability and one about possibility.']],
    [/softening|polite|wondering/, ['Softening language gives the listener room to respond and makes requests or disagreement less abrupt. English often uses past-looking forms or small phrases for this social distance.','“Could we try another option?” sounds softer than “Use another option.”','Being polite does not require being vague. Keep the request clear while softening the tone.','Rewrite a direct command as a polite request.']],
    [/conversation going/, ['Good conversation is built from listening and short follow-up questions. Refer to a detail the person just shared instead of immediately changing the topic.','“I started a new job.” — “Really? What is the team like?”','Avoid turning every reply into your own story. First show interest in what the other person said.','Write two follow-up questions for: “I went on a trip last weekend.”']]
  ];
  const match = rules.find(([pattern]) => pattern.test(title));
  const [explanation, extraExample, mistake, practice] = match ? match[1] : [
    'This pattern helps you express the idea with less ambiguity. Notice the form, but also pay attention to the situation and the speaker’s intention.',
    `Model: “${item.example}”`,
    'Do not memorize the formula alone. A grammatically correct sentence can still sound unnatural if the context does not fit.',
    'Change the subject, time, or key noun in the model sentence and make one example about your own life.'
  ];
  return { explanation, extraExample, mistake, practice };
}

const NATURAL_EXAMPLE_OVERRIDES = {
  '1-impulsive': ['Buying that expensive phone was an impulsive decision.','He made an impulsive choice and regretted it later.'],
  '1-reckless': ['Driving that fast in the rain was reckless.','It was reckless to drive without wearing a seat belt.'],
  '1-sustain': ['The team cannot sustain this pace forever.','Regular support can sustain the project through difficult months.'],
  '1-picture': ['Picture yourself living in a quiet house by the sea.','I can picture how the room will look after the renovation.'],
  '1-disrupt': ['The storm disrupted train services.','A sudden power cut could disrupt the meeting.'],
  '1-persistent': ['Her persistent effort finally paid off.','She was persistent and asked again the next day.'],
  '1-built-in': ['The phone has a built-in camera.','This safety feature is built-in, so you do not need to install it.'],
  '1-articulate': ['She is articulate when explaining difficult ideas.','He gave an articulate answer that everyone understood.'],
  '1-infer': ['From his tone, I inferred that he was upset.','We can infer from the empty seats that some guests have left.'],
  '1-ease': ['A short walk can ease the pain in my back.','The new schedule should ease some pressure on the team.'],
  '5-oblivious': ['He was oblivious to the fact that everyone was waiting for him.','She walked past me, completely oblivious to my wave.'],
  '5-petty': ["Do not be petty just because she did not invite you.",'They had a petty argument over who should wash the dishes.'],
  '5-naive': ['I was naive enough to believe everything he told me.','It was naive to think the journey would have no problems.'],
  '5-intimidating': ['She seemed intimidating at first, but she is actually friendly.','Speaking in front of a large crowd can feel intimidating.'],
  '5-sincere': ['His apology sounded sincere.','She gave me a sincere thank-you after the event.'],
  '5-baffled': ['I am baffled by his decision.','The strange instructions left everyone baffled.'],
  '5-tempted': ['I am tempted to order another pizza.','She was tempted to check her phone during the meeting.'],
  '5-vivid': ['I still have a vivid memory of my first day at school.','The author gives a vivid description of life in the village.'],
  '5-sarcastic': ['He said, “Oh, great! Another two-hour meeting,” in a sarcastic voice.','Her sarcastic reply made everyone laugh.'],
  '5-reassure': ['She reassured me that everything was okay.','The doctor tried to reassure him before the test.']
};

function courseExamples(item, day, index) {
  const original = item.example.replace(/^[“\"]|[”\"]$/g, '');
  const word = item.word.toLowerCase();
  const meaning = item.meaning.toLowerCase();
  const dayNumber = DAYS.indexOf(day) + 1;
  const override = NATURAL_EXAMPLE_OVERRIDES[`${dayNumber}-${word}`];
  if (override) return override;
  const adjectiveMeaning = /^(able|acting|caring|saying|continuing|existing|very|worried|unpredictable|real|not |harmful|difficult|ordinary|confident|noticeable|lacking|making|honest|completely|feeling|clear|calm|focused|unwilling|open|careful|related|likely|ready|kind|pleasant|brave|patient|polite|fair|extremely|full of|having)/;
  const nounMeaning = /^(a |an |the |something |someone |money |information |courage |strength |progress |ability |quality |process |state |act |power |feeling |belief |idea |way |period |place |person |group |system |set |amount |result |part |range |lack |desire |permission |support |treatment |movement |connection |knowledge |skill )/;
  const nounEnding = /(tion|sion|ment|ness|ity|ance|ence|ship|hood|ism|age|ery|ure)$/;
  const verbMeaning = /^(to |make |keep |imagine |interrupt |reach |communicate |reduce |argue |discourage |examine |show |give |take |find |help |bring |change |use |work |move |walk |go |rise |fall |wait |relax |repeat |improve |support |control |describe |ask |tell |put |choose |decide |learn |create |prevent |protect |hold |join |remove |add |send |receive |become )/;
  let kind = verbMeaning.test(meaning) ? 'verb' : (adjectiveMeaning.test(meaning) ? 'adjective' : (nounMeaning.test(meaning) || nounEnding.test(word) ? 'noun' : 'verb'));

  let generated;
  if (kind === 'adjective') {
    const personFocused = /(feeling|worried|kind|honest|confident|able|unwilling|calm|brave|patient|polite|unaware|confused|desire|caring|lacking|saying)/.test(meaning);
    const subject = personFocused ? 'She' : 'The situation';
    const object = personFocused ? 'her' : 'the result';
    generated = [
      `${subject} seemed ${word} at first.`,
      `Everyone described ${object} as ${word}.`
    ];
  } else if (kind === 'noun') {
    generated = [
      `The ${word} made a real difference that day.`,
      `We discussed the ${word} before making a decision.`
    ];
  } else {
    const intransitive = /^(continue|move|walk|go|rise|fall|happen|become|wait|relax|sleep|travel|work together|keep trying)/.test(meaning);
    const object = intransitive ? '' : (/(someone|people|person)/.test(meaning) ? ' them' : ' it');
    generated = [
      `They tried to ${word}${object} when the problem appeared.`,
      `It was important to ${word}${object} before moving forward.`
    ];
  }
  if (!/^Use the (word|phrase)/i.test(original)) return [original, generated[index % generated.length]];
  return generated;
}

function categoryExamples(category, word) {
  const name = category.name;
  const nature = ['Flowers','Trees and plants'];
  const objects = ['Kitchen utensils','Household items','Furniture','Clothes and accessories','Tools and equipment','School supplies','Office items','Sports equipment','Technology and electronics','Bathroom items','Cleaning supplies','Travel essentials'];
  const creatures = ['Animals','Birds','Insects'];
  const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
  const counted = word.endsWith('s') ? `some ${word}` : `${article} ${word}`;
  if (['Fruits','Vegetables'].includes(name)) return [`We bought ${counted} at the market.`, `We prepared the ${word} before serving the food.`];
  if (['Food and drinks','Spices and ingredients'].includes(name)) return [`We bought some ${word} for the kitchen.`, `We used ${word} while preparing the meal.`];
  if (nature.includes(name)) return [`We saw ${word} growing in the garden.`, `The guide showed us ${word} during our walk.`];
  if (objects.includes(name)) return [`This is where we keep ${word}.`, `Please remember to bring ${word} when needed.`];
  if (creatures.includes(name)) return [`We saw a ${word} near the field.`, `The guide told us an interesting fact about the ${word}.`];
  if (name === 'Body parts') return [`The doctor examined my ${word}.`, `I moved my ${word} carefully after the exercise.`];
  if (name === 'Weather') return [`The forecast mentioned ${word} today.`, `We talked about ${word} before leaving home.`];
  if (name === 'Colors and shapes') return [`I chose ${word} for the design.`, `The teacher asked us to identify ${word}.`];
  if (name === 'Vehicles') return [`We traveled by ${word} yesterday.`, `The ${word} arrived earlier than expected.`];
  if (name === 'Jobs and professions') return [`A ${word} helped us today.`, `I spoke to the ${word} this morning.`];
  if (name === 'Public places') return [`We stopped at the ${word} on our way home.`, `The ${word} opens early in the morning.`];
  if (name === 'Health and medicine') return [`We discussed ${word} during the appointment.`, `The nurse explained the meaning of ${word}.`];
  if (name === 'Celebrations') return [`We talked about ${word} while planning the celebration.`, `${word} was an important part of the event.`];
  if (name === 'Actions and movements') return [`Watch how I ${word}.`, `It is important to ${word} safely.`];
  return [`We talked about ${word} today.`, `Can you describe ${word} in your own words?`];
}

function renderHome() {
  app.innerHTML = '';
  app.append(document.querySelector('#homeTemplate').content.cloneNode(true));
  const grid = document.querySelector('#dayGrid');
  DAYS.forEach((day, i) => {
    const button = document.createElement('button');
    button.className = `day-card ${completed.has(i + 1) ? 'done' : ''}`;
    button.innerHTML = `<span class="day-num">${String(i + 1).padStart(2,'0')}</span><h3>${escapeHtml(day.theme)}</h3><p>${escapeHtml(day.note)}</p>`;
    button.addEventListener('click', () => goToDay(i + 1));
    grid.append(button);
  });
  document.querySelector('#progressNumber').textContent = completed.size;
  document.querySelector('#progressBar').style.width = `${completed.size / DAYS.length * 100}%`;
  document.querySelector('#startBtn').addEventListener('click', () => {
    const next = DAYS.findIndex((_, i) => !completed.has(i + 1));
    goToDay(next === -1 ? 1 : next + 1);
  });
  document.querySelector('#browseLibrary').addEventListener('click', () => location.hash = 'categories');
  document.querySelector('#openLibrary').addEventListener('click', () => location.hash = 'categories');
  document.title = 'Wordcraft — 100 Days to Better English';
  window.scrollTo({top: 0, behavior: 'instant'});
}

function renderLibrary() {
  const cards = CATEGORIES.map(category => `
    <button class="category-card" data-category="${escapeHtml(category.slug)}">
      <span class="category-icon" aria-hidden="true">${category.icon}</span>
      <span class="category-number">20 WORDS</span>
      <h3>${escapeHtml(category.name)}</h3>
      <p>${escapeHtml(category.note)}</p>
      <span class="category-arrow">→</span>
    </button>`).join('');
  app.innerHTML = `
    <section class="library-page">
      <button class="back-link" id="backHome">← Home</button>
      <div class="library-hero">
        <span class="eyebrow">CATEGORY LIBRARY</span>
        <h1>Words for the world around you.</h1>
        <p>Choose a category and learn 20 practical words with simple meanings. No grammar lessons—just quick, useful vocabulary.</p>
        <div class="library-stats"><strong>30</strong><span>categories</span><strong>600</strong><span>words</span></div>
      </div>
      <div class="category-grid">${cards}</div>
    </section>`;
  document.querySelector('#backHome').addEventListener('click', () => location.hash = 'home');
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    location.hash = `category-${button.dataset.category}`;
  }));
  document.title = 'Category Library — Wordcraft';
  window.scrollTo({top: 0, behavior: 'instant'});
}

function renderCategory(slug) {
  const category = CATEGORIES.find(item => item.slug === slug);
  if (!category) return renderLibrary();
  const words = category.words.map((item, index) => {
    const examples = categoryExamples(category, item.word);
    return `
      <article class="library-word">
        <span>${String(index + 1).padStart(2,'0')}</span>
        <div>
          <h3>${escapeHtml(item.word)}</h3><p>${escapeHtml(item.meaning)}</p>
          <div class="category-examples"><p><b>1</b>${escapeHtml(examples[0])}</p><p><b>2</b>${escapeHtml(examples[1])}</p></div>
        </div>
      </article>`;
  }).join('');
  const position = CATEGORIES.indexOf(category);
  app.innerHTML = `
    <section class="category-page">
      <button class="back-link" id="backLibrary">← All categories</button>
      <div class="category-hero">
        <span class="category-hero-icon" aria-hidden="true">${category.icon}</span>
        <div><span class="eyebrow">CATEGORY ${String(position + 1).padStart(2,'0')} • 20 WORDS</span><h1>${escapeHtml(category.name)}</h1><p>${escapeHtml(category.note)}</p></div>
      </div>
      <div class="library-word-grid">${words}</div>
      <div class="category-footer">
        <button class="nav-btn" id="prevCategory" ${position === 0 ? 'disabled' : ''}>← Previous category</button>
        <button class="nav-btn" id="nextCategory" ${position === CATEGORIES.length - 1 ? 'disabled' : ''}>Next category →</button>
      </div>
    </section>`;
  document.querySelector('#backLibrary').addEventListener('click', () => location.hash = 'categories');
  document.querySelector('#prevCategory').addEventListener('click', () => position > 0 && (location.hash = `category-${CATEGORIES[position - 1].slug}`));
  document.querySelector('#nextCategory').addEventListener('click', () => position < CATEGORIES.length - 1 && (location.hash = `category-${CATEGORIES[position + 1].slug}`));
  document.title = `${category.name} — Wordcraft Library`;
  window.scrollTo({top: 0, behavior: 'instant'});
}

function goToDay(dayNumber) {
  location.hash = `day-${dayNumber}`;
}

function renderDay(dayNumber) {
  const day = DAYS[dayNumber - 1];
  if (!day) return renderHome();
  const words = day.words.map((item, index) => {
    const examples = courseExamples(item, day, index);
    return `
      <article class="word-card">
        <h3>${escapeHtml(item.word)}</h3>
        <div class="word-definition">
          <p>${escapeHtml(item.meaning)}</p>
          <div class="example-list">
            <blockquote><span>1</span>“${escapeHtml(examples[0])}”</blockquote>
            <blockquote><span>2</span>“${escapeHtml(examples[1])}”</blockquote>
          </div>
        </div>
      </article>`;
  }).join('');
  const lessons = day.lessons.map((item, i) => {
    const guide = buildLessonGuide(item);
    return `
      <article class="lesson-card ${i === 0 ? 'open' : ''}">
        <button class="lesson-toggle" aria-expanded="${i === 0}">
          <span class="lesson-index">0${i + 1}</span><h3>${escapeHtml(item.title)}</h3><span class="plus">+</span>
        </button>
        <div class="lesson-body"><div class="lesson-inner">
          <div class="lesson-explanation"><small>HOW IT WORKS</small><p>${escapeHtml(item.idea)}</p><p>${escapeHtml(guide.explanation)}</p></div>
          <div class="pattern-box"><small>REMEMBER THE PATTERN</small><code>${escapeHtml(item.pattern)}</code><em>“${escapeHtml(item.example)}”</em></div>
          <div class="lesson-depth">
            <div><small>ONE MORE EXAMPLE</small><p>${escapeHtml(guide.extraExample)}</p></div>
            <div><small>COMMON MISTAKE</small><p>${escapeHtml(guide.mistake)}</p></div>
            <div class="practice-card"><small>TRY IT YOURSELF</small><p>${escapeHtml(guide.practice)}</p></div>
          </div>
        </div></div>
      </article>`;
  }).join('');
  app.innerHTML = `
    <section class="day-page">
      <button class="back-link" id="backHome">← All one hundred days</button>
      <div class="day-hero">
        <span class="day-big-num ${dayNumber >= 100 ? 'triple' : ''}">${String(dayNumber).padStart(2,'0')}</span>
        <div><h1>${escapeHtml(day.theme)}</h1><p>${escapeHtml(day.note)}</p></div>
        <div class="lesson-count"><strong>10 WORDS</strong><strong>3 LESSONS</strong>≈ 15 MINUTES</div>
      </div>
      <div class="content-label"><h2>Today's vocabulary</h2><span>READ • SAY • USE</span></div>
      <div class="word-list">${words}</div>
      <div class="content-label"><h2>Three useful lessons</h2><span>TAP TO EXPAND</span></div>
      <div class="lesson-list">${lessons}</div>
      <div class="day-footer">
        <button class="nav-btn" id="prevDay" ${dayNumber === 1 ? 'disabled' : ''}>← Previous day</button>
        <button class="complete-btn ${completed.has(dayNumber) ? 'done' : ''}" id="completeDay">${completed.has(dayNumber) ? '✓ Day completed' : 'Mark day complete'}</button>
        <button class="nav-btn" id="nextDay" ${dayNumber === DAYS.length ? 'disabled' : ''}>Next day →</button>
      </div>
    </section>`;
  document.querySelector('#backHome').addEventListener('click', () => location.hash = 'home');
  document.querySelectorAll('.lesson-toggle').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.lesson-card');
    card.classList.toggle('open');
    button.setAttribute('aria-expanded', card.classList.contains('open'));
  }));
  document.querySelector('#prevDay').addEventListener('click', () => dayNumber > 1 && goToDay(dayNumber - 1));
  document.querySelector('#nextDay').addEventListener('click', () => dayNumber < DAYS.length && goToDay(dayNumber + 1));
  document.querySelector('#completeDay').addEventListener('click', (event) => {
    completed.has(dayNumber) ? completed.delete(dayNumber) : completed.add(dayNumber);
    saveProgress();
    event.currentTarget.classList.toggle('done', completed.has(dayNumber));
    event.currentTarget.textContent = completed.has(dayNumber) ? '✓ Day completed' : 'Mark day complete';
  });
  document.title = `Day ${dayNumber}: ${day.theme} — Wordcraft`;
  window.scrollTo({top: 0, behavior: 'instant'});
}

function route() {
  const match = location.hash.match(/^#day-(\d+)$/);
  const categoryMatch = location.hash.match(/^#category-(.+)$/);
  if (match) renderDay(Number(match[1]));
  else if (location.hash === '#categories') renderLibrary();
  else if (categoryMatch) renderCategory(categoryMatch[1]);
  else renderHome();
}

const dialog = document.querySelector('#searchDialog');
const input = document.querySelector('#searchInput');
const results = document.querySelector('#searchResults');

function searchWords(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) {
    results.innerHTML = '<p class="empty">Search all 1,600 course and category words by word or meaning.</p>';
    return;
  }
  const matches = [];
  DAYS.forEach((day, i) => day.words.forEach(item => {
    if (`${item.word} ${item.meaning}`.toLowerCase().includes(q)) matches.push({...item, day: i + 1, source: `DAY ${String(i + 1).padStart(2,'0')}`});
  }));
  CATEGORIES.forEach(category => category.words.forEach(item => {
    if (`${item.word} ${item.meaning}`.toLowerCase().includes(q)) matches.push({...item, slug: category.slug, source: category.name.toUpperCase()});
  }));
  results.innerHTML = matches.length ? matches.slice(0, 30).map(item => `
    <button class="search-result" ${item.day ? `data-day="${item.day}"` : `data-slug="${escapeHtml(item.slug)}"`}><span><strong>${escapeHtml(item.word)}</strong><br><small>${escapeHtml(item.meaning)}</small></span><small>${escapeHtml(item.source)} →</small></button>`).join('') : '<p class="empty">No matching word yet. Try a simpler meaning.</p>';
  results.querySelectorAll('[data-day], [data-slug]').forEach(button => button.addEventListener('click', () => {
    dialog.close();
    if (button.dataset.day) goToDay(Number(button.dataset.day));
    else location.hash = `category-${button.dataset.slug}`;
  }));
}

document.querySelector('#searchBtn').addEventListener('click', () => {
  dialog.showModal(); searchWords(input.value); setTimeout(() => input.focus(), 50);
});
document.querySelector('#libraryBtn').addEventListener('click', () => location.hash = 'categories');
document.querySelector('#closeSearch').addEventListener('click', () => dialog.close());
input.addEventListener('input', () => searchWords(input.value));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const savedTheme = localStorage.getItem('wordcraft-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
document.querySelector('#themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('wordcraft-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

window.addEventListener('hashchange', route);
route();
