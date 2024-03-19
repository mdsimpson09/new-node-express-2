function timeWord(time) {
    const hoursToWords = {
        0: 'twelve', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
        6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven',
        12: 'twelve', 13: 'one', 14: 'two', 15: 'three', 16: 'four', 17: 'five',
        18: 'six', 19: 'seven', 20: 'eight', 21: 'nine', 22: 'ten', 23: 'eleven'
    };
  
    const minutesToWords = {
        0: 'o\'clock', 1: 'oh one', 2: 'oh two', 3: 'oh three', 4: 'oh four', 
        5: 'oh five', 6: 'oh six', 7: 'oh seven', 8: 'oh eight', 9: 'oh nine',
        10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
        15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
        20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty'
    };
  
    for (let i = 20; i < 60; i++) {
      if (!minutesToWords[i]) {
          let tens = Math.floor(i / 10) * 10;
          let ones = i % 10;
          if (ones === 0) {
              minutesToWords[i] = `${minutesToWords[tens]}`;
          } else {
              minutesToWords[i] = `${minutesToWords[tens] || (tens === 20 ? 'twenty' : tens === 30 ? 'thirty' : tens === 40 ? 'forty' : 'fifty')} ${hoursToWords[ones]}`;
          }
      }
  } 
  const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
  
  if (time === '00:00') return 'midnight';
  if (time === '12:00') return 'noon';
  
  const hourWord = hoursToWords[hour % 24];
  const minuteWord = minutesToWords[minute];
  const amPm = hour < 12 ? 'am' : 'pm';
  
  if (minute === 0) {
      return `${hourWord} ${minuteWord} ${amPm}`.trim();
  } else {
      return `${hourWord} ${minuteWord} ${amPm}`;
  }
  }
  module.exports = timeWord;
  
  
  
  console.log(timeWord('00:00')); // midnight
  console.log(timeWord('00:12')); // twelve twelve am
  console.log(timeWord('01:00')); // one o'clock am
  console.log(timeWord('23:59')); // eleven fifty-nine pm

// Marli@Marlis-MBP node-express-2 % node timeWord.js
// midnight
// twelve twelve am
// one o'clock am
// eleven fifty nine pm
// Marli@Marlis-MBP node-express-2 % 