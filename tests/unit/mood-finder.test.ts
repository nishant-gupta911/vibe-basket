/**
 * UNIT TESTS: Mood Finder Logic
 * Tests the mood profile matching and product scoring
 */

import { findMoodProfile, MOOD_PROFILES, PRODUCT_TAGS, BUDGET_STRATEGIES } from '../../backend/src/modules/ai/mood-profiles';

describe('Mood Finder - Profile Matching', () => {
  test('should find exact mood-occasion match', () => {
    const profile = findMoodProfile('Romantic', 'Anniversary');
    
    expect(profile).toBeDefined();
    expect(profile?.mood).toBe('Romantic');
    expect(profile?.occasion).toBe('Anniversary');
    expect(profile?.intentTags).toContain('romantic');
    expect(profile?.intentTags).toContain('elegant');
  });

  test('should fallback to mood when occasion not found', () => {
    const profile = findMoodProfile('Sporty', 'NonExistentOccasion');
    
    expect(profile).toBeDefined();
    expect(profile?.mood).toBe('Sporty');
    // Should match any sporty occasion
  });

  test('should return generic profile for unknown mood', () => {
    const profile = findMoodProfile('UnknownMood', 'UnknownOccasion');
    
    expect(profile).toBeDefined();
    expect(profile?.mood).toBe('UnknownMood'); // Returns the passed mood
    expect(profile?.occasion).toBe('UnknownOccasion');
    expect(profile?.budgetStrategy).toBe('moderate');
  });

  test('should have avoid tags for elegant Birthday', () => {
    const profile = findMoodProfile('Elegant', 'Birthday');
    
    expect(profile?.avoidTags).toContain('sporty');
    expect(profile?.avoidTags).toContain('casual');
  });

  test('should use premium budget strategy for romantic occasions', () => {
    const profile = findMoodProfile('Romantic', 'Anniversary');
    
    expect(profile?.budgetStrategy).toBe('premium');
    expect(BUDGET_STRATEGIES.premium).toBe(0.9); // 90% of budget
  });
});

describe('Mood Finder - Product Tags', () => {
  test('should have tags for all intent categories', () => {
    expect(PRODUCT_TAGS.elegant).toBeDefined();
    expect(PRODUCT_TAGS.sporty).toBeDefined();
    expect(PRODUCT_TAGS.casual).toBeDefined();
    expect(PRODUCT_TAGS.romantic).toBeDefined();
  });

  test('elegant tags should include premium keywords', () => {
    expect(PRODUCT_TAGS.elegant).toContain('premium');
    expect(PRODUCT_TAGS.elegant).toContain('quality');
  });

  test('sporty tags should include athletic keywords', () => {
    expect(PRODUCT_TAGS.sporty).toContain('athletic');
    expect(PRODUCT_TAGS.sporty).toContain('running');
  });
});

describe('Mood Finder - Budget Strategies', () => {
  test('conservative strategy should be 60%', () => {
    expect(BUDGET_STRATEGIES.conservative).toBe(0.6);
  });

  test('moderate strategy should be 75%', () => {
    expect(BUDGET_STRATEGIES.moderate).toBe(0.75);
  });

  test('premium strategy should be 90%', () => {
    expect(BUDGET_STRATEGIES.premium).toBe(0.9);
  });

  test('should target 90% budget for anniversary', () => {
    const profile = findMoodProfile('Romantic', 'Anniversary');
    const targetPrice = 1000 * BUDGET_STRATEGIES[profile!.budgetStrategy];
    
    expect(targetPrice).toBe(900);
  });
});

describe('Mood Finder - Coverage', () => {
  test('should have profiles for common mood-occasion combinations', () => {
    const combinations = [
      ['Romantic', 'Anniversary'],
      ['Professional', 'Office'],
      ['Sporty', 'Gym'],
      ['Casual', 'DailyUse'],
      ['Trendy', 'College'],
    ];

    combinations.forEach(([mood, occasion]) => {
      const profile = findMoodProfile(mood, occasion);
      expect(profile).toBeDefined();
    });
  });

  test('all profiles should have required fields', () => {
    MOOD_PROFILES.forEach(profile => {
      expect(profile.mood).toBeDefined();
      expect(profile.occasion).toBeDefined();
      expect(profile.intentTags).toBeInstanceOf(Array);
      expect(profile.intentTags.length).toBeGreaterThan(0);
      expect(profile.budgetStrategy).toBeDefined();
    });
  });
});
