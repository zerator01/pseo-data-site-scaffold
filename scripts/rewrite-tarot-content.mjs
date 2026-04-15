import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "..", "data", "tarot-cards.json");

const majorArcana = {
  "the-fool": {
    theme: "beginnings, trust, and the courage to enter an unmapped chapter",
    uprightKeywords: ["fresh start", "faith", "curiosity", "openness", "new path"],
    reversedKeywords: ["carelessness", "avoidance", "poor timing", "naivety", "hesitation"],
    uprightText:
      "The Fool marks the point where life asks for movement before certainty arrives. Upright, it speaks to innocence that is not childish but alive: the willingness to meet experience without overprotecting yourself from every unknown. This card often appears when a new chapter cannot be managed through old rules alone. It asks for trust, experimentation, and a looser grip on outcome so that discovery has room to happen.",
    reversedText:
      "Reversed, The Fool warns that the threshold is still here, but your relationship to risk is distorted. You may be leaping without preparation, romanticizing freedom while ignoring consequences, or doing the opposite and freezing because you want guarantees that no beginning can provide. The task is not blind faith. It is conscious risk: enough grounding to move forward, enough humility to admit what you do not yet know.",
    symbolism:
      "The cliff, open sky, and traveling figure show a psyche at the edge of formation. The small bundle suggests untapped potential carried lightly, while the companion animal represents instinct trying to keep pace with freedom. The card's symbolism centers on openness before identity hardens into habit."
  },
  "the-magician": {
    theme: "focused will, skill, and the ability to turn intention into form",
    uprightKeywords: ["focus", "agency", "craft", "resourcefulness", "manifestation"],
    reversedKeywords: ["misdirection", "scattered will", "empty talk", "manipulation", "underuse"],
    uprightText:
      "The Magician is the disciplined use of attention. Upright, it shows a moment when talent, timing, and self-belief can be coordinated into visible results. The card is less about fantasy than about translation: taking what exists in thought, language, or desire and building a workable channel for it. It favors skill, preparation, and the mature use of power.",
    reversedText:
      "Reversed, The Magician points to blocked execution, scattered attention, or the misuse of influence. You may have real ability but be fragmenting it through distraction, self-doubt, or the need to impress rather than deliver. In some situations it also flags manipulation, spin, or promises that sound polished but are not backed by substance. Integrity and follow-through are the corrective.",
    symbolism:
      "The tools on the table show that nothing essential is missing; the question is whether the will is coherent enough to use what is available. The raised and lowered hands describe the movement from idea to embodiment. This is the card of conscious channeling."
  },
  "the-high-priestess": {
    theme: "inner knowing, restraint, and perception beneath the surface",
    uprightKeywords: ["intuition", "mystery", "silence", "discernment", "depth"],
    reversedKeywords: ["confusion", "disconnection", "secrecy", "projection", "ignored intuition"],
    uprightText:
      "The High Priestess governs what is sensed before it is explained. Upright, she describes a period in which listening matters more than declaring, and where subtle information carries more truth than loud certainty. She asks for patient observation, emotional literacy, and trust in what repeats quietly underneath the obvious storyline.",
    reversedText:
      "Reversed, this card suggests noise in the inner channel. You may be ignoring intuition, mistaking anxiety for insight, or becoming trapped in secrecy that prevents honest contact with reality. The remedy is not more intensity; it is calmer perception. Slow down, verify what you feel, and let insight emerge without forcing an answer prematurely.",
    symbolism:
      "The veil, pillars, and moon imagery point to thresholds between the known and the hidden. She does not block truth; she filters it, asking whether you are mature enough to receive it without distortion."
  },
  "the-empress": {
    theme: "nourishment, embodiment, and the power that comes from growth",
    uprightKeywords: ["abundance", "care", "fertility", "beauty", "expression"],
    reversedKeywords: ["overgiving", "stagnation", "self-neglect", "smothering", "creative block"],
    uprightText:
      "The Empress is expansive life-force made tangible. Upright, she points to growth that comes from nourishment rather than force: tending the body, supporting creativity, and building conditions where relationships or projects can flourish over time. She values receptivity, sensual presence, and the intelligence of pacing.",
    reversedText:
      "Reversed, The Empress often shows depletion beneath a polished surface. Care may be flowing outward without renewal, or comfort may have turned into passivity. In other cases, nurturing becomes controlling and intimacy loses its spaciousness. The lesson is to restore circulation: receive as seriously as you give and let growth happen without possession.",
    symbolism:
      "Fields, flowing water, and rich textures connect the card to fertility in the broadest sense: ideas, bodies, homes, and ecosystems. Her symbolism is about cultivated abundance, not excess for its own sake."
  },
  "the-emperor": {
    theme: "structure, authority, and responsible direction",
    uprightKeywords: ["order", "leadership", "boundaries", "stability", "strategy"],
    reversedKeywords: ["rigidity", "control", "defensiveness", "misused power", "stubbornness"],
    uprightText:
      "The Emperor represents structure that protects rather than suffocates. Upright, he appears when clear decisions, strong boundaries, and long-range planning are required. This card favors mature authority: taking ownership of consequences, organizing complexity, and making systems dependable enough that others can trust them.",
    reversedText:
      "Reversed, The Emperor warns that structure has become brittle or authoritarian. Control may be compensating for fear, or leadership may be more invested in obedience than in stewardship. At a personal level, it can show overdefensiveness and difficulty adapting when conditions change. Rebuild authority around responsibility rather than domination.",
    symbolism:
      "The throne, stone architecture, and mountain imagery show the principle of durable form. The Emperor's symbolism is not softness but legitimacy: power that earns stability through order and accountability."
  },
  "the-hierophant": {
    theme: "tradition, teaching, and shared systems of meaning",
    uprightKeywords: ["tradition", "mentorship", "ritual", "education", "belief"],
    reversedKeywords: ["dogma", "rebellion", "empty conformity", "rigid thinking", "disillusionment"],
    uprightText:
      "The Hierophant speaks to inherited wisdom, trusted process, and the social structures that help people learn, belong, and transmit value across generations. Upright, it favors study, mentorship, and working through tested frameworks before attempting reinvention. It can point to institutions, vows, disciplines, and agreements that offer shape to spiritual or practical life.",
    reversedText:
      "Reversed, the card asks whether a system still serves truth or merely protects itself. You may be outgrowing a belief structure, noticing hypocrisy in leadership, or reacting against convention without building anything more coherent in its place. The work is discernment: keep what is alive, release what is mechanical, and refuse both blind conformity and performative rebellion.",
    symbolism:
      "The ceremonial setting, initiates, and formal regalia express knowledge mediated through culture. Symbolically, the card asks how authority is granted, how tradition is embodied, and when obedience becomes too costly."
  },
  "the-lovers": {
    theme: "choice, alignment, and honest reciprocity",
    uprightKeywords: ["union", "choice", "alignment", "intimacy", "shared values"],
    reversedKeywords: ["misalignment", "avoidance", "ambivalence", "fracture", "temptation"],
    uprightText:
      "The Lovers is not only about romance; it is about choosing in a way that keeps the heart, body, and conscience in agreement. Upright, it points to relational clarity, mutual recognition, and the courage to commit to what genuinely matches your values. It often appears when a decision has emotional consequences and cannot be solved by logic alone.",
    reversedText:
      "Reversed, The Lovers suggests split motives, mixed signals, or choices made against your own better knowing. A relationship may be exposing values that were never actually shared, or you may be avoiding a clean decision because every option asks for sacrifice. The card calls for honesty before harmony. What is not aligned will not become stable through charm alone.",
    symbolism:
      "The paired figures and overseeing force show relationship as revelation. Symbolically, the card teaches that intimacy is a mirror and that choice always shapes identity."
  },
  "the-chariot": {
    theme: "directed momentum, self-command, and disciplined ambition",
    uprightKeywords: ["drive", "direction", "victory", "resolve", "self-mastery"],
    reversedKeywords: ["friction", "scattered force", "overcontrol", "stalling", "conflict"],
    uprightText:
      "The Chariot is movement with purpose. Upright, it signals a period in which determination, discipline, and emotional regulation can carry you through competing pressures. The card does not suggest effortless flow; it suggests steering. Success comes from aligning instinct, will, and action behind one clear trajectory.",
    reversedText:
      "Reversed, momentum is present but poorly governed. You may be forcing progress, splitting your energy between incompatible priorities, or letting inner conflict hijack forward motion. The answer is not more aggression. It is recalibration. Decide what you are actually driving toward and what must stop pulling the reins in opposite directions.",
    symbolism:
      "The vehicle, armor, and paired creatures represent the attempt to guide mixed drives without being consumed by them. The Chariot's symbolism centers on command under pressure."
  },
  strength: {
    theme: "steady courage, instinct integration, and calm influence",
    uprightKeywords: ["courage", "patience", "composure", "gentle power", "resilience"],
    reversedKeywords: ["self-doubt", "reactivity", "fatigue", "suppressed anger", "fragility"],
    uprightText:
      "Strength describes power that does not need spectacle. Upright, it points to emotional regulation, patient endurance, and the ability to work with instinct instead of either suppressing it or being ruled by it. This is the card of inner steadiness, especially when the external situation invites panic or domination.",
    reversedText:
      "Reversed, Strength can show depletion, self-distrust, or a strained relationship with your own drives. Anger may be leaking sideways, or tenderness may be mistaken for weakness. The card asks you to rebuild confidence through consistency, self-respect, and nervous-system care rather than through forceful performance.",
    symbolism:
      "The human-animal pairing symbolizes consciousness meeting instinct without violence. Strength teaches that mastery often looks like softness held with unusual firmness."
  },
  "the-hermit": {
    theme: "solitude, reflection, and earned wisdom",
    uprightKeywords: ["withdrawal", "clarity", "study", "guidance", "inner light"],
    reversedKeywords: ["isolation", "avoidance", "distance", "stagnant solitude", "disconnection"],
    uprightText:
      "The Hermit invites strategic withdrawal so that thought can deepen and truth can separate itself from social noise. Upright, it favors reflection, research, spiritual practice, and the kind of solitude that clarifies rather than numbs. The card often appears when external pace must slow down for internal alignment to catch up.",
    reversedText:
      "Reversed, withdrawal may have crossed into avoidance or loneliness. You may be overprotecting your inner life, refusing help, or staying in analysis long after action is required. The card asks whether solitude is currently serving insight or merely shielding you from contact, risk, or feedback.",
    symbolism:
      "The lantern in darkness shows wisdom as a local light, not total certainty. The Hermit symbolizes searching with humility and walking only as far as present understanding honestly reaches."
  },
  "wheel-of-fortune": {
    theme: "cycles, timing, and forces larger than personal control",
    uprightKeywords: ["turning point", "timing", "fate", "change", "cycle"],
    reversedKeywords: ["delay", "resistance", "bad timing", "repetition", "loss of perspective"],
    uprightText:
      "The Wheel of Fortune marks a shift in pattern. Upright, it often appears when life is moving through a larger cycle that cannot be managed solely through effort. Openings, reversals, meetings, and departures may happen quickly. The card encourages responsiveness, perspective, and respect for timing. You do not control the wheel, but you can decide how consciously you move with it.",
    reversedText:
      "Reversed, you may be fighting a change that is already underway or repeating an old cycle because its lesson has not been integrated. Delays and frustrating detours are possible, but the deeper issue is often orientation. Step back and ask what pattern keeps returning, what timing is off, and where acceptance would create more leverage than resistance.",
    symbolism:
      "The turning wheel symbolizes movement across seasons of gain, loss, insight, and uncertainty. Its imagery reminds you that no single phase is permanent and that perspective is part of wisdom."
  },
  justice: {
    theme: "truth, accountability, and balanced consequences",
    uprightKeywords: ["clarity", "fairness", "ethics", "cause and effect", "responsibility"],
    reversedKeywords: ["bias", "avoidance", "distortion", "unfairness", "evasiveness"],
    uprightText:
      "Justice is the card of clean seeing. Upright, it asks for honesty about motives, actions, and consequences. It favors contracts, decisions, and conversations that can withstand scrutiny because they are built on proportion and fact. On a personal level, it asks you to live in a way that reduces inner contradiction.",
    reversedText:
      "Reversed, Justice points to denial, selective truth, or a system that is not functioning fairly. You may be rationalizing a choice you already know is off-center, or you may be dealing with another person's refusal to take responsibility. The corrective is precision: document, clarify, and stop asking ambiguity to do the work of ethics.",
    symbolism:
      "The scales and blade symbolize balance joined to discernment. Justice is not sentimental; its symbolism centers on proportion, evidence, and consequences that follow from what is real."
  },
  "the-hanged-man": {
    theme: "suspension, surrender, and changed perspective",
    uprightKeywords: ["pause", "release", "reframing", "acceptance", "inner shift"],
    reversedKeywords: ["stalling", "martyrdom", "resistance", "delay", "stuck pattern"],
    uprightText:
      "The Hanged Man asks you to stop solving the present moment with your usual posture. Upright, it speaks to fruitful suspension: a pause that reorganizes perception, loosens ego-control, and reveals what cannot be seen from a purely active stance. It is often uncomfortable precisely because it interrupts habit.",
    reversedText:
      "Reversed, the pause may no longer be meaningful. You may be delaying, over-sacrificing, or turning waiting into identity. In some cases the card points to resentment born from giving too much without clear choice. The lesson is to distinguish sacred surrender from passive stagnation and then act accordingly.",
    symbolism:
      "The inverted figure suggests insight gained through reversal. Symbolically, the card shows that wisdom sometimes requires stillness, discomfort, and a different angle on reality."
  },
  death: {
    theme: "ending, release, and irreversible transformation",
    uprightKeywords: ["ending", "transition", "release", "renewal", "transformation"],
    reversedKeywords: ["clinging", "denial", "delay", "stagnation", "fear of change"],
    uprightText:
      "Death is the card of necessary endings. Upright, it does not predict disaster so much as irreversible change: the part of life where an old identity, attachment, or structure can no longer continue in its present form. The transformation may be chosen or imposed, but either way it asks for cooperation with reality rather than nostalgia for what has already finished.",
    reversedText:
      "Reversed, Death often shows prolonged attachment to what is clearly over. Fear, habit, and grief may be stretching a transition that would hurt less if faced directly. The card asks for cleaner release. Something is trying to leave your life or change its shape; refusing that movement only turns transition into stagnation.",
    symbolism:
      "The skeletal imagery strips life down to what cannot be negotiated away: impermanence. Death symbolizes renewal through subtraction and the dignity of making room for what comes after an ending."
  },
  temperance: {
    theme: "integration, moderation, and sustainable flow",
    uprightKeywords: ["balance", "healing", "blending", "patience", "proportion"],
    reversedKeywords: ["excess", "imbalance", "friction", "restlessness", "miscalibration"],
    uprightText:
      "Temperance is the art of right proportion. Upright, it points to healing through integration: blending different needs, roles, or energies until a more sustainable rhythm emerges. This card values patience, refinement, and steady adjustment over dramatic swings. It is especially helpful when life has become polarized.",
    reversedText:
      "Reversed, the system has lost calibration. Extremes may be replacing nuance, and attempts to rush chemistry are likely creating strain. Whether the issue is time, emotion, money, or workload, the message is similar: reduce excess, measure more carefully, and let balance be built rather than declared.",
    symbolism:
      "The mixing of elements is central here. Temperance symbolizes the quiet intelligence that knows healing often comes through disciplined blending rather than through one grand breakthrough."
  },
  "the-devil": {
    theme: "attachment, compulsion, and the truth about desire",
    uprightKeywords: ["attachment", "temptation", "shadow", "compulsion", "material pull"],
    reversedKeywords: ["release", "sobriety", "awareness", "detachment", "uncoupling"],
    uprightText:
      "The Devil names what has leverage over you. Upright, it points to compulsive patterns, seductive agreements, or forms of dependency that promise relief while narrowing freedom. This card is not moralistic. It is diagnostic. It asks what desire is trying to solve, what cost is being hidden, and why the familiar trap still feels easier than honest responsibility.",
    reversedText:
      "Reversed, the spell is weakening. Awareness may be returning, and patterns that once felt total are beginning to look negotiable. Even so, liberation is rarely instantaneous. The card favors practical disentangling: changing routines, reducing exposure, telling the truth, and building the self-trust required to leave what once seemed irresistible.",
    symbolism:
      "Chains, shadowed figures, and seductive imagery symbolize bondage maintained not only by force but by consent and habit. The Devil asks you to see the contract clearly before you can step out of it."
  },
  "the-tower": {
    theme: "rupture, revelation, and unstable structures collapsing",
    uprightKeywords: ["upheaval", "truth shock", "collapse", "revelation", "reset"],
    reversedKeywords: ["contained crisis", "denial", "slow collapse", "resistance", "private reckoning"],
    uprightText:
      "The Tower clears what can no longer hold. Upright, it describes abrupt revelation, structural failure, or a destabilizing truth that changes the landscape quickly. The pain of this card usually comes from exposure rather than malice: what was unsound is no longer able to pretend. In the long run, The Tower serves honesty by removing false security.",
    reversedText:
      "Reversed, the collapse may be happening internally, behind the scenes, or more gradually than expected. You may sense that a structure is failing but still be trying to contain the fallout through denial or postponement. The lesson remains the same: what is unstable needs rebuilding, not cosmetic repair.",
    symbolism:
      "The struck tower symbolizes ego-structures, institutions, or stories losing their false invulnerability. The imagery teaches that revelation can be disruptive and still be necessary."
  },
  "the-star": {
    theme: "renewal, hope, and restorative honesty",
    uprightKeywords: ["hope", "healing", "clarity", "faith", "renewal"],
    reversedKeywords: ["discouragement", "disconnection", "dryness", "cynicism", "wavering faith"],
    uprightText:
      "The Star arrives after disturbance and asks for a gentler kind of courage: the willingness to believe in repair. Upright, it speaks to healing, openness, and a future-oriented calm that does not need denial to survive. This card favors authenticity, replenishment, and sharing what is true without theatricality.",
    reversedText:
      "Reversed, hope may feel thin or inaccessible. You may be functioning while privately exhausted, or protecting yourself from disappointment by lowering your expectations of life altogether. The card does not ask for forced optimism. It asks for reconnection with whatever quietly restores trust: rest, sincerity, art, friendship, prayer, or clean water after emotional drought.",
    symbolism:
      "The water, sky, and naked figure suggest restoration through honesty and elemental simplicity. The Star symbolizes renewal that comes when pretension drops and the nervous system can soften again."
  },
  "the-moon": {
    theme: "uncertainty, intuition, and the psychology of shadows",
    uprightKeywords: ["ambiguity", "dreams", "intuition", "projection", "subconscious"],
    reversedKeywords: ["clarification", "exposure", "reduced confusion", "truth surfacing", "stabilizing"],
    uprightText:
      "The Moon governs periods when the path is real but not fully visible. Upright, it points to heightened sensitivity, dream activity, projection, and the need to move carefully through uncertainty. Not everything unclear is deceptive, but not everything felt is trustworthy either. The card asks for intuition with boundaries and imagination with verification.",
    reversedText:
      "Reversed, confusion begins to break. Hidden information may surface, emotional fog may thin, or fear may lose some of its persuasive force. Even so, clarity can be uneven. The work is to sort signal from projection and to ground what you learn in behavior, evidence, and embodied reality.",
    symbolism:
      "Night imagery, water, and the winding path symbolize the subconscious mind and the instability of partial light. The Moon reminds you that mystery can reveal as much about the observer as about the terrain."
  },
  "the-sun": {
    theme: "clarity, vitality, and wholehearted expression",
    uprightKeywords: ["joy", "visibility", "truth", "confidence", "vitality"],
    reversedKeywords: ["delay", "self-consciousness", "muted joy", "burnout", "blocked warmth"],
    uprightText:
      "The Sun is the card of radiant coherence. Upright, it indicates visibility, confidence, and the life-giving effect of having less to hide. It favors joy that comes from congruence rather than performance: saying what is true, showing up fully, and allowing success or affection to be received without shrinking from it.",
    reversedText:
      "Reversed, the light is present but obstructed. Fatigue, self-consciousness, or disappointment may be making it hard to trust ease. The card asks whether you are dimming yourself out of habit, fear of exposure, or simple exhaustion. Reduce the static and let warmth become believable again.",
    symbolism:
      "The bright landscape and open figure symbolize vitality, innocence regained through maturity, and truth made visible. The Sun stands for nourishment through clarity."
  },
  judgement: {
    theme: "awakening, reckoning, and answering a deeper call",
    uprightKeywords: ["awakening", "reckoning", "calling", "forgiveness", "renewal"],
    reversedKeywords: ["avoidance", "self-judgment", "delay", "unfinished past", "hesitation"],
    uprightText:
      "Judgement is the moment when life asks for an answer. Upright, it signals awakening, review, and the call to live from a more integrated version of yourself. Old material resurfaces not to shame you but to be understood, forgiven, and used differently. This card often accompanies decisions that feel morally or spiritually consequential.",
    reversedText:
      "Reversed, the call is still sounding but you may be postponing it through guilt, harsh self-critique, or fear of what change would require. In some cases the card points to unfinished business from the past that keeps muting the present. The work is not self-punishment. It is response: honest review followed by cleaner action.",
    symbolism:
      "The imagery of rising and answering points to renewal through conscious reckoning. Judgement symbolizes the soul's demand to stop living below what it knows."
  },
  "the-world": {
    theme: "completion, integration, and participation in a larger whole",
    uprightKeywords: ["completion", "integration", "mastery", "wholeness", "arrival"],
    reversedKeywords: ["unfinished cycle", "delay", "fragmentation", "lingering task", "incomplete closure"],
    uprightText:
      "The World marks a cycle completed with enough awareness that it becomes wisdom rather than mere exhaustion. Upright, it points to integration, earned confidence, and a wider sense of belonging after long effort. Achievement is part of the card, but so is coherence: different parts of the self or of a project finally fitting together.",
    reversedText:
      "Reversed, completion is near but not settled. Loose ends, avoidance, or fragmentation may be preventing full closure. Sometimes the card appears when you are already finished internally but have not enacted the final external step. Complete what remains, close the loop, and let arrival become real rather than theoretical.",
    symbolism:
      "The encircling wreath and four witnesses symbolize completion within a broader order. The World is the card of belonging through integration, not perfection."
  }
};

