function selecionarFase(fase) {
    alert("Você selecionou a Fase " + fase);
}

function abrirPopup() {
    document.getElementById("popup-como-jogar").style.display = "flex";
}

function animarTeclas() {
    let keys = ["key-w", "key-a", "key-s", "key-d", "key-up", "key-left", "key-down", "key-right"];
    let i = 0;

    setInterval(() => {
        keys.forEach(key => document.getElementById(key).classList.remove("animate"));
        document.getElementById(keys[i]).classList.add("animate");
        i = (i + 1) % keys.length;
    }, 500);
}

function animarTeclaE() {
    let key = document.getElementById("key-e");

    setInterval(() => {
        key.classList.toggle("animate");
    }, 500);
}

window.onload = function() {
    animarTeclas();
    animarTeclaE();
};

function fecharPopup() {
    document.getElementById("popup-como-jogar").style.display = "none";
}

function fecharPopupSobre() {
    document.getElementById("popup-sobre").style.display = "none";
}

function abrirPopupSobre() {
    document.getElementById("popup-sobre").style.display = "block";
}

document.getElementById("botaoJogar").addEventListener("click", function() {
    // Adiciona a classe de zoom no body para dar o efeito APENAS no fundo
    document.body.classList.add("zoom-effect");

    // Aguarda a animação antes de redirecionar
    setTimeout(() => {
        window.location.href = "fases.html";
    }, 1800); // Tempo deve ser igual à duração da animação no CSS (1.5s)
});


document.getElementById("botaoJogar").addEventListener("mousedown", function() {
    this.src = "assets/botoes/botastartpress.png";
});

document.getElementById("botaoJogar").addEventListener("mouseup", function() {
    this.src = "assets/botoes/botaostart.png";
});

document.getElementById("botaocomojogar").addEventListener("mousedown", function() {
    this.src = "assets/botoes/comojogarpress.png";
});

document.getElementById("botaocomojogar").addEventListener("mouseup", function() {
    this.src = "assets/botoes/comojogar.png";
});

document.getElementById("botaosobre").addEventListener("mouseup", function() {
    this.src = "assets/botoes/botaosobre.png";
});

document.getElementById("botaosobre").addEventListener("mousedown", function() {
    this.src = "assets/botoes/botaosobrepress.png";
});

