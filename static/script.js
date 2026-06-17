function calcularIMC(){

    let peso = parseFloat(document.getElementById("peso").value);
    let altura = parseFloat(document.getElementById("altura").value);

    if(!peso || !altura){
        document.getElementById("resultadoIMC").innerHTML =
        "Ingrese datos válidos";
        return;
    }

    let imc = peso / (altura * altura);

    let categoria = "";

    if(imc < 18.5){
        categoria = "Bajo peso";
    }
    else if(imc < 25){
        categoria = "Normal";
    }
    else if(imc < 30){
        categoria = "Sobrepeso";
    }
    else{
        categoria = "Obesidad";
    }

    document.getElementById("resultadoIMC").innerHTML =
    `IMC: ${imc.toFixed(2)} - ${categoria}`;
}

let vasos = 0;

function agregarAgua(){

    vasos++;

    document.getElementById("contador").innerHTML = vasos;

    let mensaje = "";

    if(vasos <= 3){
        mensaje = "¡Buen comienzo!";
    }
    else if(vasos <= 6){
        mensaje = "¡Sigue hidratándote!";
    }
    else{
        mensaje = "¡Excelente trabajo!";
    }

    document.getElementById("mensajeAgua").innerHTML = mensaje;
}

function reiniciar(){

    vasos = 0;

    document.getElementById("contador").innerHTML = 0;

    document.getElementById("mensajeAgua").innerHTML = "";
}
