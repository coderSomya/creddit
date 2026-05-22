const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','was','are','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','i','you','he','she','we','they',
  'me','him','her','us','them','my','your','his','our','their','what','which',
  'who','how','when','where','why','not','no','so','if','as','up','out',
  'about','into','than','then','there','here','just','also','like','more',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function termFrequency(tokens) {
  const tf = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  const len = tokens.length || 1;
  for (const t in tf) tf[t] /= len;
  return tf;
}

function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;
  for (const k of keys) {
    const a = vecA[k] || 0;
    const b = vecB[k] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

// posts: array of { title, content }
// returns array of TF-IDF vectors in the same order (title weighted 2×)
function buildTfIdf(posts) {
  const tokensList = posts.map((p) =>
    tokenize(`${p.title} ${p.title} ${p.content}`)
  );

  const df = {};
  for (const tokens of tokensList) {
    for (const t of new Set(tokens)) df[t] = (df[t] || 0) + 1;
  }

  const N = posts.length;
  return tokensList.map((tokens) => {
    const tf = termFrequency(tokens);
    const tfidf = {};
    for (const t in tf) {
      tfidf[t] = tf[t] * Math.log((N + 1) / ((df[t] || 0) + 1));
    }
    return tfidf;
  });
}

// Given a target post and an array of candidate posts, returns candidates
// sorted by similarity (highest first), filtered to score > 0, capped at limit.
function findSimilar(target, candidates, limit = 5) {
  if (candidates.length === 0) return [];

  const corpus = [target, ...candidates];
  const vectors = buildTfIdf(corpus);
  const targetVec = vectors[0];

  const scored = candidates.map((post, i) => ({
    post,
    score: cosineSimilarity(targetVec, vectors[i + 1]),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).filter((s) => s.score > 0).map((s) => s.post);
}

module.exports = { tokenize, termFrequency, cosineSimilarity, buildTfIdf, findSimilar };
