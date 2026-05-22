const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, cosineSimilarity, buildTfIdf, findSimilar } = require('../utils/similarity');

describe('tokenize', () => {
  test('lowercases and splits on punctuation', () => {
    const tokens = tokenize('Hello, World!');
    assert.deepEqual(tokens, ['hello', 'world']);
  });

  test('removes stop words', () => {
    const tokens = tokenize('the cat sat on the mat');
    assert.ok(!tokens.includes('the'));
    assert.ok(!tokens.includes('on'));
    assert.ok(tokens.includes('cat'));
    assert.ok(tokens.includes('sat'));
    assert.ok(tokens.includes('mat'));
  });

  test('removes single-character tokens', () => {
    const tokens = tokenize('a b c dog');
    assert.ok(!tokens.includes('b'));
    assert.ok(!tokens.includes('c'));
    assert.ok(tokens.includes('dog'));
  });

  test('returns empty array for blank input', () => {
    assert.deepEqual(tokenize(''), []);
    assert.deepEqual(tokenize('   '), []);
  });
});

describe('cosineSimilarity', () => {
  test('identical vectors return ~1', () => {
    const vec = { cat: 0.5, dog: 0.5 };
    assert.ok(Math.abs(cosineSimilarity(vec, vec) - 1) < 1e-9);
  });

  test('completely disjoint vectors return 0', () => {
    assert.equal(cosineSimilarity({ cat: 1 }, { dog: 1 }), 0);
  });

  test('empty vectors return 0', () => {
    assert.equal(cosineSimilarity({}, {}), 0);
  });

  test('partially overlapping vectors return value between 0 and 1', () => {
    const sim = cosineSimilarity({ cat: 0.5, dog: 0.5 }, { cat: 0.5, fish: 0.5 });
    assert.ok(sim > 0 && sim < 1);
  });
});

describe('findSimilar', () => {
  const python = { title: 'Python programming', content: 'Python is great for scripting and data science' };
  const javascript = { title: 'JavaScript programming', content: 'JavaScript is used for web development and scripting' };
  const cooking = { title: 'Best pasta recipe', content: 'Boil pasta, add sauce, enjoy your meal' };
  const baking = { title: 'Chocolate cake recipe', content: 'Mix flour sugar eggs bake cake in oven' };

  test('returns candidates sorted by relevance', () => {
    const results = findSimilar(python, [javascript, cooking, baking]);
    // javascript shares "programming" and "scripting" with python — should rank first
    assert.equal(results[0].title, 'JavaScript programming');
  });

  test('topic-unrelated post scores lower than related post', () => {
    const results = findSimilar(python, [javascript, cooking]);
    assert.equal(results[0].title, 'JavaScript programming');
  });

  test('returns at most 5 results', () => {
    const candidates = Array.from({ length: 10 }, (_, i) => ({
      title: `Python scripting guide ${i}`,
      content: `Python scripting tutorial number ${i} with examples`,
    }));
    const results = findSimilar(python, candidates);
    assert.ok(results.length <= 5);
  });

  test('returns empty array when no candidates', () => {
    assert.deepEqual(findSimilar(python, []), []);
  });

  test('excludes posts with zero similarity', () => {
    // "zzz" tokens share nothing with python post tokens
    const noise = { title: 'zzz', content: 'zzz qqq rrr mmm' };
    const results = findSimilar(python, [noise]);
    assert.equal(results.length, 0);
  });
});
