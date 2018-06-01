class Factorial {
  calculate(integer) {
    const base = integer == 1 || integer == 0;
    if (base) {
      return 1;
    } else {
      return integer * this.calculate(integer - 1);
    }
  }
}

module.exports = Factorial;
