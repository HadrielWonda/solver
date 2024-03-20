import sympy as sp

def bisection_method(xu,
  xl,
  expression,
  maxIter = 1000,
  maxError = 0.0000001):

    x = sp.symbols('x')
    func = sp.sympify(expression)

    fl = func.subs(x, xl)
    fu = func.subs(x, xu)

    if fl * fu > 0:
        raise ValueError("Function has same sign at both endpoints. Bisection method cannot guarantee convergence.")

    iteration = 0
    errorAbslt = 100
    xrOld = 0
    result = []
    while iteration < maxIter and errorAbslt > maxError:
        iteration += 1

        xr = (xl + xu) / 2
        if xr != 0 and xrOld:
          errorAbslt = abs((xr - xrOld) / xr) * 100

        result.append({
          "itr": iter,
          "xl": xl,
          "xu": xu,
          "xr": xr,
          "ea": errorAbslt,
        })

        fr = func.subs(x, xr)
        fl = func.subs(x, xl)
        test = fl * fr
        
    
        if test > 0:
           xl = xr
        elif test < 0:
            xu = xr
        else:
            errorAbslt = 0

    return result