const slugifyUsername = (value = '') => {
  const base = String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);

  return base || 'traveler';
};

const generateUniqueUsername = async (User, baseName, excludeId = null) => {
  const base = slugifyUsername(baseName);
  let candidate = base;
  let suffix = 1;

  while (await User.exists({ username: candidate, _id: { $ne: excludeId } })) {
    candidate = `${base}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

module.exports = { slugifyUsername, generateUniqueUsername };
