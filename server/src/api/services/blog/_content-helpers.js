function hasMeaningfulContent(content) {
  if (!Array.isArray(content)) return false;

  return content.some((block) => {
    if (!block || typeof block !== 'object') return false;
    switch (block.type) {
      case 'text':
        return Boolean((block.text || '').trim());
      case 'image':
        return Boolean(block.url);
      case 'carousel':
        return Array.isArray(block.images) && block.images.some((img) => img && img.url);
      case 'video':
        return Boolean(block.url);
      case 'chinese':
        return Array.isArray(block.words) && block.words.length > 0;
      default:
        return false;
    }
  });
}

module.exports = { hasMeaningfulContent };