const suitData = {
  Wands: {
    element: "fire",
    domain: "action, desire, confidence, and creative propulsion",
    gift: "courage and expressive momentum",
    shadow: "impulsiveness, burnout, and ego-reactivity",
    uprightKeywords: ["initiative", "energy", "direction", "courage", "creative spark"],
    reversedKeywords: ["friction", "delay", "diffused energy", "impatience", "reactivity"],
    symbolism:
      "Wands cards use staffs, flame, and outward movement to symbolize life-force trying to become visible through action. Their imagery is about direction, vitality, and the management of desire."
  },
  Cups: {
    element: "water",
    domain: "emotion, intimacy, imagination, and the relational field",
    gift: "empathy, receptivity, and heartfelt connection",
    shadow: "moodiness, idealization, and emotional avoidance",
    uprightKeywords: ["feeling", "bond", "intuition", "softness", "emotional flow"],
    reversedKeywords: ["withdrawal", "flooding", "confusion", "emotional block", "disappointment"],
    symbolism:
      "Cups imagery emphasizes water, vessels, and exchange. These cards symbolize how feeling is held, offered, shared, avoided, or transformed inside relationships and inner life."
  },
  Swords: {
    element: "air",
    domain: "thought, language, truth, conflict, and decision-making",
    gift: "clarity, precision, and discernment",
    shadow: "overthinking, harshness, and mental fragmentation",
    uprightKeywords: ["clarity", "truth", "analysis", "decision", "perspective"],
    reversedKeywords: ["confusion", "mental strain", "avoidance", "distortion", "inner conflict"],
    symbolism:
      "Swords cut, divide, and define. Their symbolism centers on intellect, language, conflict, and the way thought can either liberate or trap the mind that uses it."
  },
  Pentacles: {
    element: "earth",
    domain: "work, money, body, routine, and long-term material reality",
    gift: "grounding, patience, and practical stewardship",
    shadow: "stagnation, possessiveness, and overidentification with security",
    uprightKeywords: ["stability", "craft", "resource", "patience", "embodiment"],
    reversedKeywords: ["scarcity", "imbalance", "waste", "rigidity", "disorder"],
    symbolism:
      "Pentacles imagery points to land, craft, currency, and the body. These cards symbolize the tangible conditions that support or strain daily life."
  }
};

