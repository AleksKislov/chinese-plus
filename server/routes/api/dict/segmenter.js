class LongestMatchSegmenter {
  constructor(dict){
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
  };

  /**
   * @description loop through the input str, slicing off each 
   * longestMatch and appending it to the segments array
   * @param {string} str - input string 
   * @returns {Array}
   */
  segment(str) {
    let seg;
    let segments = [];

    while (str.length > 0) {
      seg = this.getLongestMatch(str);
      if (!seg) seg = str.substr(0, 1);
      
      str = str.slice(seg.length);
      segments.push(seg);
    }
    return segments;
  };
}

module.exports = { LongestMatchSegmenter };
