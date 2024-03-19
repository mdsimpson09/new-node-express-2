const timeWord = require('./jest.config');

describe('#timeWord', () => {
  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });

  test('converts "00:00" to "midnight"', () => {
    expect(timeWord('00:00')).toBe('midnight');
  });

  test('converts "00:12" to "twelve twelve am"', () => {
    expect(timeWord('00:12')).toBe('twelve twelve am');
  });

  test('converts "01:00" to "one o’clock am"', () => {
    expect(timeWord('01:00')).toBe('one o\'clock am'); // Use straight apostrophe
  });

  test('converts "06:01" to "six oh one am"', () => {
    expect(timeWord('06:01')).toBe('six oh one am');
  });

  test('converts "06:10" to "six ten am"', () => {
    expect(timeWord('06:10')).toBe('six ten am');
  });

  test('converts "06:18" to "six eighteen am"', () => {
    expect(timeWord('06:18')).toBe('six eighteen am');
  });

  test('converts "06:30" to "six thirty am"', () => {
    expect(timeWord('06:30')).toBe('six thirty am');
  });

  test('converts "10:34" to "ten thirty four am"', () => {
    expect(timeWord('10:34')).toBe('ten thirty four am');
  });

  test('converts "12:00" to "noon"', () => {
    expect(timeWord('12:00')).toBe('noon');
  });

  test('converts "12:09" to "twelve oh nine pm"', () => {
    expect(timeWord('12:09')).toBe('twelve oh nine pm');
  });

  test('converts "23:23" to "eleven twenty-three pm"', () => {
   
    expect(timeWord('23:23')).toBe('eleven twenty three pm');
  });
});

// Marli@Marlis-MBP timeword % npm test

// > express-2@1.0.0 test
// > jest

//   console.log
//     midnight

//       at Object.log (timeWord.js:45:9)

//   console.log
//     twelve twelve am

//       at Object.log (timeWord.js:46:9)

//   console.log
//     one o'clock am

//       at Object.log (timeWord.js:47:9)

//   console.log
//     eleven fifty nine pm

//       at Object.log (timeWord.js:48:9)

//  PASS  ./timeWord.test.js
//   #timeWord
//     ✓ it is a function (1 ms)
//     ✓ converts "00:00" to "midnight"
//     ✓ converts "00:12" to "twelve twelve am"
//     ✓ converts "01:00" to "one o’clock am"
//     ✓ converts "06:01" to "six oh one am"
//     ✓ converts "06:10" to "six ten am"
//     ✓ converts "06:18" to "six eighteen am"
//     ✓ converts "06:30" to "six thirty am" (1 ms)
//     ✓ converts "10:34" to "ten thirty four am"
//     ✓ converts "12:00" to "noon"
//     ✓ converts "12:09" to "twelve oh nine pm"
//     ✓ converts "23:23" to "eleven twenty-three pm"

// Test Suites: 1 passed, 1 total
// Tests:       12 passed, 12 total
// Snapshots:   0 total
// Time:        0.186 s, estimated 1 s