const numberMeanings = {
  1: {
    stage: "a beginning or seed-form",
    uprightKeywords: ["beginning", "opening"],
    reversedKeywords: ["blocked start", "misfire"],
    uprightCore:
      "As an Ace, this card concentrates the suit into a first surge of possibility. It marks raw potential, an opening, and the need to respond before the energy becomes abstract again.",
    reversedCore:
      "Reversed, the initial opening is present but not landing cleanly. Energy may be delayed, ignored, or leaking away before it forms a real beginning."
  },
  2: {
    stage: "duality, choice, and balancing two forces",
    uprightKeywords: ["balance", "choice"],
    reversedKeywords: ["imbalance", "indecision"],
    uprightCore:
      "As a Two, the suit learns to relate to itself through exchange, contrast, and choice. This card asks how opposing pulls can be held without collapse.",
    reversedCore:
      "Reversed, balance slips. Tension may harden into indecision, misattunement, or the inability to keep two real demands in conversation."
  },
  3: {
    stage: "expansion, collaboration, and first visible development",
    uprightKeywords: ["growth", "cooperation"],
    reversedKeywords: ["misalignment", "fragmentation"],
    uprightCore:
      "As a Three, the suit moves from private impulse into visible development. It often points to cooperation, momentum, and the first reliable signs of growth.",
    reversedCore:
      "Reversed, growth is uneven. Collaboration may be strained, timing may be off, or the expansion has outrun the structure needed to support it."
  },
  4: {
    stage: "stability, containment, and the desire for security",
    uprightKeywords: ["stability", "containment"],
    reversedKeywords: ["stuckness", "rigidity"],
    uprightCore:
      "As a Four, the card seeks structure, rest, or stability. It creates a container strong enough to hold the suit without constant turbulence.",
    reversedCore:
      "Reversed, the container has become stale or unstable. Security may be pursued so tightly that it turns into stuckness, or neglected so badly that calm cannot hold."
  },
  5: {
    stage: "friction, disruption, and the test that exposes weakness",
    uprightKeywords: ["challenge", "pressure"],
    reversedKeywords: ["recovery", "escalation"],
    uprightCore:
      "As a Five, the suit meets friction. Conflict, disappointment, or strain reveals what is not integrated and pushes adaptation into the foreground.",
    reversedCore:
      "Reversed, you may be moving out of crisis or staying entangled in it longer than necessary. The task is to learn from disruption rather than organize life around it."
  },
  6: {
    stage: "adjustment, restoration, and more conscious flow",
    uprightKeywords: ["adjustment", "support"],
    reversedKeywords: ["backsliding", "imbalance"],
    uprightCore:
      "As a Six, the suit searches for better proportion after previous strain. Help, exchange, reconciliation, or directional correction often become possible here.",
    reversedCore:
      "Reversed, the hoped-for correction is incomplete. The card may show uneven reciprocity, delayed recovery, or difficulty trusting the next phase of movement."
  },
  7: {
    stage: "testing, discernment, and reality-checking a direction",
    uprightKeywords: ["testing", "assessment"],
    reversedKeywords: ["self-doubt", "poor judgment"],
    uprightCore:
      "As a Seven, the suit is examined. You are asked to defend, evaluate, or sort what deserves continued investment and what does not.",
    reversedCore:
      "Reversed, assessment becomes cloudy. Overconfidence, discouragement, or mixed priorities can distort judgment and weaken position."
  },
  8: {
    stage: "momentum, concentration, and intensified movement",
    uprightKeywords: ["momentum", "focus"],
    reversedKeywords: ["interruption", "scattering"],
    uprightCore:
      "As an Eight, the suit intensifies. Momentum builds, patterns accelerate, and focused repetition or quick movement changes the tempo of events.",
    reversedCore:
      "Reversed, speed works against coherence. Energy may scatter, progress may jam, or repetition may become compulsive rather than skillful."
  },
  9: {
    stage: "maturity, culmination, and the private consequences of effort",
    uprightKeywords: ["maturity", "ripening"],
    reversedKeywords: ["strain", "unfinished emotional work"],
    uprightCore:
      "As a Nine, the suit ripens. Results become personal, intimate, and revealing, showing what the long arc of effort has produced inside the self.",
    reversedCore:
      "Reversed, the near-completion phase carries strain. What should feel mature may instead feel lonely, anxious, or not yet integrated."
  },
  10: {
    stage: "completion, burden, or the full consequence of accumulation",
    uprightKeywords: ["culmination", "legacy"],
    reversedKeywords: ["release", "collapse"],
    uprightCore:
      "As a Ten, the suit reaches fullness. That fullness may look like abundance, closure, overload, or the need to hand something on before it becomes too heavy.",
    reversedCore:
      "Reversed, the ending is unstable or overdue. Release, recovery, or structural breakdown may be necessary before the next cycle can begin cleanly."
  }
};

