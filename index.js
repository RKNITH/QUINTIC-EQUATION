document.getElementById('quinticForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    let c = parseFloat(document.getElementById('c').value);
    let d = parseFloat(document.getElementById('d').value);
    let e = parseFloat(document.getElementById('e').value);
    let f = parseFloat(document.getElementById('f').value);

    let roots = solveQuintic(a, b, c, d, e, f);
    displayResult(roots);
});

function solveQuintic(a, b, c, d, e, f) {
    // Solving the quintic equation ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0
    // This method uses numerical solutions for accuracy.

    // Function to find the roots of a polynomial using Durand-Kerner method
    function findRoots(coeffs) {
        const epsilon = 1e-8; // Tolerance
        const maxIterations = 100;
        let roots = [];

        // Initialize roots with complex unit circle
        for (let i = 0; i < coeffs.length - 1; i++) {
            roots.push(math.complex(Math.cos(2 * Math.PI * i / (coeffs.length - 1)), Math.sin(2 * Math.PI * i / (coeffs.length - 1))));
        }

        for (let iter = 0; iter < maxIterations; iter++) {
            let changes = [];

            for (let i = 0; i < roots.length; i++) {
                let denominator = math.complex(1, 0);
                for (let j = 0; j < roots.length; j++) {
                    if (i !== j) {
                        denominator = math.multiply(denominator, math.subtract(roots[i], roots[j]));
                    }
                }
                let numerator = evaluatePolynomial(coeffs, roots[i]);
                let change = math.divide(numerator, denominator);
                changes.push(change);
            }

            let maxChange = 0;
            for (let i = 0; i < roots.length; i++) {
                roots[i] = math.subtract(roots[i], changes[i]);
                maxChange = Math.max(maxChange, math.abs(changes[i]));
            }

            if (maxChange < epsilon) {
                break;
            }
        }

        return roots;
    }

    function evaluatePolynomial(coeffs, x) {
        let result = math.complex(0, 0);
        for (let i = 0; i < coeffs.length; i++) {
            result = math.add(result, math.multiply(coeffs[i], math.pow(x, coeffs.length - 1 - i)));
        }
        return result;
    }

    let coeffs = [a, b, c, d, e, f];
    let roots = findRoots(coeffs);
    let formattedRoots = roots.map(root => {
        if (Math.abs(root.im) < 1e-8) {
            return root.re.toFixed(5);
        } else {
            return root.toString();
        }
    });

    return formattedRoots;
}

function displayResult(roots) {
    let resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';

    resultDiv.innerHTML = 'Roots: <br>' + roots.join('<br>');
}
