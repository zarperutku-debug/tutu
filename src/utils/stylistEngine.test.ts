import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STYLE_PRESETS,
  clampSliderPosition,
  parseRevisionIntent,
  mergeWardrobeWithRevisions,
  calculateWardrobeSummary,
  formatTRY,
} from './stylistEngine';

test('clampSliderPosition bounds slider values between 5 and 95', () => {
  assert.equal(clampSliderPosition(50), 50);
  assert.equal(clampSliderPosition(0), 5);
  assert.equal(clampSliderPosition(-20), 5);
  assert.equal(clampSliderPosition(100), 95);
  assert.equal(clampSliderPosition(Number.NaN), 50);
});

test('parseRevisionIntent detects trouser tapering and white sneaker swap from Turkish prompt', () => {
  const prompt = 'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap';
  const result = parseRevisionIntent(prompt, 'old-money');

  assert.equal(result.visualAdjustments.taperTrousers, true);
  assert.equal(result.visualAdjustments.whiteSneakers, true);
  assert.equal(result.detectedChanges.length, 2);
  assert.equal(result.injectedWardrobeItems.length, 2);

  const hasTrousers = result.injectedWardrobeItems.some((i) => i.category === 'Alt Giyim' && i.isRevisionHighlight);
  const hasShoes = result.injectedWardrobeItems.some((i) => i.category === 'Ayakkabı' && i.isRevisionHighlight);
  assert.equal(hasTrousers, true);
  assert.equal(hasShoes, true);

  const hasRevisedHotspot = result.updatedHotspots.some((h) => h.isRevised === true);
  assert.equal(hasRevisedHotspot, true);
});

test('mergeWardrobeWithRevisions replaces matching garment categories and preserves other items', () => {
  const baseItems = STYLE_PRESETS['old-money'].wardrobeItems;
  const revision = parseRevisionIntent('Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap', 'old-money');
  const merged = mergeWardrobeWithRevisions(baseItems, revision.injectedWardrobeItems);

  assert.equal(merged.length, baseItems.length);
  assert.equal(merged[0].isRevisionHighlight, true);
  assert.equal(merged[1].isRevisionHighlight, true);
});

test('calculateWardrobeSummary applies 12% bundle discount for 3+ items and free shipping above 5000 TRY', () => {
  const items = STYLE_PRESETS['smart-casual'].wardrobeItems;
  const summarySingle = calculateWardrobeSummary([
    { item: items[0], selectedSize: '48', quantity: 1 },
  ]);
  assert.equal(summarySingle.itemCount, 1);
  assert.equal(summarySingle.qualifiesForBundleDiscount, false);
  assert.equal(summarySingle.bundleDiscountTRY, 0);
  assert.equal(summarySingle.shippingTRY, 0);

  const summaryBundle = calculateWardrobeSummary([
    { item: items[0], selectedSize: '48', quantity: 1 },
    { item: items[1], selectedSize: '32', quantity: 1 },
    { item: items[2], selectedSize: '42', quantity: 1 },
  ]);
  assert.equal(summaryBundle.itemCount, 3);
  assert.equal(summaryBundle.qualifiesForBundleDiscount, true);
  assert.ok(summaryBundle.bundleDiscountTRY > 0);
  assert.equal(summaryBundle.totalTRY, summaryBundle.subtotalTRY - summaryBundle.bundleDiscountTRY);
});

test('formatTRY formats Turkish Lira currency cleanly', () => {
  const formatted = formatTRY(8450);
  assert.ok(formatted.includes('8.450') || formatted.includes('8450'));
});