const courtData = {
  11: {
    rank: "Page",
    stage: "early engagement, curiosity, and learning by contact",
    uprightKeywords: ["curiosity", "learning"],
    reversedKeywords: ["immaturity", "hesitation"],
    uprightCore:
      "As a Page, this card approaches the suit with curiosity, openness, and beginner energy. It often points to messages, experiments, and the need to stay teachable.",
    reversedCore:
      "Reversed, the learning edge becomes awkward. Signals may be mixed, enthusiasm may lack grounding, or immaturity may block the next step."
  },
  12: {
    rank: "Knight",
    stage: "pursuit, movement, and testing conviction through action",
    uprightKeywords: ["movement", "pursuit"],
    reversedKeywords: ["recklessness", "stalling"],
    uprightCore:
      "As a Knight, the suit becomes mobile and goal-directed. This card shows pursuit, momentum, and the desire to test conviction through action.",
    reversedCore:
      "Reversed, movement loses proportion. The drive may become erratic, forceful, or stalled by the very intensity meant to carry it forward."
  },
  13: {
    rank: "Queen",
    stage: "inner mastery, attunement, and sustained stewardship",
    uprightKeywords: ["inner mastery", "wisdom"],
    reversedKeywords: ["misattunement", "overcontrol"],
    uprightCore:
      "As a Queen, the suit is inwardly mastered. The card expresses mature influence, self-possession, and a nuanced relationship with the element's emotional and practical realities.",
    reversedCore:
      "Reversed, mastery is strained. The suit may become overmanaged, withheld, or distorted by protectiveness, resentment, or misattunement."
  },
  14: {
    rank: "King",
    stage: "outward authority, leadership, and responsible command",
    uprightKeywords: ["leadership", "authority"],
    reversedKeywords: ["misused authority", "rigidity"],
    uprightCore:
      "As a King, the suit moves outward as leadership, stewardship, and decisive embodiment. The question is how power is exercised, not merely whether it is possessed.",
    reversedCore:
      "Reversed, authority wobbles or hardens. Leadership may turn rigid, detached, or self-serving, leaving the element poorly governed."
  }
};

