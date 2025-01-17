import sympy as sp

def simple_fixed_point(
  xi,
  expression,
  maxIter = 1000,
  maxError = 0.0000001):

    X = sp.symbols('x')
    func = sp.sympify(expression)

    iteration = 0
    errorAbslt = 100
    prevError = 100
    result = []
    divergenceCount = 0

    while iteration < maxIter and errorAbslt > maxError and divergenceCount < 4:
        iteration += 1

        x = func.subs(X, xi)
        if x != 0 and xi:
          errorAbslt = abs((x - xi) / x) * 100

        result.append({
          "itr": iter,
          "xi": x,
          "ea": errorAbslt,
        })

        if  errorAbslt > prevError:
          divergenceCount+=1
        else:
          divergenceCount = 0

        prevError = errorAbslt
        xi = x

    return result
