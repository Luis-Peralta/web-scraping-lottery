function giveLuckyNumbers() {
  const numbers = [];
  const ranges = [[0, 19], [20, 39], [40, 59], [60, 79], [80, 99]];

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const number = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    numbers.push(number);
  }

  return numbers;
}

const randomNumbers = giveLuckyNumbers();
console.log(randomNumbers);