const minorDetails = {
  "ace-of-wands": {
    focus: "the first clean spark that wants expression before doubt organizes against it",
    shadow: "heat without direction, where excitement burns faster than commitment can form",
    love: "sudden attraction, flirtation, and the willingness to initiate",
    career: "a launch window, pitch moment, or creative green light",
    finance: "backing a new initiative with controlled enthusiasm",
    health: "reigniting vitality without mistaking adrenaline for stability",
    symbol: "the offered wand suggests raw life-force entering the field before structure catches up"
  },
  "two-of-wands": {
    focus: "standing at the threshold between local security and a wider horizon",
    shadow: "remaining in strategy mode so long that desire never becomes movement",
    love: "deciding whether a connection has real future-range",
    career: "mapping expansion before resources are fully deployed",
    finance: "choosing between preserving comfort and funding growth",
    health: "balancing caution with the need to re-enter life",
    symbol: "the globe and elevated vantage point show planning that reaches beyond the familiar map"
  },
  "three-of-wands": {
    focus: "watching your effort meet the wider world and waiting for response",
    shadow: "overidentifying with future payoff while neglecting what still needs tending now",
    love: "seeing whether emotional investment is genuinely reciprocated over distance or time",
    career: "early traction, expansion, and evidence that the plan can travel",
    finance: "returns that depend on patience, logistics, and timing",
    health: "trusting gradual improvement rather than instant proof",
    symbol: "the figure facing outward captures expectancy, range, and the discipline of sustained vision"
  },
  "four-of-wands": {
    focus: "celebration rooted in stability rather than spectacle",
    shadow: "performing happiness while ignoring what the structure underneath actually feels like",
    love: "shared milestones, hospitality, and making space for commitment to be seen",
    career: "a successful landing point, team morale boost, or dependable base camp",
    finance: "using resources to strengthen home base and communal stability",
    health: "recovery supported by rest, ritual, and a safe environment",
    symbol: "the garlanded posts turn fire into ceremony, showing passion contained inside a supportive frame"
  },
  "five-of-wands": {
    focus: "competitive friction that exposes style, ego, and real readiness",
    shadow: "mistaking noise and struggle for meaningful progress",
    love: "chemistry mixed with conflict, testing whether attraction can survive difference",
    career: "crowded competition, internal rivalry, or a stressful proving ground",
    finance: "resource pressure that forces sharper priorities",
    health: "stress carried as agitation, tension, and overactivation",
    symbol: "the crossed staffs show energy colliding before it has learned to cooperate"
  },
  "six-of-wands": {
    focus: "recognition after effort and the social visibility that follows success",
    shadow: "needing external validation so badly that momentum becomes performance",
    love: "being chosen openly, or wanting visible reassurance of commitment",
    career: "public wins, endorsements, and reputation lift",
    finance: "confidence rising through measurable gains or trusted support",
    health: "improvement that restores morale as much as function",
    symbol: "the raised wand and crowd response show victory as a social event, not a private feeling"
  },
  "seven-of-wands": {
    focus: "holding your ground when momentum has made you newly visible",
    shadow: "living in defensive posture even when not every challenge deserves engagement",
    love: "protecting the relationship or your standards from outside pressure",
    career: "defending a position, idea, or lane you earned",
    finance: "guarding resources and boundaries under competitive conditions",
    health: "preserving gains through consistency and selective effort",
    symbol: "the elevated stance shows the strain and necessity of defending a hard-won position"
  },
  "eight-of-wands": {
    focus: "rapid movement, quick communication, and events unfolding faster than expected",
    shadow: "confusing speed with alignment and outrunning reflection",
    love: "fast-moving contact, messages, and sudden acceleration",
    career: "launch velocity, quick approvals, or deadlines arriving all at once",
    finance: "rapid transactions that reward responsiveness but punish sloppiness",
    health: "a phase where the body reacts quickly to both strain and support",
    symbol: "the flight of wands captures momentum already in motion, leaving little room for hesitation"
  },
  "nine-of-wands": {
    focus: "resilience shaped by memory, fatigue, and refusal to quit",
    shadow: "guarding so intensely that protection hardens into isolation",
    love: "staying open enough to connect while still carrying old defenses",
    career: "grit at the late stage of a demanding cycle",
    finance: "maintaining discipline when scarcity-memory keeps the nervous system braced",
    health: "recovery that requires rest as much as determination",
    symbol: "the bandaged sentinel shows endurance, vigilance, and the cost of staying prepared"
  },
  "ten-of-wands": {
    focus: "carrying too much because responsibility has outgrown proportion",
    shadow: "mistaking indispensability for purpose and overload for virtue",
    love: "emotional labor imbalance and relationships strained by unequal burden",
    career: "burnout risk from overownership, delegation failure, or sustained overload",
    finance: "financial pressure tied to too many obligations at once",
    health: "the body signaling that strain has become cumulative",
    symbol: "the bundled load makes visible what happens when fire is forced to carry earth-like weight"
  },
  "page-of-wands": {
    focus: "curious fire testing its voice through experiments, invitations, and bold first moves",
    shadow: "enthusiasm that outruns discipline and starts more than it can sustain",
    love: "playful initiation and attraction driven by discovery",
    career: "creative scouting, prototyping, and fresh opportunities",
    finance: "small but promising risks taken to learn the terrain",
    health: "renewed appetite for movement and engagement",
    symbol: "the page's upright wand shows fire as message, signal, and appetite for possibility"
  },
  "knight-of-wands": {
    focus: "hot momentum that wants conquest, travel, and immediate experience",
    shadow: "restlessness, inconsistency, and the tendency to treat intensity as proof",
    love: "passionate pursuit that needs maturity to become trustworthy",
    career: "ambitious forward push, rapid action, and bold execution",
    finance: "high-risk enthusiasm that needs guardrails",
    health: "surges of energy that can tip into overextension",
    symbol: "the charging rider expresses fire in motion, impressive but not automatically sustainable"
  },
  "queen-of-wands": {
    focus: "magnetic confidence rooted in self-trust and lively presence",
    shadow: "needing to stay adored, relevant, or in command of the room",
    love: "warmth, charisma, and standards that invite rather than chase",
    career: "creative leadership powered by conviction and visibility",
    finance: "resource decisions made from confidence instead of fear",
    health: "vitality strengthened by embodiment and self-belief",
    symbol: "the queen's poised fire turns charisma into an atmosphere others can feel"
  },
  "king-of-wands": {
    focus: "visionary authority that knows how to mobilize people around a future",
    shadow: "ego-led leadership, impatience, and grand plans unsupported by discipline",
    love: "strong attraction mixed with the need for relational maturity",
    career: "entrepreneurial command, strategic initiative, and bold direction-setting",
    finance: "big-picture confidence that still needs stewardship",
    health: "using willpower wisely rather than trying to dominate the body",
    symbol: "the king's seated fire shows ambition translated into direction, command, and influence"
  },
  "ace-of-cups": {
    focus: "an emotional opening that softens the system and makes receptivity possible",
    shadow: "overflow without container, where feeling cannot yet be integrated",
    love: "fresh tenderness, confession, and genuine emotional availability",
    career: "meaning, morale, and intuitive alignment returning to work",
    finance: "spending and earning choices shaped by emotional truth",
    health: "restoration through gentleness, hydration, and emotional release",
    symbol: "the overflowing cup shows feeling arriving as blessing, vulnerability, and invitation"
  },
  "two-of-cups": {
    focus: "mutual recognition and the relief of emotional reciprocity",
    shadow: "overfusing with another person and mistaking chemistry for wholeness",
    love: "bonding, attraction, and clear two-way exchange",
    career: "strong partnership, client fit, or alliance-building",
    finance: "agreements that work because trust and terms meet cleanly",
    health: "healing supported by attunement and relational safety",
    symbol: "the paired cups and mirrored figures show intimacy as exchange rather than fantasy"
  },
  "three-of-cups": {
    focus: "joy shared in community, friendship, and emotional circulation",
    shadow: "avoiding depth by staying in celebration mode or social busyness",
    love: "friendship as a foundation, social support, and emotional lightness",
    career: "team cohesion, informal collaboration, and morale-rich environments",
    finance: "shared resources or spending tied to community and celebration",
    health: "recovery supported by laughter, company, and emotional belonging",
    symbol: "the lifted cups show feeling becoming communal, festive, and mutually reinforcing"
  },
  "four-of-cups": {
    focus: "emotional flatness that hides a deeper need for renewed contact",
    shadow: "withdrawing from life because present offerings fail to match an internal ideal",
    love: "disengagement, boredom, or difficulty receiving available affection",
    career: "apathy, misfit, or lost meaning inside routine work",
    finance: "emotional detachment affecting motivation around money",
    health: "low mood, numbness, or fatigue asking for gentle re-engagement",
    symbol: "the untouched cup emphasizes how dissatisfaction can block perception of what is still available"
  },
  "five-of-cups": {
    focus: "grief that narrows vision toward what has been spilled or lost",
    shadow: "identifying so fully with disappointment that recovery feels like betrayal of the wound",
    love: "mourning, regret, and relational focus on what did not work",
    career: "setbacks, missed chances, or discouragement after emotional investment",
    finance: "loss-consciousness shaping present decisions",
    health: "the emotional body processing sorrow and depletion",
    symbol: "the spilled cups and remaining vessels show grief's tunnel vision and the possibility beyond it"
  },
  "six-of-cups": {
    focus: "memory, tenderness, and the emotional pull of what once felt safe",
    shadow: "idealizing the past so heavily that the present cannot compete",
    love: "nostalgia, sweet familiarity, and old bonds resurfacing",
    career: "returning to foundational skills or earlier motivations",
    finance: "money stories inherited from childhood or family memory",
    health: "comfort, soothing routines, and care linked to familiarity",
    symbol: "the exchanged cups evoke innocence, remembrance, and the emotional residue of earlier life"
  },
  "seven-of-cups": {
    focus: "imagination branching into many options before reality has sorted them",
    shadow: "fantasy, escapism, and desire diffused across too many mirages",
    love: "mixed projections, alluring options, and uncertainty about what is real",
    career: "big ideas that still need narrowing and proof",
    finance: "confusion caused by too many enticing but ungrounded options",
    health: "mental-emotional fog requiring simplification and rest",
    symbol: "the many cups dramatize abundance of image and desire before discernment enters"
  },
  "eight-of-cups": {
    focus: "walking away from what once mattered because the soul has outgrown it",
    shadow: "leaving prematurely to avoid harder emotional work",
    love: "departing from a bond that no longer nourishes deeply enough",
    career: "choosing meaning over mere continuation",
    finance: "releasing material arrangements that no longer fit inner truth",
    health: "healing through withdrawal from draining environments",
    symbol: "the departing figure shows emotional maturity as willingness to leave partial fulfillment behind"
  },
  "nine-of-cups": {
    focus: "satisfaction, pleasure, and the feeling of enoughness when desire lands well",
    shadow: "self-indulgence, complacency, or pleasure detached from deeper reciprocity",
    love: "contentment, attraction, and getting what was sincerely wanted",
    career: "enjoying the results of work and favorable reception",
    finance: "comfort, treats, and material ease used well or poorly",
    health: "relishing recovery and stable emotional satisfaction",
    symbol: "the arranged cups show fulfilled desire made visible and available for enjoyment"
  },
  "ten-of-cups": {
    focus: "emotional harmony broad enough to include family, belonging, and future continuity",
    shadow: "chasing a perfect emotional picture and denying the work needed to sustain it",
    love: "shared happiness, family vision, and emotional homecoming",
    career: "team culture or mission alignment that feels deeply human",
    finance: "resources used to support long-term collective wellbeing",
    health: "healing amplified by emotional safety and relational support",
    symbol: "the rainbow and gathered figures show feeling ripening into shared fulfillment"
  },
  "page-of-cups": {
    focus: "sensitive openness, unexpected feeling, and imagination arriving as a message",
    shadow: "emotional immaturity, hypersensitivity, or confusing mood with truth",
    love: "soft beginnings, shy disclosure, and emotional curiosity",
    career: "creative intuition, new inspiration, and emotionally intelligent learning",
    finance: "money choices influenced by hope, sensitivity, and early intuition",
    health: "gentle healing through emotional acknowledgment and creative expression",
    symbol: "the page's surprising fish turns the ordinary cup into a messenger from the unconscious"
  },
  "knight-of-cups": {
    focus: "romantic pursuit, idealism, and emotion moving in deliberate style",
    shadow: "charm without steadiness or promises made from mood rather than character",
    love: "courtship, pursuit, and emotionally expressive movement",
    career: "creative proposals, diplomacy, and values-led outreach",
    finance: "following a vision that needs realism to remain viable",
    health: "the body responding to beauty, rest, and emotional tone",
    symbol: "the rider carries feeling forward with elegance, intention, and obvious vulnerability"
  },
  "queen-of-cups": {
    focus: "deep attunement, compassion, and emotional intelligence with boundaries",
    shadow: "absorbing too much, blurring lines, or caretaking through self-erasure",
    love: "empathic intimacy and emotionally mature receptivity",
    career: "strong relational judgment, care work, and nuanced listening",
    finance: "resource choices that reflect values, care, and emotional clarity",
    health: "nervous-system repair through softness, privacy, and attunement",
    symbol: "the queen's sealed cup suggests feeling held with reverence rather than spilled everywhere"
  },
  "king-of-cups": {
    focus: "emotional composure that can feel deeply without losing center",
    shadow: "withholding, emotional distance, or overmanaging affect",
    love: "steady devotion, emotional leadership, and mature containment",
    career: "calm authority under pressure and strong relational governance",
    finance: "measured decisions made without panic or sentimentality",
    health: "stability through emotional regulation and mature pacing",
    symbol: "the king amid water shows feeling surrounding authority without overturning it"
  },
  "ace-of-swords": {
    focus: "a breakthrough of clarity that cuts through confusion at the source",
    shadow: "truth delivered without wisdom, turning insight into unnecessary harm",
    love: "direct conversation, naming reality, and mental honesty",
    career: "sharp strategy, decisive insight, and clean problem definition",
    finance: "clarity about priorities, terms, and financial facts",
    health: "diagnostic insight, mental clarity, and clearer self-observation",
    symbol: "the crowned sword signals truth arriving with force, precision, and consequence"
  },
  "two-of-swords": {
    focus: "stalemate maintained because feeling and thought are not yet reconciled",
    shadow: "avoiding choice by numbing, postponing, or overbalancing",
    love: "emotional deadlock, guardedness, and postponed conversations",
    career: "indecision between viable but conflicting paths",
    finance: "hesitating over choices that require clearer priorities",
    health: "tension held through suppression rather than release",
    symbol: "the crossed blades and blindfold show peace preserved through temporary refusal to choose"
  },
  "three-of-swords": {
    focus: "pain made explicit, especially when truth and feeling collide",
    shadow: "reopening injury through rumination, accusation, or attachment to the wound",
    love: "heartbreak, disappointment, and difficult emotional truth",
    career: "painful feedback, separation, or a disillusioning realization",
    finance: "stress linked to loss, betrayal, or sobering facts",
    health: "the body carrying grief, stress, and emotional shock",
    symbol: "the pierced heart leaves no room for euphemism, making emotional pain visible and undeniable"
  },
  "four-of-swords": {
    focus: "rest, retreat, and mental quiet after strain or conflict",
    shadow: "mistaking withdrawal for permanent solution or delaying re-entry too long",
    love: "space to heal, reflect, and stop repeating charged patterns",
    career: "necessary pause, sabbatical energy, or strategic downtime",
    finance: "holding steady rather than forcing new moves",
    health: "recovery, sleep, and nervous-system decompression",
    symbol: "the resting figure turns the sword's sharpness toward stillness and repair"
  },
  "five-of-swords": {
    focus: "conflict where winning and integrity have drifted apart",
    shadow: "using intellect, leverage, or tactics in ways that poison trust",
    love: "arguments that leave resentment even when someone 'wins'",
    career: "power struggles, politics, and corrosive competition",
    finance: "short-term gain achieved through damaging dynamics",
    health: "stress from hostility, hypervigilance, and mental aggression",
    symbol: "the taken swords and departing figures reveal the loneliness of hollow victory"
  },
  "six-of-swords": {
    focus: "transition toward calmer waters, even if the crossing is emotionally muted",
    shadow: "carrying the old story so fully that a new shore cannot register",
    love: "moving out of relational turmoil toward something steadier",
    career: "leaving a difficult environment through deliberate transition",
    finance: "improvement through careful relocation, simplification, or restructuring",
    health: "incremental recovery that values quiet progress",
    symbol: "the boat journey shows healing as passage, not instant arrival"
  },
  "seven-of-swords": {
    focus: "strategy under pressure, including what is hidden, withheld, or taken sideways",
    shadow: "deception, self-protective dishonesty, or cleverness detached from ethics",
    love: "secrecy, evasiveness, or fear-driven self-protection",
    career: "backchannel tactics, stealth moves, or the need for discretion",
    finance: "protecting assets carefully without sliding into avoidance or concealment",
    health: "stress generated by unspoken fear or constant mental guarding",
    symbol: "the partial theft scene shows intelligence operating without full transparency"
  },
  "eight-of-swords": {
    focus: "mental confinement sustained by fear, habit, and narrowed perception",
    shadow: "believing the cage is absolute when part of it is interpretive",
    love: "feeling trapped by scripts, fear, or relational helplessness",
    career: "self-limiting beliefs constricting decision-making and agency",
    finance: "scarcity thinking turning options invisible",
    health: "anxiety patterns tightening the body and imagination",
    symbol: "the bound figure reveals how restriction can be real and still partly psychological"
  },
  "nine-of-swords": {
    focus: "night mind, worry loops, and the pain of thoughts that will not settle",
    shadow: "turning fear into certainty and isolation into proof",
    love: "anxious overthinking, guilt, and relational catastrophizing",
    career: "stress spirals, insomnia, and dread about outcomes",
    finance: "money anxiety that becomes mentally totalizing",
    health: "sleep disruption, nervous exhaustion, and amplified fear states",
    symbol: "the midnight scene captures suffering that becomes largest when carried alone"
  },
  "ten-of-swords": {
    focus: "an ending so complete that denial no longer helps",
    shadow: "treating collapse as total identity rather than brutal but finite conclusion",
    love: "final rupture, painful truth, or the end of a damaging pattern",
    career: "burned-out cycles ending, layoffs, or clear professional dead ends",
    finance: "hitting the point where the old financial pattern cannot continue",
    health: "deep exhaustion requiring radical honesty and reset",
    symbol: "the prone figure and many blades show overcompletion, finality, and the harsh clarity of rock bottom"
  },
  "page-of-swords": {
    focus: "alert curiosity, sharp observation, and a mind testing every edge",
    shadow: "defensiveness, suspicion, or information used without maturity",
    love: "careful watching, questioning, and guarded communication",
    career: "research, scrutiny, and intellectual agility at the learning stage",
    finance: "doing homework before committing and catching fine print",
    health: "monitoring patterns without tipping into obsession",
    symbol: "the raised blade and windswept stance portray vigilance before mastery"
  },
  "knight-of-swords": {
    focus: "decisive motion powered by conviction, urgency, and mental intensity",
    shadow: "blunt force, haste, and acting before nuance has entered the room",
    love: "fast pursuit, hard conversations, and volatile directness",
    career: "charging toward an objective with high cognitive aggression",
    finance: "making rapid decisions that need stronger brakes",
    health: "stress patterns linked to speed, tension, and overdrive",
    symbol: "the charging horse turns thought into velocity, impressive and potentially destabilizing"
  },
  "queen-of-swords": {
    focus: "clear boundaries, mature discernment, and truth without ornament",
    shadow: "coolness, overprotection, or cutting too quickly to vulnerability",
    love: "honest standards, direct communication, and earned trust",
    career: "excellent judgment, editing, strategy, and principled decision-making",
    finance: "clear-eyed assessment free from sentimentality",
    health: "benefit from precision, simplicity, and firm limits",
    symbol: "the queen's upright blade shows clarity held with dignity rather than spectacle"
  },
  "king-of-swords": {
    focus: "intellectual authority, principled judgment, and command through clarity",
    shadow: "detachment, harsh certainty, or leadership that overvalues logic at human expense",
    love: "truth, structure, and emotionally mature communication",
    career: "executive judgment, policy thinking, and decisive analysis",
    finance: "rational planning, legal clarity, and strong oversight",
    health: "recovery helped by accurate information and disciplined thinking",
    symbol: "the king's elevated sword conveys law, order, and the burden of clear judgment"
  },
  "ace-of-pentacles": {
    focus: "a tangible opening, resource seed, or practical chance with real staying power",
    shadow: "ignoring a workable opportunity or reducing possibility to pure materialism",
    love: "building trust through dependable action and real-world investment",
    career: "a new job, offer, skill path, or business foothold",
    finance: "fresh income potential, savings opportunity, or grounded investment",
    health: "support through routine, nourishment, and practical care",
    symbol: "the offered pentacle frames abundance as something concrete enough to steward"
  },
  "two-of-pentacles": {
    focus: "juggling changing demands while trying to stay responsive and solvent",
    shadow: "normalizing instability and calling it flexibility",
    love: "balancing relationship needs with other life pressures",
    career: "multitasking, fluctuating priorities, and adaptive scheduling",
    finance: "cash-flow management and constant adjustment",
    health: "maintaining equilibrium amid irregular demands",
    symbol: "the looping motion shows earth in motion, stability sought through skillful adaptation"
  },
  "three-of-pentacles": {
    focus: "craft improving through collaboration, feedback, and visible standards",
    shadow: "ego, poor coordination, or talent unsupported by teamwork",
    love: "building partnership through practical cooperation",
    career: "apprenticeship, teamwork, and respected skill development",
    finance: "gains coming from competence and reliable collaboration",
    health: "steady improvement through expert support and repeatable practice",
    symbol: "the shared work scene makes quality a collective, not solitary, achievement"
  },
  "four-of-pentacles": {
    focus: "holding tightly to security, position, or resources already acquired",
    shadow: "clinging so hard that stability turns brittle and ungenerous",
    love: "guarded attachment, possessiveness, or fear of vulnerability",
    career: "protecting role or status rather than evolving",
    finance: "saving, hoarding, or fear-based control around money",
    health: "tension from overcontainment, rigidity, and holding patterns",
    symbol: "the clenched pentacles show the double edge of protection and constriction"
  },
  "five-of-pentacles": {
    focus: "material strain, exclusion, and the loneliness of feeling unsupported",
    shadow: "internalizing hardship as proof of unworthiness or permanent abandonment",
    love: "feeling left out, neglected, or unsupported in tangible ways",
    career: "job insecurity, underrecognition, or resource scarcity",
    finance: "shortage, debt pressure, or fear around basic stability",
    health: "low energy and stress magnified by practical insecurity",
    symbol: "the cold exterior scene captures hardship and the painful question of where support is"
  },
  "six-of-pentacles": {
    focus: "exchange, generosity, and the ethics of giving and receiving",
    shadow: "unequal power disguised as generosity or dependence disguised as need",
    love: "reciprocity made visible through action and support",
    career: "fair pay, mentorship, and resource distribution",
    finance: "cash flow shaped by generosity, debt, or unequal leverage",
    health: "support systems that help restore balance",
    symbol: "the scales and coins show material care inseparable from questions of power"
  },
  "seven-of-pentacles": {
    focus: "cultivation, patience, and the sober review of what effort is actually producing",
    shadow: "staying invested in a slow process without periodically re-evaluating whether it still deserves you",
    love: "asking whether the relationship is growing in the right direction",
    career: "assessment point inside a long build cycle",
    finance: "waiting, reviewing returns, and checking sustainability",
    health: "slow gains that require patience and honest tracking",
    symbol: "the pause before harvest shows effort meeting time, uncertainty, and appraisal"
  },
  "eight-of-pentacles": {
    focus: "repetition, apprenticeship, and skill built through humble consistency",
    shadow: "grinding mechanically without remembering why the work matters",
    love: "care shown through effort, maintenance, and practical devotion",
    career: "mastery through deliberate practice and quality control",
    finance: "steady earnings and improvement through disciplined work",
    health: "results earned through routine, repetition, and care for basics",
    symbol: "the bench and repeated pentacles present mastery as something made, not wished for"
  },
  "nine-of-pentacles": {
    focus: "self-sufficiency, refinement, and pleasure earned through patient stewardship",
    shadow: "comfort becoming isolation or independence hardening into emotional distance",
    love: "high standards, autonomy, and attraction to mature stability",
    career: "enjoying the rewards of competence and cultivated taste",
    finance: "material comfort, savings, and well-managed abundance",
    health: "wellbeing supported by environment, routine, and self-respect",
    symbol: "the cultivated garden shows abundance as an atmosphere created through long attention"
  },
  "ten-of-pentacles": {
    focus: "legacy, lineage, and wealth or stability measured across generations",
    shadow: "treating security, status, or family structure as more important than vitality",
    love: "commitment shaped by long-term family and home considerations",
    career: "institutional success, continuity, and durable enterprise",
    finance: "inheritance, asset-building, and intergenerational planning",
    health: "the body shaped by long-term habits, family patterns, and environment",
    symbol: "the established household makes abundance social, structural, and inherited"
  },
  "page-of-pentacles": {
    focus: "practical learning, careful beginnings, and respect for what can be built over time",
    shadow: "getting stuck in preparation or reducing growth to productivity alone",
    love: "showing care through reliability, learning, and tangible effort",
    career: "study, entry-level skill building, and disciplined opportunity",
    finance: "careful saving and realistic learning around money",
    health: "recovery grounded in basics, tracking, and repeatable routines",
    symbol: "the page studying the pentacle shows earth approached with seriousness and curiosity"
  },
  "knight-of-pentacles": {
    focus: "steady labor, discipline, and progress measured in dependable increments",
    shadow: "stagnation, overcaution, or devotion to routine without flexibility",
    love: "slow but trustworthy commitment built through consistency",
    career: "reliability, operations strength, and patient execution",
    finance: "careful accumulation and low-drama stewardship",
    health: "improvement through discipline, sleep, food, and habit",
    symbol: "the still rider and grounded horse show power expressed through patience rather than speed"
  },
  "queen-of-pentacles": {
    focus: "nurturing stability, embodied wisdom, and material care with warmth",
    shadow: "caretaking becoming overcontrol, resentment, or self-neglect",
    love: "domestic steadiness, sensual care, and dependable support",
    career: "resource stewardship, people care, and grounded leadership",
    finance: "practical abundance managed with realism and generosity",
    health: "healing through nourishment, environment, and sustainable routines",
    symbol: "the queen holding the pentacle makes care tangible, embodied, and materially intelligent"
  },
  "king-of-pentacles": {
    focus: "material mastery, stewardship, and authority rooted in real-world competence",
    shadow: "greed, rigidity, or overidentifying worth with possession and control",
    love: "stability, protection, and commitment shown through provision",
    career: "executive steadiness, ownership, and resource command",
    finance: "wealth-building, asset management, and long-term security thinking",
    health: "support through discipline, consistency, and practical maintenance",
    symbol: "the king's settled authority shows earth at its most capable, productive, and entrenched"
  }
};

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cleanName(name) {
  return name.replace(/^The /, "");
}

