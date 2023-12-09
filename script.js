
document.addEventListener('DOMContentLoaded', function () {
    const amountInput = document.getElementById('amount');
    const form = document.getElementById('taxCalculator');

    amountInput.addEventListener('input', function () {
        calculateTaxes();
    });

    //obtener y mostrar el valor del dolar oficial
    async function apiCall() {
        try {
            const response = await fetch("https://api.bluelytics.com.ar/json/last_price");
            if (response.ok) {
                const data = await response.json();
                const dolarOficial = data[0].value_sell;
                return dolarOficial;
            }
            throw new Error('Error al obtener el valor del dólar');
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
            return null;
        }
    }
    async function mostrarDolar() {
        const dolar = await apiCall();
        const dolarElement = document.getElementById('dolar');
        dolarElement.innerHTML = `${dolar} ars = 1 dolar`
        return dolar
    }

    //calculo de los impuestos
    function calculateTaxAmount(amount, dolar) {
        const pais = 0.30;
        const ganancias = 1;
        const bienesPersonales = 0.25;
        const precioEnPesos = amount * dolar;
        const precioFinal = (precioEnPesos * (pais + ganancias + bienesPersonales)) + precioEnPesos
        return {
            pais: pais * precioEnPesos,
            ganancias: ganancias * precioEnPesos,
            bienesPersonales: bienesPersonales * precioEnPesos,
            precioEnPesos,
            precioFinal
        }
    }

    async function calculateTaxes() {
        const amount = parseFloat(amountInput.value);
        const dolar = await mostrarDolar()
        if (!isNaN(amount)) {
            try {
                if (dolar !== null) {
                    const { pais, ganancias, bienesPersonales, precioEnPesos, precioFinal } = calculateTaxAmount(amount, dolar);

                    const precioEnPesosElement = document.getElementById('precioEnPesos');
                    const resultElement = document.getElementById('result');
                    const paisElement = document.getElementById('pais');
                    const gananciasElement = document.getElementById('ganancias');
                    const bienesPersonalesElement = document.getElementById('bienesPersonales');

                    precioEnPesosElement.innerHTML = ` ${precioEnPesos}`
                    paisElement.innerHTML = ` ${pais}`
                    gananciasElement.innerHTML = ` ${ganancias}`
                    bienesPersonalesElement.innerHTML = ` ${bienesPersonales}`
                    resultElement.innerHTML = ` ${precioFinal.toFixed(1)}`;
                } else {
                    throw new Error('Valor del dólar no disponible');
                }
            } catch (error) {
                console.error('Error al calcular impuestos:', error);
            }
        } else {
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = '';
        }
    }

});
