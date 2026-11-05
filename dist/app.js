const app = document.querySelector('#app');
const completed = new Set(JSON.parse(localStorage.getItem('wordcraft-completed') || '[]'));

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const saveProgress = () => localStorage.setItem('wordcraft-completed', JSON.stringify([...completed]));

function navigateTo(params = {}, replace = false) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  history[replace ? 'replaceState' : 'pushState']({}, '', `${url.pathname}${url.search}`);
  route();
}

const goHome = () => navigateTo();
const goToLibrary = () => navigateTo({page: 'categories'});
const goToCategory = (slug) => navigateTo({category: slug});

function buildLessonGuide(item) {
  const title = item.title.toLowerCase();
  const rules = [
    [/context practice/, ['A word becomes useful when it is connected to a real person, place, action, or problem. A short scene gives your memory several clues instead of only one definition.','Instead of memorizing “calm,” say: “I stayed calm when the train was delayed.”','Do not force many new words into one unnatural sentence. Three well-used words are enough.','Write two connected sentences about a real situation and include three words from today.']],
    [/speaking drill/, ['Speaking creates a different kind of memory from silent reading. Recalling a meaning before checking it also shows which words need another review.','Choose one word, explain it simply, and then use it in a sentence about your own life.','Do not rush through the list. Clear pronunciation and a complete sentence matter more than speed.','Record a sixty-second voice note, listen once, and repeat any unclear sentence.']],
    [/present simple for routines/, ['Use the present simple for habits, repeated actions, and facts. With he, she, or it, normally add s to the verb.','“I walk to work.” / “She walks to work.”','Do not use am/is/are before an ordinary present-simple verb: say “I work,” not “I am work.”','Write one daily habit and one fact about yourself.']],
    [/present continuous for now/, ['Use this form for an action happening now or around the present time. The action is temporary or still in progress.','“I am reading a new book this week.”','Do not forget the form of be. Say “She is working,” not “She working.”','Describe one thing you are doing now and one temporary activity this week.']],
    [/past simple for finished events/, ['Use the past simple when an action is finished and belongs to a completed past time such as yesterday or last week.','“We visited the museum yesterday.”','Do not use a present-perfect form with a finished time: say “I saw him yesterday,” not “I have seen him yesterday.”','Write one thing you completed yesterday.']],
    [/future with.*going to/, ['Use going to for a plan you already decided or a prediction based on evidence you can see now.','Plan: “I am going to study tonight.” Evidence: “Those clouds are dark. It is going to rain.”','Do not forget the form of be before going to.','Write one plan for tomorrow and one prediction based on visible evidence.']],
    [/imperatives/, ['Use the base verb at the beginning of a sentence to give an instruction, direction, or command. The subject you is understood and is not normally written.','“Turn left at the bank.” / “Please sit down.”','A bare imperative can sound strong. Add please or use a question when the situation needs politeness.','Give one simple instruction for making tea.']],
    [/relative clauses/, ['A relative clause adds information about a noun. Use who for people and which or that for things.','“A mentor is someone who gives guidance.”','Do not repeat the subject inside the relative clause: say “the person who called,” not “the person who he called.”','Describe a person who helped you or an object that you use daily.']],
    [/infinitives of purpose/, ['Use to + base verb to explain the purpose of an action—the reason someone does it.','“I went outside to make a phone call.”','Do not use for + base verb for this meaning. Say “to buy food,” not “for buy food.”','Complete: I opened my laptop to…']],
    [/either and neither/, ['Either means one of two choices. Neither means not the first choice and not the second choice. With a singular noun, use a singular verb.','“Either route is fine.” / “Neither answer is correct.”','Do not use a negative verb after neither: say “Neither option works,” not “Neither option does not work.”','Choose either or neither: ___ restaurant is open, so we must cook.']],
    [/question tags/, ['A question tag is a short question added to a statement. Use it to check information or invite agreement. A positive statement normally takes a negative tag, and a negative statement takes a positive tag.','“You are ready, aren’t you?” / “She did not call, did she?”','Match the auxiliary and tense in the statement.','Add a tag: “They finished the work, ___?”']],
    [/would rather/, ['Use would rather to state a preference. It is followed directly by a base verb.','“I would rather stay home tonight.”','Do not add to after rather: say “would rather wait,” not “would rather to wait.”','Write one choice you would rather make this weekend.']],
    [/not only.*but also/, ['Use this pair to connect two important or surprising facts. Keep the grammar after both parts parallel.','“She not only planned the event but also hosted it.”','Do not mix different structures after the two parts.','Join these facts: He speaks clearly. He listens carefully.']],
    [/keeping a conversation going/, ['Show that you listened, then ask about one detail the other person mentioned. A specific follow-up question feels more natural than changing the subject.','“I started a new job.” — “That is exciting. What is your team like?”','Do not turn every reply into your own story before showing interest.','Write two follow-up questions for: “I visited Jaipur last weekend.”']],
    [/modal.*can/, ['Use can + base verb for present ability, permission, or a general possibility. The form stays the same with every subject.','Ability: “She can drive.” Permission: “You can leave early.”','Do not add s or to after can: not “can drives” or “can to drive.”','Write one sentence about an ability you have.']],
    [/modal.*might/, ['Use might + base verb when something is possible but not certain.','“I might visit my cousin this weekend.”','Might shows uncertainty, so do not use it when you know the event is definite.','Write one thing that might happen tomorrow.']],
    [/should for advice/, ['Use should + base verb to recommend an action that you think is helpful or sensible.','“You should back up your files.”','Should is advice, not a strict command. Use must when a rule or strong necessity is intended.','Give one piece of advice to someone learning English.']],
    [/must for necessity/, ['Use must + base verb for a strong necessity, rule, or requirement.','“You must wear a seat belt.”','Do not add to after must. Also remember that must not means prohibited, not unnecessary.','Write one important safety rule with must.']],
    [/would.*hypothetical|reported.*would/, ['When a future promise is reported from a past viewpoint, “will” normally moves back to “would.” The event may still be real or planned—it is not automatically imaginary.','Direct: “I will help.” Reported: “She said she would help.”','Do not add an if-clause unless you truly mean a condition. “He said he would call” is reported speech, not a conditional.','Report this sentence: Maya said, “I will finish it tonight.”']],
    [/could.*past ability.*possibility/, ['This lesson teaches only two uses. For past ability, could means “was able to.” For possibility, could means “maybe this will happen.” Time words and context show which meaning is intended.','Past ability: “At ten, I could cook a simple meal.” Possibility: “The shop could be closed today.”','Do not use could for one successful action in the past. Say “I managed to open the door,” not “I could open the door,” when you mean one specific success.','Write one sentence about an ability you had as a child and one sentence about something that may happen tomorrow.']],
    [/i was wondering/, ['Use I was wondering if to make a present request sound considerate and less demanding. The past-looking form creates social distance; it does not mean the request belongs to the past.','“I was wondering if you could send the notes.”','After if, use a normal subject before the modal: “if you could,” not “if could you.”','Soften this request: “Can you move the meeting?”']],
    [/mind/, ['The question asks whether the action would bother someone. That is why “No, not at all” means you are happy to do it. After mind, use an -ing form.','“Would you mind waiting?” — “No, not at all.”','Avoid “mind to wait.” The natural pattern is mind + waiting, helping, closing, or another -ing form.','Politely ask someone to lower the music using “Would you mind…?”']],
    [/have something done|causative/, ['This structure shows that you arranged a service rather than performed the action yourself. The tense appears on have, while the service verb stays as a past participle.','“I had my phone repaired” means another person repaired it for me.','“I repaired my phone” means you personally did the repair. Do not use the two sentences as if they mean the same thing.','Describe one service you arranged recently: hair, delivery, repair, or cleaning.']],
    [/used to.*be used to/, ['Used to looks back at a habit or situation that is no longer true. Be used to describes something that feels normal or familiar now. The two forms look similar, but their meanings and grammar are different.','“I used to drive to work.” / “I am used to taking the train now.”','After be used to, use a noun or an -ing form. Say “I am used to the noise” or “I am used to working late.”','Write one old habit with used to and one familiar situation with be used to.']],
    [/^used to$/, ['Use used to + base verb for a repeated past habit or situation that is no longer true now.','“I used to take the bus, but now I walk.”','Do not use used to for something that still happens regularly now.','Write one habit you had as a child but do not have now.']],
    [/^be used to$/, ['Use be used to + noun or -ing when something feels normal or familiar because you have experienced it often.','“I am used to the traffic.” / “I am used to waking early.”','Do not follow be used to with a base verb.','Write one situation that feels normal to you now.']],
    [/a bit.*softer/, ['A bit means “a little.” Before a negative adjective, it reduces the force of the criticism and makes the sentence sound less direct.','Direct: “The room is small.” Softer: “The room is a bit small.”','Do not use a bit when you need to be clear about serious danger or an urgent problem.','Soften this sentence: “Your explanation is confusing.”']],
    [/assertive.*not aggressive/, ['Assertive language states your view clearly while respecting the other person. Focus on the issue, explain your reason, and avoid attacking the person.','“I cannot agree to that deadline because we need two more days.”','Avoid words such as always and never when they turn one problem into a personal attack.','Disagree with a plan using “I think… because…”']],
    [/adjective.*preposition/, ['Some adjectives naturally pair with a particular preposition. Learn the adjective and preposition together as one useful phrase.','“nervous about the interview,” “proud of my work,” “pleased with the result.”','Do not choose the preposition only by translating from another language.','Complete with a preposition: I am proud ___ my progress.']],
    [/make vs make someone feel/, ['Make + object + adjective describes the effect that a situation has on a person. Make someone feel + adjective expresses the same idea but emphasizes the person’s feeling.','“The delay made me anxious.” / “The delay made me feel anxious.”','After make someone, use the base form feel, not feels or to feel.','Describe how good news affected you using both patterns.']],
    [/sounding sincere/, ['A sincere apology has three clear parts: name what you did, accept responsibility, and say how you will repair or avoid the problem.','“I am sorry for interrupting. I should have listened. I will let you finish next time.”','Avoid adding an excuse immediately after the apology with but.','Write a short apology for arriving late.']],
    [/polite disagreement/, ['Begin by showing that you understood the other view, then state your concern and give a reason. This keeps the disagreement clear without making it personal.','“I see your point, but I am worried about the cost.”','Do not agree vaguely if you actually disagree. Be respectful and clear.','Disagree politely with a plan to hold a meeting at 7 a.m.']],
    [/do you mean/, ['Use this question to check your understanding before responding. Repeat the idea in your own words so the other person can confirm or correct it.','“Do you mean we should start again tomorrow?”','Do not pretend you understand when the important point is unclear.','Check this idea: “The deadline has moved.”']],
    [/actually.*correction/, ['Use actually to gently correct a mistaken belief or add a surprising fact. Put the correction directly after it.','“Actually, the meeting starts at three, not two.”','Using actually too often can sound as if you are constantly correcting people.','Correct this politely: “The shop closes at six.”']],
    [/rather than/, ['Use rather than to show the option you prefer or the action you choose instead. Keep the grammar on both sides parallel.','“Let us call rather than send another email.”','Do not mix forms unnecessarily: prefer “calling rather than emailing” or “call rather than email.”','Complete: I would walk rather than…']],
    [/each other vs one another/, ['Both phrases describe a shared action between people. Each other is the most common choice in everyday English, for two people or a larger group.','“The teammates help each other.”','Do not use each other when the action goes only one way.','Describe one helpful action that friends do for each other.']],
    [/setting a boundary/, ['A clear boundary names the behavior, explains its effect, and states what you need next. Calm, specific language is easier to understand than blame.','“When plans change at the last minute, I feel stressed. Please tell me earlier.”','A boundary states what you need; it does not insult or threaten the other person.','Write a boundary about repeated late messages.']],
    [/by vs until/, ['By gives the latest time for one completed action. Until shows that an action or situation continues up to an ending time.','“Send it by Friday.” / “I will be here until Friday.”','Do not use until for a deadline when the action happens once.','Choose by or until: Please wait ___ five. Send the form ___ five.']],
    [/constructive feedback/, ['Useful feedback names what works, describes one specific issue, and suggests a practical next step. This makes improvement possible without attacking the person.','“The opening is clear. The ending feels rushed. Add one final example.”','Avoid vague comments such as “This is bad” because they do not show what to change.','Give feedback on a presentation using strength, issue, and next step.']],
    [/been to vs gone to/, ['Has been to means someone visited a place and returned. Has gone to means the person is still there or travelling there.','“Maya has been to Goa.” / “Raj has gone to Goa; he returns Monday.”','Do not say someone has gone to a place if that person is already back.','Choose been or gone: Priya is in Delhi now. She has ___ to Delhi.']],
    [/natural recommendations/, ['Worth + -ing says an activity deserves the time or effort. You might want to + verb gives a softer, friendly suggestion.','“The museum is worth visiting.” / “You might want to book online.”','Do not say “worth to visit.” Use the -ing form.','Recommend one place and one useful action for a visitor.']],
    [/according to/, ['Use according to to identify the source of information. It shows whose report or opinion you are repeating.','“According to the weather report, it will rain tonight.”','Do not use according to me for an ordinary personal opinion. Say “I think” or “in my opinion.”','Report one fact from a teacher, article, or forecast.']],
    [/fewer vs less/, ['Use fewer with things you can count separately. Use less with amounts or uncountable nouns.','“fewer emails” / “less time.”','Avoid less with a normal plural countable noun: say “fewer mistakes,” not “less mistakes.”','Choose fewer or less: ___ traffic, ___ cars, ___ water.']],
    [/stop doing vs stop to do/, ['Stop doing means end an activity. Stop to do means pause one activity because you want to do a different one.','“I stopped working.” / “I stopped to answer the phone.”','The -ing form and the to form describe different events, so do not exchange them.','Explain the difference: “He stopped talking” and “He stopped to talk.”']],
    [/little by little/, ['Use this phrase when change happens gradually through many small steps. It often comes at the beginning or end of a sentence.','“Little by little, I became more confident.”','Do not use it for a sudden change that happens all at once.','Describe one skill that improved little by little.']],
    [/it takes/, ['Use it takes to say how much time, effort, or courage an action requires. The person can be added after takes.','“It takes me twenty minutes to walk home.”','Do not say “I take twenty minutes to walk” when you are describing required duration in this pattern.','Write how long it takes you to get ready in the morning.']],
    [/if i were you/, ['Use this fixed expression to give advice by imagining yourself in another person’s situation. It is followed by would + base verb.','“If I were you, I would speak to the manager.”','In careful English, use were rather than was in this expression.','Advise a friend who is nervous about an interview.']],
    [/de-escalating language/, ['Lower the tension by describing one specific problem, allowing for uncertainty, and returning to a shared goal. This invites discussion instead of a fight.','“I may have misunderstood, but I thought we agreed on Friday. Can we check?”','Avoid absolute blame such as “You never listen.”','Rewrite calmly: “You completely ignored my message.”']],
    [/feel vs feel like/, ['Feel + adjective describes your condition or emotion. Feel like + noun or -ing describes what you want or what something seems similar to.','“I feel tired.” / “I feel like resting.”','Do not say “I feel to rest.” Use feel like + -ing.','Write one emotion with feel and one desired action with feel like.']],
    [/building on an idea/, ['Say yes, and to accept the useful part of an idea before adding your own suggestion. It helps a discussion move forward collaboratively.','“Yes, and we could test it with a small group first.”','Do not say yes while immediately dismissing the idea with but.','Add one helpful idea to: “We could make a practice quiz.”']],
    [/be about to/, ['Use be about to for something expected to happen very soon—usually within moments, not next month.','“The film is about to start.”','Do not use it with a distant future time such as next year.','Describe one thing that is about to happen near you.']],
    [/likely and unlikely/, ['Use be likely to when an event probably will happen, and be unlikely to when it probably will not.','“The train is likely to be late.” / “It is unlikely to snow today.”','Do not say “will likely to.” Use “is likely to” or “will likely be.”','Make one likely and one unlikely prediction for tomorrow.']],
    [/future in progress/, ['Use will be + -ing for an action that will already be in progress at a particular future time.','“At nine tomorrow, I will be travelling to work.”','Use a clear future time so the listener knows when the action will be in progress.','Describe what you will be doing at this time tomorrow.']],
    [/emphasis with.*do/, ['Add do, does, or did before a base verb when you want to strongly confirm something or correct a mistaken impression.','“I do understand your concern.” / “She did send the email.”','Keep the main verb in its base form: say “did send,” not “did sent.”','Strongly confirm that you completed an important task.']],
    [/emphatic.*do/, ['Add do, does, or did before a base verb to strongly confirm a statement, especially when someone doubts or misunderstands it.','“I do want to help.” / “He did call yesterday.”','After does or did, keep the main verb in its base form.','Correct this doubt with emphasis: “You did not read the message.”']],
    [/power of pausing/, ['A short silent pause gives you time to think and helps the listener follow your ideas. Pause between complete thoughts, not in the middle of a phrase.','“I agree with the goal… but the timing worries me.”','Do not fill every pause with um or rush to avoid silence.','Read a three-sentence answer aloud and pause once after each main idea.']],
    [/keep the habit alive/, ['Memory becomes stronger when you recall a word several times across different days. Try to remember it before looking at the answer.','Review today, tomorrow, three days later, and one week later.','Rereading alone can feel familiar without proving that you can recall the word.','Choose five words and schedule their next three reviews.']],
    [/seem vs look/, ['Seem is based on your overall impression, which may come from facts, behavior, or a situation. Look is normally based on what you can see.','“The job seems difficult.” / “You look tired.”','Do not use look for every impression. If you are judging an idea or plan rather than appearance, seem is usually safer.','Describe one person with look and one plan with seem.']],
    [/however vs therefore/, ['However connects two ideas that contrast. Therefore introduces a result caused by the first idea. Each linker answers a different question: “What is the contrast?” or “What happened as a result?”','Contrast: “It was expensive; however, I bought it.” Result: “It was unsafe; therefore, we left.”','Do not use therefore when the second idea is merely different; there must be a cause-and-result connection.','Join one pair of contrasting ideas with however and one cause-result pair with therefore.']],
    [/let vs allow/, ['Let and allow can both give permission. Let is more common in conversation and takes a base verb. Allow is a little more formal and takes to + verb.','“My manager let me leave early.” / “My manager allowed me to leave early.”','Do not say “let me to leave” or “allowed me leave.”','Rewrite “They gave us permission to enter” once with let and once with allow.']],
    [/suggests that.*careful claims/, ['Use suggests that when evidence points in one direction but is not strong enough to prove the conclusion. It makes your claim accurate and careful.','“The empty desks suggest that several employees are absent.”','Do not use suggests that for a fact you directly know. Say the fact plainly when there is no uncertainty.','Make a careful conclusion from this clue: the roads are wet.']],
    [/worth vs worthwhile/, ['Worth is followed by the thing that has value: a noun or an -ing action. Worthwhile is an adjective that describes an activity, experience, or effort as valuable enough to do.','“The museum is worth visiting.” / “The long journey was worthwhile.”','Do not say “worth to visit.” Use “worth visiting.”','Describe one book with worth and one experience with worthwhile.']],
    [/cost vs spend/, ['With cost, the thing or service is the subject. With spend, the person is the subject. Spend also needs the word on before the thing you bought.','“The repair cost me ₹2,000.” / “I spent ₹2,000 on the repair.”','Do not say “I cost ₹2,000 on the repair.” A person spends; a thing costs.','Describe your last purchase once with cost and once with spend.']],
    [/might want to.*gentle advice/, ['Might want to presents advice as an option for the listener to consider. It sounds gentler than a command, while the recommended action remains clear.','Command: “Check the address.” Gentle advice: “You might want to check the address.”','Do not make urgent safety instructions too soft. In an emergency, use a clear command.','Turn “Call the hotel first” into gentle advice.']],
    [/needn.t have|didn.t need/, ['Needn’t have tells us the action happened but was unnecessary. Didn’t need to only tells us there was no necessity—the context may reveal whether it happened.','“You needn’t have waited” means you did wait.','Do not use needn’t have when the person definitely did not perform the action.','Imagine a friend bought unnecessary food. Respond naturally.']],
    [/so do i|neither do i/, ['The auxiliary in the reply must match the first statement: am, can, have, did, or do. Use so after a positive statement and neither after a negative one.','“I am tired.” — “So am I.” / “I cannot drive.” — “Neither can I.”','Avoid “So I do” when you mean “me too.” That word order usually has a different emphatic meaning.','Respond to: “I watched that movie” and “I do not eat meat.”']],
    [/mustn.t|don.t have to/, ['These forms have opposite practical effects. Don’t have to removes an obligation, while mustn’t creates a prohibition.','“You don’t have to come” means it is optional. “You mustn’t enter” means do not enter.','Do not use mustn’t when you only mean something is unnecessary. It can sound like a strict ban.','Write one optional action and one prohibited action.']],
    [/should.*probability/, ['Should can express an expectation based on normal conditions. In that use, the speaker believes something is likely, but does not promise it.','“The parcel should arrive today” means that is the expected result.','Do not read every should as advice. Ask whether the sentence recommends an action or predicts a likely result.','Use should to predict when a friend, train, or delivery will arrive.']],
    [/first vs second conditional/, ['The first conditional describes a realistic future possibility. The second conditional imagines an unlikely or unreal situation now or in the future.','Real: “If I finish early, I will call.” Imagined: “If I had more time, I would travel.”','Do not mix the two patterns unless the meaning truly changes.','Write one realistic plan and one imagined situation.']],
    [/first conditional/, ['The condition is realistic and possible. Use a present form after if, even though the meaning refers to the future.','“If I finish early, I will call you.”','Do not normally put will directly after if: avoid “If I will finish early…”','Complete: If I have time this evening, …']],
    [/second conditional/, ['This pattern creates distance from present reality. The speaker imagines a different situation and its possible result.','“If I lived near the beach, I would swim every day.”','Use a past form in the if-clause, but understand that the meaning is present or future, not past.','Imagine you had one extra free day every week. What would you do?']],
    [/third conditional/, ['Both the condition and result belong to an unreal past. The speaker looks back and imagines how events could have been different.','“If I had left earlier, I would have caught the train.”','Keep both halves in the past pattern. Avoid mixing “if I had…” with “I would catch…”.','Change one small past decision and describe the imagined result.']],
    [/although|despite/, ['Both introduce contrast, but they take different grammar. Although is followed by a subject and verb. Despite is followed by a noun, pronoun, or -ing form.','“Although it rained, we went out.” / “Despite the rain, we went out.”','Avoid “despite it rained.” Use “despite the rain” or “although it rained.”','Join these ideas both ways: I was tired. I finished the work.']],
    [/had better/, ['Had better is stronger than ordinary advice. It suggests that an unpleasant result may follow if the person ignores the advice.','“You had better charge your phone before the trip.”','Use the base verb after better. Avoid “had better to leave.”','Give strong advice to someone who may miss a flight.']],
    [/wish/, ['Wish + past form describes a present reality you want to change. The past form creates distance from what is true now.','“I wish I knew the answer” means I do not know it now.','Do not use a present form after wish for this meaning: avoid “I wish I know.”','Write one wish about time, ability, or your daily routine.']],
    [/must have|might have/, ['Modal + have + past participle lets you make a deduction about a past event. Must have shows strong confidence, while might have shows only possibility.','“She must have forgotten.” / “She might have taken another bus.”','Do not use must have for a confirmed fact. It expresses a conclusion based on evidence.','Your friend is late and not answering. Make one strong and one uncertain guess.']],
    [/indirect question/, ['An indirect question begins politely, then uses normal statement order. The question word remains, but the subject comes before the verb.','Direct: “Where is he?” Indirect: “Do you know where he is?”','Avoid a second question order inside the sentence: not “Do you know where is he?”','Turn “When does the shop close?” into an indirect question.']],
    [/present perfect for experience/, ['Use have or has + past participle to talk about life experience when the exact time is not important. The experience can be at any time before now.','“I have visited Kerala twice.”','Do not add a finished past time such as last year. Use the past simple when you state when it happened.','Write one thing you have tried and one place you have visited.']],
    [/present perfect for updates/, ['Use have or has + past participle to give a recent update whose result matters now.','“I have finished the report, so you can review it now.”','Do not combine this form with a finished past time such as yesterday.','Give one update about something you completed today.']],
    [/present perfect/, ['This tense connects a past action or experience to the present. It is common when the exact past time is not stated.','“I have finished the report” focuses on the result now.','Do not combine it with a finished time such as yesterday. Say “I finished it yesterday.”','Give one update about something you have completed today.']],
    [/passive/, ['The passive moves attention from the person doing the action to the action or result. Use it when the actor is unknown, obvious, or less important.','Active: “They repaired the road.” Passive: “The road was repaired.”','The main verb must be a past participle, and the form of be must match the tense.','Turn “Someone stole my bicycle” into a passive sentence.']],
    [/reported speech/, ['Reported speech retells another person’s words without quoting them exactly. Pronouns, time expressions, and tense may shift to fit the new viewpoint.','Direct: “I am busy.” Reported: “She said she was busy.”','Do not keep pronouns unchanged automatically. Ask who “I,” “you,” and “we” refer to in the new sentence.','Report something a friend told you yesterday.']],
    [/question/, ['English questions normally need an auxiliary before the subject. With be, move be before the subject. With most other verbs, use do, does, or did.','“Where does she work?” / “Why were they late?”','Do not combine an auxiliary with a second past form: say “Did you go?” not “Did you went?”','Write one present question and one past question about today’s topic.']],
    [/article/, ['A or an introduces one nonspecific countable thing. The points to something already known, previously mentioned, or uniquely understood.','“I saw a dog. The dog was waiting outside.”','Do not use a or an with plural nouns or most uncountable nouns.','Describe an object near you, then mention the same object again.']],
    [/countable|uncountable/, ['Countable nouns can use numbers and plural forms. Uncountable nouns are treated as a mass or amount and normally do not take a plural ending.','“three chairs” but “some furniture”; “many tasks” but “much work.”','Avoid forms such as “informations” or “advices.” Say “pieces of information” or “some advice.”','Choose the correct word: many/much time, many/much messages.']],
    [/^comparatives$/, ['Use a comparative to show how two people or things differ. Short adjectives often add -er; longer adjectives usually use more.','“This route is shorter than the highway.” / “This chair is more comfortable.”','Do not use two comparative markers together: avoid “more easier.”','Compare two phones, places, or daily habits.']],
    [/^superlatives$/, ['Use a superlative to identify the highest or lowest member of a group of three or more. Use the before the form.','“This is the quietest room in the hotel.”','Do not use than after a superlative. Name the group with in or of.','Describe the best, easiest, or most useful item in a group.']],
    [/the more.*the more/, ['Use this pattern when one change causes or accompanies another change. Both halves begin with the + comparative.','“The more you practise, the easier speaking becomes.”','Do not use a normal subject-first order at the start of either half.','Complete: The earlier I wake up, the…']],
    [/gerunds as subjects/, ['An -ing form can name an activity and serve as the subject of a sentence. Because the activity is treated as one idea, use a singular verb.','“Walking every day improves my mood.”','Do not add to before the -ing subject.','Start a sentence with an activity you enjoy.']],
    [/gerunds after prepositions/, ['After a preposition such as by, before, after, or without, use an -ing form when an action follows.','“You improve by practising.” / “Call me before leaving.”','Do not use to + verb after these prepositions.','Complete: I relax after…']],
    [/gerund|verb-ing/, ['An -ing form can act like a noun and name an activity.','“Reading helps me relax.”','Make sure the -ing form is serving a clear role in the sentence.','Start a sentence with an activity you enjoy.']],
    [/too and enough/, ['Too shows an unwanted excess. Enough shows that the amount or degree is sufficient for a purpose.','“It is too dark to read.” / “It is bright enough to read.”','Word order changes: too comes before an adjective, while enough usually comes after it.','Describe something that is too expensive and something cheap enough to buy.']],
    [/so.*that vs such.*that/, ['Use so before an adjective or adverb. Use such before a noun phrase. The that-clause explains the result.','“It was so cold that we stayed inside.” / “It was such a cold day that we stayed inside.”','Do not put a singular countable noun directly after so.','Describe a film or meal using both patterns.']],
    [/so and such/, ['So strengthens an adjective or adverb. Such strengthens a noun phrase, often with a or an before a singular countable noun.','“The film was so funny.” / “It was such a funny film.”','Avoid “such funny” without a noun. Use “so funny” or “such a funny story.”','Describe today’s weather once with so and once with such.']],
    [/frequency/, ['Frequency adverbs show how often something happens. They usually come before a main verb but after the verb be.','“I usually walk.” / “I am usually early.”','Do not use the same position with every verb. Compare “often goes” with “is often.”','Describe three habits using always, usually, and rarely.']],
    [/modal|can|might|must|should/, ['A modal adds meaning such as ability, possibility, advice, or necessity. It is followed by the base form of the verb for every subject.','“She can drive.” / “They might arrive late.”','Do not add s, to, or a past ending after a modal: not “can drives” or “must to go.”','Make one sentence about ability and one about possibility.']],
    [/softening with.*a bit/, ['Use a bit before an adjective to reduce its strength. It is especially useful when a direct negative description might sound too harsh.','“The instructions are a bit unclear.”','Do not use a bit when a serious warning needs direct language.','Soften: “This chair is uncomfortable.”']],
    [/what if/, ['Use what if to introduce a possible situation and invite people to think about its result. A present form usually explores a real possibility; a past form can make the idea more imaginary.','“What if we miss the last train?” / “What if we lived near the sea?”','A what if question raises a possibility; it does not by itself make a decision.','Ask one what if question about tomorrow’s plan.']],
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

function buildLessonBreakdown(item) {
  const title = item.title.toLowerCase();
  const comparisons = [
    [/would.*hypothetical|reported.*would/, [
      ['REPORTED SPEECH', 'Would reports an earlier promise or future plan from a past point of view. It is not imaginary.', 'He said he would help me.'],
      ['HYPOTHETICAL WOULD', 'Would describes an imagined result when it depends on a condition.', 'He would help me if I asked.']
    ]],
    [/could.*past ability.*possibility/, [
      ['USE 1 · PAST ABILITY', 'Use could for a general skill or ability someone had in the past.', 'When I was seven, I could ride a bicycle.'],
      ['USE 2 · POSSIBILITY', 'Use could when something may happen now or in the future.', 'Take an umbrella. It could rain later.']
    ]],
    [/used to.*be used to/, [
      ['USED TO', 'An old habit or situation that is not true now. Follow it with a base verb.', 'I used to live near my office.'],
      ['BE USED TO', 'Something that feels normal or familiar now. Follow it with a noun or -ing form.', 'I am used to travelling by train.']
    ]],
    [/seem vs look/, [
      ['SEEM', 'Your general impression from facts, behavior, or the whole situation.', 'The new schedule seems practical.'],
      ['LOOK', 'Your impression from what you can see.', 'You look tired today.']
    ]],
    [/however vs therefore/, [
      ['HOWEVER', 'The next idea contrasts with the first one.', 'The room is small; however, it is comfortable.'],
      ['THEREFORE', 'The next idea is a result of the first one.', 'The road was closed; therefore, we turned back.']
    ]],
    [/let vs allow/, [
      ['LET', 'Common in conversation. Use let + person + base verb.', 'They let us enter early.'],
      ['ALLOW', 'A little more formal. Use allow + person + to + verb.', 'They allowed us to enter early.']
    ]],
    [/worth vs worthwhile/, [
      ['WORTH', 'Use worth before a noun or an -ing action.', 'This film is worth watching.'],
      ['WORTHWHILE', 'Use worthwhile to say an experience or effort has enough value.', 'The extra practice was worthwhile.']
    ]],
    [/cost vs spend/, [
      ['COST', 'The thing is the subject: thing + costs + amount.', 'The ticket cost ₹500.'],
      ['SPEND', 'The person is the subject: person + spends + amount + on.', 'I spent ₹500 on the ticket.']
    ]],
    [/needn.t have vs didn.t need to/, [
      ['NEEDN’T HAVE', 'The person did the action, but it was unnecessary.', 'You needn’t have brought food; we already had enough.'],
      ['DIDN’T NEED TO', 'There was no necessity. The sentence alone does not say whether the action happened.', 'I didn’t need to cook because Maya made dinner.']
    ]],
    [/don.t have to vs mustn.t/, [
      ['DON’T HAVE TO', 'The action is optional. You may do it, but it is not required.', 'You don’t have to attend the meeting.'],
      ['MUSTN’T', 'The action is prohibited. Do not do it.', 'You mustn’t enter this room.']
    ]],
    [/although vs despite|despite and although/, [
      ['ALTHOUGH', 'Follow although with a complete clause: subject + verb.', 'Although it was raining, we went out.'],
      ['DESPITE', 'Follow despite with a noun, pronoun, or -ing form.', 'Despite the rain, we went out.']
    ]],
    [/must have vs might have/, [
      ['MUST HAVE', 'A strong conclusion about the past based on evidence.', 'The lights are off. They must have left.'],
      ['MIGHT HAVE', 'A possible past explanation, but you are not certain.', 'They might have taken a different train.']
    ]],
    [/first vs second conditional/, [
      ['FIRST CONDITIONAL', 'A realistic future possibility.', 'If I finish early, I will call you.'],
      ['SECOND CONDITIONAL', 'An imagined or unlikely situation.', 'If I had more time, I would travel.']
    ]],
    [/by vs until/, [
      ['BY', 'The latest time for one action to be completed.', 'Please send the form by Friday.'],
      ['UNTIL', 'An action or situation continues up to an ending time.', 'I will stay here until Friday.']
    ]],
    [/been to vs gone to/, [
      ['HAS BEEN TO', 'The person visited and returned.', 'Maya has been to Goa twice.'],
      ['HAS GONE TO', 'The person is there now or travelling there.', 'Raj has gone to Goa; he returns Monday.']
    ]],
    [/so.*that vs such.*that/, [
      ['SO…THAT', 'Use so before an adjective or adverb.', 'It was so cold that we stayed inside.'],
      ['SUCH…THAT', 'Use such before a noun phrase.', 'It was such a cold day that we stayed inside.']
    ]],
    [/fewer vs less/, [
      ['FEWER', 'Use with separate things you can count.', 'We made fewer mistakes today.'],
      ['LESS', 'Use with an amount or uncountable noun.', 'We had less time today.']
    ]],
    [/stop doing vs stop to do/, [
      ['STOP DOING', 'End the activity named by the -ing form.', 'I stopped working at six.'],
      ['STOP TO DO', 'Pause one activity in order to do another.', 'I stopped to answer the phone.']
    ]],
    [/feel vs feel like/, [
      ['FEEL + ADJECTIVE', 'Describe your condition or emotion.', 'I feel tired.'],
      ['FEEL LIKE + -ING', 'Describe an action you want to do.', 'I feel like resting.']
    ]],
    [/too and enough/, [
      ['TOO', 'More than is wanted or acceptable.', 'The bag is too heavy to carry.'],
      ['ENOUGH', 'As much as is needed.', 'The bag is light enough to carry.']
    ]]
  ];
  return comparisons.find(([pattern]) => pattern.test(title))?.[1] || [];
}

function lessonDisplayTitle(item) {
  const title = item.title.toLowerCase();
  if (/would.*hypothetical/.test(title)) return '“Would” in reported speech';
  if (/could.*past ability.*possibility/.test(title)) return '“Could” for past ability and possibility';
  if (/i was wondering/.test(title)) return '“I was wondering” for a polite request';
  return item.title;
}

function buildLessonSituation(item) {
  const title = item.title.toLowerCase();
  if (/would.*hypothetical|reported.*would/.test(title)) return {
    setup: 'Yesterday, your friend said, “I will call you tomorrow.” Today, you are telling someone about that earlier promise.',
    note: 'Would is not imaginary here. It is will viewed from a past point.'
  };
  if (/ vs |either|neither|although|despite|too and enough|so.*such|fewer|less/.test(title)) return {
    setup: 'You have two similar forms available, but each one has a different meaning or grammar. First decide what you want to say, then choose the matching form.',
    note: 'The context tells you which side of the comparison you need.'
  };
  if (/mind|wondering|polite|request|soften/.test(title)) return {
    setup: 'You need to ask for something, but you want the request to sound calm and considerate instead of demanding.',
    note: 'The meaning stays clear; the wording simply gives the listener more space to respond.'
  };
  if (/conditional|what if|wish|hypothetical/.test(title)) return {
    setup: 'You are talking about a condition, possibility, or imagined situation. The form changes according to how real the situation feels.',
    note: 'Notice whether the speaker means real, possible, unlikely, or imaginary.'
  };
  if (/past|used to|reported|had |have |been to|gone to/.test(title)) return {
    setup: 'You are looking back at an earlier action, habit, statement, or experience and connecting it to the present conversation.',
    note: 'The time and the speaker’s viewpoint explain why this form is used.'
  };
  if (/future|about to|likely|probability/.test(title)) return {
    setup: 'You are talking about what you expect, plan, or think may happen after now.',
    note: 'The form shows whether the future event is planned, expected, immediate, or only possible.'
  };
  if (/assertive|boundary|feedback|disagreement|sincere|conversation|pausing/.test(title)) return {
    setup: 'Imagine this happening in an ordinary conversation. You want to express your point clearly while keeping the tone respectful.',
    note: 'The sentence works because the message is direct, specific, and considerate.'
  };
  if (/context practice/.test(title)) return {
    setup: 'Imagine a real moment from your day. Connect the new words to a person, place, action, or problem instead of memorising them alone.',
    note: 'A small realistic scene makes the vocabulary easier to remember and use later.'
  };
  if (/speaking drill/.test(title)) return {
    setup: 'Imagine explaining today’s topic to a friend without reading from the screen. Start slowly and use one complete thought at a time.',
    note: 'Speaking from memory shows which words you can already use and which ones need another review.'
  };
  return {
    setup: `Imagine that you need to express this idea in a normal conversation: ${item.idea}`,
    note: `The example follows the form “${item.pattern}” and shows the lesson’s meaning in a complete sentence.`
  };
}

function buildPracticeAnswer(item, day) {
  const title = item.title.toLowerCase();
  const rules = [
    [/context practice/, `Sample response: “${day.theme} can affect everyday life in many ways. I noticed it in a real situation, explained what happened, and used three of today’s words to describe the people, actions, and result.”`],
    [/speaking drill/, `Sample outline: “Today’s topic is ${day.theme.toLowerCase()}. It matters because it appears in real life. One useful word is ${day.words[0].word}, which means ${day.words[0].meaning}. Here is how I would use it in a personal example…”`],
    [/would.*hypothetical|reported.*would/, 'Maya said that she would finish it that night.'],
    [/could.*past ability.*possibility/, 'Past ability: “When I was eight, I could swim.” Possibility: “It could rain tomorrow.”'],
    [/i was wondering/, 'I was wondering if you could move the meeting to Friday.'],
    [/mind/, 'Would you mind turning the music down?'],
    [/used to.*be used to/, 'I used to sleep late. Now I am used to waking up at six.'],
    [/needn.t have.*didn.t need/, 'You needn’t have bought more bread; we already had enough.'],
    [/so do i|neither do i/, '“I watched that movie.” — “So did I.” / “I do not eat meat.” — “Neither do I.”'],
    [/assertive/, 'I disagree with this plan because the deadline is too short.'],
    [/adjective.*preposition/, 'I am proud of my progress.'],
    [/make vs make someone feel/, 'The good news made me happy. The good news made me feel happy.'],
    [/a bit.*softer|softening with.*a bit/, 'Your explanation is a bit confusing.'],
    [/don.t have to.*mustn.t/, 'Optional: “You don’t have to bring food.” Prohibited: “You mustn’t park here.”'],
    [/should.*probability/, 'The train should arrive at about six.'],
    [/sounding sincere/, 'I am sorry for arriving late. I should have left earlier, and next time I will allow more time.'],
    [/although|despite/, 'Although I was tired, I finished the work. / Despite being tired, I finished the work.'],
    [/had better/, 'You had better leave now, or you may miss your flight.'],
    [/polite disagreement/, 'I understand why an early meeting may help, but 7 a.m. is difficult for many people. Could we meet at nine?'],
    [/must have.*might have/, 'Strong guess: “She must have missed the bus.” Possible guess: “She might have forgotten the time.”'],
    [/seem vs look/, 'You look tired today. The new schedule seems difficult.'],
    [/indirect question/, 'Could you tell me when the shop closes?'],
    [/do you mean/, 'Do you mean the deadline has moved to next Monday?'],
    [/however vs therefore/, 'Contrast: “The room is small; however, it is comfortable.” Result: “The road was closed; therefore, we turned back.”'],
    [/first vs second conditional/, 'Real: “If I finish early, I will call you.” Imagined: “If I had more free time, I would learn guitar.”'],
    [/wish/, 'I wish I had more time to exercise.'],
    [/let vs allow/, 'They let us enter. / They allowed us to enter.'],
    [/setting a boundary/, 'When messages arrive late at night, I feel pressured. Please send non-urgent messages before eight.'],
    [/present perfect for updates/, 'I have finished the report, so you can review it now.'],
    [/by vs until/, 'Please wait until five. Please send the form by five.'],
    [/constructive feedback/, 'Your main point is clear. The middle section has too many details. Remove one example and slow down.'],
    [/been to vs gone to/, 'Priya is in Delhi now, so she has gone to Delhi.'],
    [/natural recommendations/, 'The old fort is worth visiting. You might want to arrive early.'],
    [/according to/, 'According to the weather report, it will rain this evening.'],
    [/suggests that/, 'The wet roads suggest that it rained recently.'],
    [/worth vs worthwhile/, 'The book is worth reading. The discussion was worthwhile.'],
    [/fewer vs less/, 'less traffic, fewer cars, less water'],
    [/cost vs spend/, 'The headphones cost ₹2,000. I spent ₹2,000 on the headphones.'],
    [/stop doing.*stop to do/, '“He stopped talking” means he became silent. “He stopped to talk” means he paused another activity so he could talk.'],
    [/it takes/, 'It takes me thirty minutes to get ready in the morning.'],
    [/if i were you/, 'If I were you, I would practise two interview answers tonight.'],
    [/third conditional/, 'If I had left earlier, I would have caught the train.'],
    [/de-escalating/, 'I may have missed your reply, but I did not see an answer to my message. Could we check it together?'],
    [/feel vs feel like/, 'I feel relaxed. I feel like going for a walk.'],
    [/too and enough/, 'The laptop is too expensive for me. This tablet is affordable enough to buy.'],
    [/might want to/, 'You might want to call the hotel before you leave.'],
    [/what if/, 'What if the bus is late tomorrow?'],
    [/gerunds as subjects/, 'Reading before bed helps me relax.'],
    [/building on an idea/, 'Yes, and we could add a short example after every question.'],
    [/be about to/, 'The meeting is about to start.'],
    [/likely and unlikely/, 'It is likely to rain tomorrow. It is unlikely to snow.'],
    [/future in progress/, 'At this time tomorrow, I will be working.'],
    [/emphasis with.*do|emphatic.*do/, 'I did finish the report; I sent it this morning.'],
    [/power of pausing/, 'Sample delivery: “I support the idea… but I need more time… before I can agree.”'],
    [/keep the habit alive/, 'Review plan: today after the lesson, tomorrow morning, three days later, and next week.'],
    [/keeping a conversation going/, '“That sounds like a great trip. Which place in Jaipur did you enjoy most?” / “What was the most memorable part of the weekend?”']
  ];
  return rules.find(([pattern]) => pattern.test(title))?.[1] || `One possible answer: “${item.example}”`;
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
  const adjectiveMeaning = /^(able|acting|caring|saying|showing|continuing|existing|very|worried|unpredictable|real|not |harmful|difficult|ordinary|confident|noticeable|lacking|making|honest|completely|feeling|clear|calm|focused|unwilling|open|careful|related|likely|ready|kind|pleasant|brave|adventurous|informally|patient|polite|fair|extremely|full of|having)/;
  const nounMeaning = /^(a |an |the |something |someone |money |information |courage |strength |progress |ability |quality |process |state |act |power |feeling |belief |idea |way |period |place |person |group |system |set |amount |result |part |range |lack |desire |permission |support |treatment |movement |connection |knowledge |skill )/;
  const nounEnding = /(tion|sion|ment|ness|ity|ance|ence|ship|hood|ism|age|ery|ure)$/;
  const verbMeaning = /^(to |make |keep |imagine |interrupt |reach |communicate |reduce |argue |discourage |examine |show |give |take |find |help |bring |change |use |work |move |walk |go |rise |fall |wait |relax |repeat |improve |support |control |describe |ask |tell |put |choose |decide |learn |create |prevent |protect |hold |join |remove |add |send |receive |become )/;
  let kind = verbMeaning.test(meaning) ? 'verb' : (adjectiveMeaning.test(meaning) ? 'adjective' : (nounMeaning.test(meaning) || nounEnding.test(word) ? 'noun' : 'verb'));

  let generated;
  if (kind === 'adjective') {
    const personFocused = /(feeling|worried|kind|honest|confident|able|unwilling|calm|brave|ready|fear|discouraged|adventurous|informally|patient|polite|unaware|confused|desire|caring|lacking|saying|showing)/.test(meaning);
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
  document.querySelector('#browseLibrary').addEventListener('click', goToLibrary);
  document.querySelector('#openLibrary').addEventListener('click', goToLibrary);
  document.title = 'Wordcraft — 100 Days to Better English';
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
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
  document.querySelector('#backHome').addEventListener('click', goHome);
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    goToCategory(button.dataset.category);
  }));
  document.title = 'Category Library — Wordcraft';
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
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
  document.querySelector('#backLibrary').addEventListener('click', goToLibrary);
  document.querySelector('#prevCategory').addEventListener('click', () => position > 0 && goToCategory(CATEGORIES[position - 1].slug));
  document.querySelector('#nextCategory').addEventListener('click', () => position < CATEGORIES.length - 1 && goToCategory(CATEGORIES[position + 1].slug));
  document.title = `${category.name} — Wordcraft Library`;
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
}