function getMinorBlueprint(card) {
  const suit = suitData[card.suit];
  const stage = card.number <= 10 ? numberMeanings[card.number] : courtData[card.number];
  const label = card.number <= 10 ? card.name : `${stage.rank} of ${card.suit}`;
  return { suit, stage, label };
}

function generateMinorMeanings(card) {
  const { suit, stage, label } = getMinorBlueprint(card);
  const detail = minorDetails[card.slug];
  const uprightGeneral = `${label} works through ${suit.domain}. ${stage.uprightCore} More specifically, ${card.name} points to ${detail.focus}. In practice, upright ${card.name} favors ${suit.gift}, but in this card that gift is expressed through ${detail.career}. It helps when you need to move the situation through the ${suit.element} element in a cleaner way: with enough intention to make the energy useful, and enough self-awareness to stop it from turning into ${suit.shadow}.`;
  const reversedGeneral = `${label} still concerns ${suit.domain}, but the current expression is strained. ${stage.reversedCore} Reversed ${card.name} often appears when ${detail.shadow}. The ${suit.element} element is either overdriven or undernourished, creating avoidable drag. The card asks for a reset in pacing, honesty, and method so that the suit can function without collapsing into ${suit.shadow}.`;

  const love = {
    upright: `${card.name} upright in love highlights ${detail.love}. It brings ${suit.domain} into close relationships in a way that matches the card's stage of ${stage.stage}. Healthy progress comes from naming what is real, responding consistently, and letting connection develop through behavior rather than fantasy alone.`,
    reversed: `${card.name} reversed in love suggests that the shadow side of ${detail.love} is active. Mixed signals, uneven effort, avoidance, or emotional spillover may be distorting the bond. The task is to stabilize the pattern instead of escalating it: clarify expectations, reduce reactivity, and see whether the connection can hold truth without performance.`
  };

  const career = {
    upright: `${card.name} upright in career points to ${detail.career}. It is useful for projects that need the stage of ${stage.stage}, but it also asks you to express ${suit.domain} through mature method rather than impulse. Progress comes from applying the element deliberately instead of waiting for motivation to organize itself.`,
    reversed: `${card.name} reversed in career shows friction around ${detail.career}. The problem may be timing, execution, team fit, overextension, or poor judgment about where effort belongs. Rather than pushing harder by reflex, reassess the workflow and use the card to identify which part of the process is no longer coherent.`
  };

  const finance = {
    upright: `${card.name} upright in finance describes money through ${detail.finance}. It favors decisions that respect the card's stage of ${stage.stage}: start carefully, share clearly, defend wisely, or complete what is already carrying weight. The best results come from practical consistency rather than impulsive correction.`,
    reversed: `${card.name} reversed in finance warns that ${detail.finance} is being handled through the suit's shadow side. Spending, withholding, indecision, or misplaced urgency may be creating strain. Use the card as feedback about behavior, not fate: simplify the picture, tighten the method, and make one grounded adjustment at a time.`
  };

  const health = {
    upright: `${card.name} upright in health points to ${detail.health}. The message is usually about rhythm: where to mobilize, where to soften, and how to support the stage of ${stage.stage} without forcing it. Small consistent practices will do more here than dramatic interventions.`,
    reversed: `${card.name} reversed in health suggests the ${suit.element} element is out of balance around ${detail.health}. Stress may be accumulating through overdrive, suppression, irregular routines, or poor recovery. The card encourages measured recalibration: reduce extremes, listen early, and build conditions that help the body regain trust in its own pace.`
  };

  const keywords = {
    upright: [
      ...stage.uprightKeywords,
      ...suit.uprightKeywords
    ].slice(0, 5),
    reversed: [
      ...stage.reversedKeywords,
      ...suit.reversedKeywords
    ].slice(0, 5)
  };

  const symbolism = `${suit.symbolism} In ${card.name}, the emphasis falls on ${stage.stage}, and specifically on the image of ${detail.symbol}. This shows how the suit behaves at that exact point in its cycle.`;

  const yesno = card.number <= 10
    ? card.number <= 6
      ? "Yes, if you stay aligned with the card's lesson."
      : "Maybe. The outcome depends on how well you handle the present test."
    : "Yes, if you embody the card's maturity instead of its shadow.";

  return {
    keywords,
    yesno,
    symbolism,
    meaning: {
      upright: {
        general: uprightGeneral,
        love: love.upright,
        career: career.upright,
        finance: finance.upright,
        health: health.upright
      },
      reversed: {
        general: reversedGeneral,
        love: love.reversed,
        career: career.reversed,
        finance: finance.reversed,
        health: health.reversed
      }
    }
  };
}

