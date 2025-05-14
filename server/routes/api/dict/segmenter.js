class LongestMatchSegmenter {
  constructor(dict) {
    // dict should be a function that takes a chinese string as the
    // first param and returns something falsey if item is not in dict
    this.dict = dict;
  }

  /**
   * @param {string} str - input string
   * @returns {string|undefined}
   */
  getLongestMatch(str) {
    let i, slice;
    const maxWordLen = 8;
    i = maxWordLen > str.length ? maxWordLen : str.length;
    while (i >= 0) {
      slice = str.substr(0, i);
      if (this.dict(slice)) return slice;
      i--;
    }
  }

  /**
   * @description loop through the input str, slicing off each
   * longestMatch and appending it to the segments array
   * @param {string} str
   * @returns {string[]}
   */
  segment(str) {
    let seg;
    const segments = [];

    while (str.length > 0) {
      seg = this.getLongestMatch(str);
      if (!seg) seg = str.substr(0, 1);

      str = str.slice(seg.length);
      segments.push(seg);
    }
    return segments;
  }

  getLongestMatchFromEnd(str) {
    const maxLength = Math.min(str.length, 8); // Example: max word length 5
    for (let len = maxLength; len > 0; len--) {
      const substr = str.slice(-len);
      if (this.dict(substr)) return substr;
    }
    return null;
  }

  segmentFromEnd(str) {
    let seg;
    const segments = [];

    while (str.length > 0) {
      // Find longest match at the end
      seg = this.getLongestMatchFromEnd(str);
      if (!seg) seg = str.substr(-1); // Take last char if no match found

      str = str.slice(0, -seg.length); // Remove seg from end
      segments.unshift(seg); // Insert at beginning to keep order
    }
    return segments;
  }
}

module.exports = { LongestMatchSegmenter };