function goToDay(dayNumber) {
  navigateTo({day: dayNumber});
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
    const breakdown = buildLessonBreakdown(item);
    const situation = buildLessonSituation(item);
    const practiceAnswer = buildPracticeAnswer(item, day);
    const breakdownHtml = breakdown.length ? `<section class="lesson-compare">
      <small>COMPARE THE MEANINGS</small>
      ${breakdown.map(([label, explanation, example]) => `
        <div class="comparison-point"><h4>${escapeHtml(label)}</h4><p>${escapeHtml(explanation)}</p><blockquote>“${escapeHtml(example)}”</blockquote></div>`).join('')}
      </section>` : '';
    return `
      <article class="lesson-card ${i === 0 ? 'open' : ''}">
        <button class="lesson-toggle" aria-expanded="${i === 0}">
          <span class="lesson-index">0${i + 1}</span><h3>${escapeHtml(lessonDisplayTitle(item))}</h3><span class="plus">+</span>
        </button>
        <div class="lesson-body"><div class="lesson-inner">
          <section class="lesson-intro">
            <small>WHAT THIS LESSON IS ABOUT</small>
            <p class="lesson-lead">${escapeHtml(item.idea)}</p>
            <p>${escapeHtml(guide.explanation)}</p>
          </section>
          <section class="lesson-situation">
            <small>SEE IT IN A REAL SITUATION</small>
            <p>${escapeHtml(situation.setup)}</p>
            <blockquote>“${escapeHtml(item.example)}”</blockquote>
            <p>${escapeHtml(situation.note)}</p>
          </section>
          <section class="lesson-form">
            <small>THE FORM TO REMEMBER</small>
            <code>${escapeHtml(item.pattern)}</code>
          </section>
          ${breakdownHtml}
          <section class="lesson-more">
            <small>ONE MORE NATURAL EXAMPLE</small>
            <p>${escapeHtml(guide.extraExample)}</p>
          </section>
          <section class="lesson-reminder">
            <small>SIMPLE REMINDER</small>
            <p>${escapeHtml(guide.mistake)}</p>
          </section>
          <section class="practice-card">
              <small>TRY IT YOURSELF</small><p>${escapeHtml(guide.practice)}</p>
              <button type="button" class="answer-toggle" aria-expanded="false">Show sample answer</button>
              <div class="practice-answer" hidden><small>SAMPLE ANSWER</small><p>${escapeHtml(practiceAnswer)}</p></div>
          </section>
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
  document.querySelector('#backHome').addEventListener('click', goHome);
  document.querySelectorAll('.lesson-toggle').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.lesson-card');
    card.classList.toggle('open');
    button.setAttribute('aria-expanded', card.classList.contains('open'));
  }));
  document.querySelectorAll('.answer-toggle').forEach(button => button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.textContent = isOpen ? 'Show sample answer' : 'Hide sample answer';
    answer.hidden = isOpen;
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
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
}

function route() {
  const legacyDay = location.hash.match(/^#day-(\d+)$/);
  const legacyCategory = location.hash.match(/^#category-(.+)$/);
  if (legacyDay) return navigateTo({day: legacyDay[1]}, true);
  if (location.hash === '#categories') return navigateTo({page: 'categories'}, true);
  if (legacyCategory) return navigateTo({category: legacyCategory[1]}, true);
  if (location.hash) return navigateTo({}, true);

  const params = new URLSearchParams(location.search);
  const dayNumber = Number(params.get('day'));
  const category = params.get('category');
  if (Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= DAYS.length) renderDay(dayNumber);
  else if (params.get('page') === 'categories') renderLibrary();
  else if (category) renderCategory(category);
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
    else goToCategory(button.dataset.slug);
  }));
}

document.querySelector('#searchBtn').addEventListener('click', () => {
  dialog.showModal(); searchWords(input.value); setTimeout(() => input.focus(), 50);
});
document.querySelector('#libraryBtn').addEventListener('click', goToLibrary);
document.querySelector('#closeSearch').addEventListener('click', () => dialog.close());
input.addEventListener('input', () => searchWords(input.value));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const savedTheme = localStorage.getItem('wordcraft-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
document.querySelector('#themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('wordcraft-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); goHome(); });
window.addEventListener('popstate', route);
route();
