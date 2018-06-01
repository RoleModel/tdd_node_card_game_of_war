const Factorial = require('../app/factorial');

describe('Factorial', () => {
  let factorial;

  beforeEach(() => {
    factorial = new Factorial();
  });

  it('works for the base cases', () => {
    expect(factorial.calculate(0)).toEqual(1);
    expect(factorial.calculate(1)).toEqual(1);
  });

  it('works for the next simplest case', () => {
    expect(factorial.calculate(2)).toEqual(2);
  });

  it('works for a simple recursing case', () => {
    expect(factorial.calculate(3)).toEqual(6);
  });

  it('works for a complex case', () => {
    expect(factorial.calculate(10)).toEqual(3628800);
  });
});
