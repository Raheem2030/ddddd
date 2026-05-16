export const audioFiles = [
  "Araliaceae.mp3",
  "Asteraceae.mp3",
  "Beta vulgaris.mp3",
  "Blantaginaceae.mp3",
  "Chenopodiaceae.mp3",
  "Commelinaceae.mp3",
  "Compositae.mp3",
  "Cucurbita pepo.wav",
  "Cucurbitaceae.wav",
  "Euphorbiaceae.mp3",
  "Geraniaceae.mp3",
  "Graminaceae.mp3",
  "Iridaceae.mp3",
  "Iris germanica.mp3",
  "Lamiaceae.mp3",
  "Mentha viridis.mp3",
  "Moraceae.mp3",
  "Oleaceae.mp3",
  "Pinaceae.mp3",
  "Plantago lanceolata.mp3",
  "Poaceae.mp3",
  "Rosaceae.mp3",
  "Rutaceae.mp3",
  "Solanaceae.mp3",
  "Umbelliferae.mp3",
  "Urticaceae.mp3",
  "Zea  mays.mp3",
  "_Allium sativum.mp3",
  "_Citrus aurantum.mp3",
  "_Cydonia oblonga.mp3",
  "_Dahlia variabilis.mp3",
  "_Ecballium elaterium.mp3",
  "_Ficus elastic.mp3",
  "_Hedra helix.mp3",
  "_Lactuca sativa.mp3",
  "_Mentha piperta.mp3",
  "_Olea europaea.mp3",
  "_Pelargonium graveolens.mp3",
  "_Petroselinum sativa.mp3",
  "_Pinus Prutia.mp3",
  "_Pyrus communis.mp3",
  "_Ricinus communis.mp3",
  "_Solanum tuberosum.mp3",
  "_Tradescantia virginiana.mp3",
  "_Urtica urens.mp3",
];

function normalizeTerm(t: string) {
  let norm = t.toLowerCase().replace(/[^a-z]/g, "");
  // Handle some specific typos in filenames vs code
  norm = norm.replace("plantaginaceae", "blantaginaceae");
  norm = norm.replace("citrusaurantium", "citrusaurantum");
  norm = norm.replace("ficuselastica", "ficuselastic");
  return norm;
}

export function getAudioPath(term: string): string | null {
  const normalized = normalizeTerm(term);
  if (!normalized) return null;
  
  for (const file of audioFiles) {
    const fileNorm = normalizeTerm(file.replace(".mp3", "").replace(".wav", ""));
    if (fileNorm === normalized || normalized.includes(fileNorm) || fileNorm.includes(normalized)) {
      return `/audio/${file}`;
    }
  }
  return null;
}

export function playAudio(term: string) {
  const path = getAudioPath(term);
  if (path) {
    const audio = new Audio(path);
    audio.play().catch(e => console.error("Audio play error", e));
  } else {
    console.warn("No audio found for", term);
  }
}
