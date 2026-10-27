const emojis: Record<string, string> = {
  Pizza: '🍕',
  Burgers: '🍔',
  Biryani: '🍛',
  Chinese: '🥡',
  Desserts: '🍰',
  Beverages: '🥤',
};

export const getCategoryEmoji = (name: string): string => emojis[name] ?? '🍽️';