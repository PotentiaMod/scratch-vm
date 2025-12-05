/**
 * @fileoverview Utilities for immutable.js objects.
 */

/**
 * Determine if two maps have identical keys and content (Object.is equality)
 * Unlike the regular immutable.js comparison functions, this one considers 0 and -0 to be different.
 * @param {OrderedMap} a
 * @param {OrderedMap} b
 * @returns {boolean} true if a and b have the same keys and values
 */
const compareImmutableMaps = (a, b) => {
    if (a.size !== b.size) {
        return false;
    }

    for (const key of a.keys()) {
        const aValue = a.get(key);
        const bValue = b.get(key);
        if (!Object.is(aValue, bValue)) {
            return false;
        }
    }

    return true;
};

/**
 * Merge map B into map A. Values of undefined or null in B will default to B.
 * Unlike the regular immutable.js comparison functions, this one considers 0 and -0 to be different.
 * @param {OrderedMap} a
 * @param {OrderedMap} b
 * @returns {OrderedMap}
 */
const mergeMaps = (a, b) => b
    .filter(value => value === 0)
    .merge(a)
    .mergeWith((prev, next) => {
        if (typeof next === 'undefined' || next === null) {
            return prev;
        }
        return next;
    }, b);

module.exports = {
    compareImmutableMaps,
    mergeMaps
};
