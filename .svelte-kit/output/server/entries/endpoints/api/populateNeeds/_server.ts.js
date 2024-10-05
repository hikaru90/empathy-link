import { p as pb } from "../../../../chunks/pocketbase.js";
const needs = [
  { nameEN: "Self-determination/Autonomy", nameDE: "Selbstbestimmung/Autonomie", category: "Self-determination/Autonomy" },
  { nameEN: "Determining for oneself what one does, how, when, why, etc.", nameDE: "Selbst bestimmen, was man tut, wie, wann, warum etc.", category: "Self-determination/Autonomy" },
  { nameEN: "Freedom, Independence", nameDE: "Freiheit, Unabhängigkeit", category: "Self-determination/Autonomy" },
  { nameEN: "Self-actualization, Learning, Inner Growth", nameDE: "Selbstentfaltung, Lernen, inneres Wachstum", category: "Self-determination/Autonomy" },
  { nameEN: "Self-efficacy", nameDE: "Selbstwirksamkeit", category: "Self-determination/Autonomy" },
  { nameEN: "Integrity/Alignment with oneself", nameDE: "Integrität/Stimmigkeit mit sich selbst", category: "Integrity/Alignment with oneself" },
  { nameEN: "Self-responsibility", nameDE: "Selbstverantwortung", category: "Integrity/Alignment with oneself" },
  { nameEN: "Authenticity", nameDE: "Authentizität", category: "Integrity/Alignment with oneself" },
  { nameEN: "Creativity", nameDE: "Kreativität", category: "Integrity/Alignment with oneself" },
  { nameEN: "Meaningfulness", nameDE: "Sinnhaftigkeit", category: "Integrity/Alignment with oneself" },
  { nameEN: "Self-worth, Self-respect", nameDE: "Selbstwert, Selbstrespekt", category: "Integrity/Alignment with oneself" },
  { nameEN: "Learning, Maturing, Growing", nameDE: "Lernen, Reifen, Wachsen", category: "Integrity/Alignment with oneself" },
  { nameEN: "Self-confidence", nameDE: "Selbstvertrauen", category: "Integrity/Alignment with oneself" },
  { nameEN: "Self-care", nameDE: "Selbstfürsorge", category: "Integrity/Alignment with oneself" },
  { nameEN: "Self-acceptance", nameDE: "Selbstannahme", category: "Integrity/Alignment with oneself" },
  { nameEN: "Mindfulness, Being awake, Being present", nameDE: "Achtsamkeit, wach sein, präsent sein", category: "Integrity/Alignment with oneself" },
  { nameEN: "Contributing to the enrichment of life", nameDE: "Zur Bereicherung des Lebens beitragen", category: "Contributing to the enrichment of life" },
  { nameEN: "Caring for the well-being of loved beings", nameDE: "Fürsorge, sich um das Wohl geliebter Wesen kümmern", category: "Contributing to the enrichment of life" },
  { nameEN: "Ensuring survival", nameDE: "Das Überleben sichern", category: "Contributing to the enrichment of life" },
  { nameEN: "Using one’s own energy meaningfully", nameDE: "Die eigene Energie sinnvoll einsetzen", category: "Contributing to the enrichment of life" },
  { nameEN: "Celebration", nameDE: "Feiern", category: "Celebration" },
  { nameEN: "Celebrating the creation of a fulfilling life and realized dreams", nameDE: "Die Gestaltung eines erfüllten Lebens und wahr gewordene Träume feiern", category: "Celebration" },
  { nameEN: "Expressing joy of life", nameDE: "Die Lebensfreude ausdrücken", category: "Celebration" },
  { nameEN: "Mourning, solemnly commemorating losses and farewells: of loved ones, dreams", nameDE: "Trauern, Verluste und Abschiede feierlich begehen: von geliebten Menschen, Träumen", category: "Celebration" },
  { nameEN: "Spirituality", nameDE: "Spiritualität", category: "Spirituality" },
  { nameEN: "Beauty", nameDE: "Schönheit", category: "Spirituality" },
  { nameEN: "Aesthetics", nameDE: "Ästhetik", category: "Spirituality" },
  { nameEN: "Harmony", nameDE: "Harmonie", category: "Spirituality" },
  { nameEN: "Mental orientation", nameDE: "Geistige Orientierung", category: "Spirituality" },
  { nameEN: "Order", nameDE: "Ordnung", category: "Spirituality" },
  { nameEN: "Clarity", nameDE: "Klarheit", category: "Spirituality" },
  { nameEN: "Inner peace", nameDE: "Innerer Frieden", category: "Spirituality" },
  { nameEN: "Healing", nameDE: "Heilung", category: "Spirituality" },
  { nameEN: "Awareness", nameDE: "Bewusstheit", category: "Spirituality" },
  { nameEN: "Sense of life, Meaningfulness", nameDE: "Lebenssinn, Sinnhaftigkeit", category: "Spirituality" },
  { nameEN: "Spiritual home", nameDE: "Spirituelles Zuhause", category: "Spirituality" },
  { nameEN: "Physical health", nameDE: "Körperliche Gesundheit", category: "Physical health" },
  { nameEN: "Air", nameDE: "Luft", category: "Physical health" },
  { nameEN: "Water", nameDE: "Wasser", category: "Physical health" },
  { nameEN: "Food", nameDE: "Nahrung", category: "Physical health" },
  { nameEN: "Movement", nameDE: "Bewegung", category: "Physical health" },
  { nameEN: "Rest, Relaxation, Sleep", nameDE: "Ruhe, Entspannung, Schlafen", category: "Physical health" },
  { nameEN: "Accommodation", nameDE: "Unterkunft", category: "Physical health" },
  { nameEN: "Warmth", nameDE: "Wärme", category: "Physical health" },
  { nameEN: "Physical closeness, Touch", nameDE: "Körperliche Nähe, Berührung", category: "Physical health" },
  { nameEN: "Sex life", nameDE: "Sexualleben", category: "Physical health" },
  { nameEN: "Protection from threatening beings: predators, pathogens, insects, aggressive people", nameDE: "Schutz vor bedrohlichen Lebewesen: Raubtieren, Krankheitserregern, Insekten, aggressiven Menschen", category: "Physical health" },
  { nameEN: "Interdependence/Contact with others", nameDE: "Interdependenz/Kontakt mit anderen", category: "Interdependence/Contact with others" },
  { nameEN: "Connection", nameDE: "Verbindung", category: "Interdependence/Contact with others" }
];
const prerender = false;
const GET = async ({ url, request }) => {
  for (const need of needs) {
    await pb.collection("needs").create(need);
  }
  return new Response("hi");
};
export {
  GET,
  prerender
};