function generateMajorMeanings(card) {
  const meta = majorArcana[card.slug];
  return {
    keywords: {
      upright: meta.uprightKeywords,
      reversed: meta.reversedKeywords
    },
    yesno: card.slug === "death" || card.slug === "the-tower"
      ? "Not yet. A real change of structure is required first."
      : card.slug === "the-moon"
        ? "Maybe. Wait for more clarity."
        : "Yes, if you respond with maturity to the card's lesson.",
    symbolism: meta.symbolism,
    meaning: {
      upright: {
        general: `${meta.uprightText} At its core, ${card.name} is about ${meta.theme}.`,
        love: `${card.name} upright in love brings the lesson of ${meta.theme} into relationship. It supports intimacy that can tolerate honesty, growth, and mutual responsibility. If you are dating, it points to a relationship dynamic that becomes clearer when both people stop managing perception and start engaging the truth of what they want.`,
        career: `${card.name} upright in career shows the professional value of ${meta.theme}. This is the card's contribution to work: it asks you to choose the right pattern, not just the loud one. It favors decisions that align inner conviction with outer structure so that effort becomes sustainable and credible.`,
        finance: `${card.name} upright in finance asks you to handle money in a way that reflects ${meta.theme}. The guidance is strategic rather than magical: see the real pattern, respect timing, and make financial choices that support long-term integrity instead of short-term emotional relief.`,
        health: `${card.name} upright in health frames wellbeing through ${meta.theme}. The body benefits when you cooperate with the card's lesson instead of fighting it. Often that means reducing inner contradiction, changing pace, or building a more honest relationship with stress, care, and recovery.`
      },
      reversed: {
        general: `${meta.reversedText} Reversed, ${card.name} shows the shadow pattern around ${meta.theme}: what happens when the lesson is resisted, exaggerated, or handled unconsciously.`,
        love: `${card.name} reversed in love suggests that the relationship field is catching the shadow side of ${meta.theme}. You may be dealing with avoidance, projection, poor boundaries, or an attachment to a dynamic that no longer supports growth. Clearer choices and plainer communication matter more than chemistry alone here.`,
        career: `${card.name} reversed in career shows the cost of mishandling ${meta.theme} at work. The issue may be poor timing, misuse of authority, confusion about direction, or clinging to a structure that has already stopped serving. The card asks for correction through honesty and method, not through panic.`,
        finance: `${card.name} reversed in finance warns that the shadow side of ${meta.theme} is affecting material decisions. Fear, compulsion, denial, or overcontrol may be shaping the money story. Slow the pattern down enough to see it clearly, then rebuild from what is concrete and sustainable.`,
        health: `${card.name} reversed in health suggests that the system is carrying the strain of resisted change around ${meta.theme}. The card does not replace medical judgment, but it does point to the psychological style affecting recovery: avoidance, overdrive, depletion, or difficulty listening to limits.`
      }
    }
  };
}

function rewriteCard(card) {
  if (card.arcana === "major") {
    return {
      ...card,
      ...generateMajorMeanings(card)
    };
  }

  return {
    ...card,
    ...generateMinorMeanings(card)
  };
}

function main() {
  const cards = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const rewritten = cards.map(rewriteCard);
  fs.writeFileSync(dataPath, `${JSON.stringify(rewritten, null, 2)}\n`, "utf8");
  console.log(`Rewrote ${rewritten.length} tarot cards at ${dataPath}`);
}

main();
