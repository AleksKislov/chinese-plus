const Text = require('../../../models/Text');
const mongoose = require('mongoose');

async function getSimilarTexts(req, res) {
  const currentTextId = mongoose.Types.ObjectId(req.query.text_id);
  const level = +req.query.lvl || 1;
  const tags = req.query.tags?.split(',') || [];
  const isApproved = 1;
  const LIMIT = 6;
  const simTextsLimit = 4;
  const randomTextsLimit = LIMIT - simTextsLimit;

  // console.log(`Finding similar texts for ID: ${currentTextId}, Level: ${level}, Tags: ${tags}`);

  const desiredFields = {
    $project: {
      _id: 1,
      title: 1,
      audioSrc: 1, // Or determine based on actual field if needed
      picUrl: '$pic_url', // Rename field
      // Optional: include score for debugging/verification
      // tagMatchScore: 1,
      matchingTags: 1, // For debugging
    },
  };

  const similarTexts = await Text.aggregate([
    {
      // 1. Initial Match: Must match level, be approved, and NOT be the current text itself
      $match: {
        level,
        isApproved,
        _id: { $ne: currentTextId }, // Exclude the text we're currently viewing
      },
    },
    {
      // 2. Calculate Score: Add a field for the number of matching tags
      $addFields: {
        // Calculate intersection between document's tags and input tags
        matchingTags: {
          $ifNull: [
            // Handle cases where document 'tags' array might be null or missing
            { $setIntersection: ['$tags', tags] },
            [], // Default to empty array if $tags is null/missing
          ],
        },
      },
    },
    {
      // 3. Add Score Field: Count the size of the intersection
      $addFields: {
        tagMatchScore: { $size: '$matchingTags' },
      },
    },
    {
      // 4. Sort: Prioritize by the number of matching tags (descending)
      // You could add secondary sort criteria if needed (e.g., recent date)
      $sort: {
        tagMatchScore: -1, // Higher score first
        // Optional: Add secondary sort, e.g., by date or popularity
        // date: -1
      },
    },
    {
      // 5. Limit: Take the top N results
      $limit: simTextsLimit,
    },
    desiredFields,
  ]);

  const similarTextsIds = similarTexts.map((text) => text._id);
  const randomTexts = await Text.aggregate([
    {
      $match: {
        level,
        isApproved,
        _id: { $nin: similarTextsIds }, // Exclude documents with IDs from specificTexts
      },
    },
    { $sample: { size: randomTextsLimit } },
    desiredFields,
  ]);

  return res.json(similarTexts.concat(randomTexts));
}

module.exports = { getSimilarTexts };
