let player;
let map;
let tileset;
let chaoLayer;
let colisaoLayer;
let cursors;
let npc1;
let podeIniciarDialogo = false;
let dialogoIniciado = false;
let avisoTexto;
let textoDialogo;

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 500,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // Ativar debug pode ajudar a visualizar colisões
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('npc1', 'assets/npc.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('background', 'assets/background.png');
    this.load.tilemapTiledJSON('map', 'tileset.json');
    this.load.image('tileset', 'assets/Inside_C.png');
    
}

function create() {
    // Carregar o mapa *primeiro*
    map = this.make.tilemap({ key: 'map' });

    // Adicionar o tileset *uma vez* e *depois* de criar o mapa
    tileset = map.addTilesetImage('Inside_C', 'tileset');

    // Criar camada de chão
    chaoLayer = map.createLayer('Camada de Blocos 1', tileset, 0, 0);

    

    // Criar camada de colisão e ativar colisões
    colisaoLayer = map.createLayer('colisao', tileset, 0, 0);

    livrosLayer = map.createLayer('livros', tileset, 0, 0);
    livrosLayer.setCollisionByProperty({ collider: true }); 
    // Verifique se a propriedade utilizada no Tiled é 'collides' ou 'collider'
    colisaoLayer.setCollisionByProperty({ collider: true }); 

    chaoLayer.setScale(2);
    colisaoLayer.setScale(2);
    livrosLayer.setScale(2);

    // Ativar debug da colisão para verificar se está funcionando
    this.physics.world.createDebugGraphic();

    // Criar o jogador
    player = this.physics.add.sprite(10, 100, 'player', 0);
    player.setCollideWorldBounds(true);
    player.setScale(1.3);
    player.setOrigin(0.5, 1); // Centro horizontal, parte inferior vertical

    //criar npc
    npc1 = this.physics.add.sprite(700,400, 'npc1', 0);
    npc1.setCollideWorldBounds(true);
    npc1.setScale(0.1);
    npc1.setOrigin(0.5, 1);
    

    // Ajuste *cuidadosamente* o tamanho do corpo físico. Use o debug para visualizar!
    player.body.setSize(30, 30); // Exemplo: Largura 40, Altura 90. Ajuste esses valores!
    player.body.setOffset(15, 40); 

    npc1.body.setSize(700, 1000); // Exemplo: Largura 40, Altura 90. Ajuste esses valores!
    npc1.body.setOffset(100, 10); 

    // Adicionar colisão entre o jogador e a camada de colisão
    this.physics.add.collider(player, colisaoLayer);

    this.physics.add.overlap(player, npc1, jogadorPertoNpc, null, this);

    // Evento de teclado para a tecla espaço
    this.input.keyboard.on('keydown-SPACE', function (event) {
        if (podeIniciarDialogo && !dialogoIniciado) {
            iniciarDialogo();
        }
    });

 // Animação Parado (Frente)
this.anims.create({
    key: 'idle_front',
    frames: [{ key: 'player', frame: 0 }],
    frameRate: 1,
    repeat: -1
});

// Animação Parado (Costas)
this.anims.create({
    key: 'idle_back',
    frames: [{ key: 'player', frame: 5 }], // Frame 6 para parado de costas
    frameRate: 1,
    repeat: -1
});

// Animação Parado (Lados)
this.anims.create({
    key: 'idle_side',
    frames: [{ key: 'player', frame: 3 }], // Pode ser 4 ou 5, escolha o que preferir
    frameRate: 1,
    repeat: -1
});

// Andando para baixo
this.anims.create({
    key: 'walk_down',
    frames: [
        { key: 'player', frame: 0 },
        { key: 'player', frame: 1 },
        { key: 'player', frame: 0 },
        { key: 'player', frame: 2 }
    ],
    frameRate: 7,
    repeat: -1
});

// Andando para os lados
this.anims.create({
    key: 'walk_side',
    frames: [
        { key: 'player', frame: 3 },
        { key: 'player', frame: 4 }
    ],
    frameRate: 7,
    repeat: -1
});

// Andando para cima
this.anims.create({
    key: 'walk_up',
    frames: [
        { key: 'player', frame: 5 }, 
        { key: 'player', frame: 6 },
        { key: 'player', frame: 5 },
        { key: 'player', frame: 7 }
    ],
    frameRate: 7,
    repeat: -1
});

// Criar teclas de movimentação
cursors = this.input.keyboard.createCursorKeys();

// Configurar a câmera para seguir o jogador
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
this.cameras.main.startFollow(player);

    // Criar teclas de movimentação
    cursors = this.input.keyboard.createCursorKeys();

    // Configurar a câmera para seguir o jogador
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    avisoTexto = this.add.text(0, 0, "Aperte 'E' para interagir", {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FFFF00',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { left: 5, right: 5, top: 2, bottom: 2 }
    });

    avisoTexto.setOrigin(0.5);
    avisoTexto.setVisible(false);

    textoDialogo = this.add.text(100, 450, '', {
        fontFamily: 'Press Start 2P',
        fontSize: '16px',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        padding: { left: 10, right: 10, top: 10, bottom: 10 },
        wordWrap: { width: 600, useAdvancedWrap: true }
    });

    this.physics.add.overlap(player, npc1, jogadorPertoNpc, null, this);
}

let lastDirection = 'front'; // Começa com 'front' (parado de frente)
let currentAnimation = null; // Guarda a animação atual

function distanciaEntre(sprite1, sprite2) {
    return Phaser.Math.Distance.Between(sprite1.x, sprite2.x, sprite1.y, sprite2.y);
}

function jogadorPertoNpc(player, npc) {
    podeIniciarDialogo = true;
}

function update() {
    let moving = false;
    let newAnimation = null;

    if (cursors.left.isDown) {
        player.setVelocityX(-130);
        player.setVelocityY(0);
        player.setFlipX(true);
        newAnimation = 'walk_side';
        lastDirection = 'left';
        moving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(130);
        player.setVelocityY(0);
        player.setFlipX(false);
        newAnimation = 'walk_side';
        lastDirection = 'right';
        moving = true;
    } else if (cursors.up.isDown) {
        player.setVelocityY(-130);
        player.setVelocityX(0);
        newAnimation = 'walk_up';
        lastDirection = 'up';
        moving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(130);
        player.setVelocityX(0);
        newAnimation = 'walk_down';
        lastDirection = 'down';
        moving = true;
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);

        // Define a animação de idle baseada na última direção
        switch (lastDirection) {
            case 'left':
            case 'right':
                newAnimation = 'idle_side';
                break;
            case 'up':
                newAnimation = 'idle_back';
                break;
            case 'down':
            case 'front':
            default:
                newAnimation = 'idle_front';
                break;
        }
    }

    // Se a animação precisa ser mudada, troca apenas se necessário
    if (newAnimation && newAnimation !== currentAnimation) {
        player.anims.play(newAnimation, true);
        currentAnimation = newAnimation;
    }

    if (podeIniciarDialogo && Phaser.Input.Keyboard.JustDown(cursors.space) && !dialogoIniciado) {
        iniciarDialogo();
    }
}


function jogadorPertoNpc(player, npc) {
    podeIniciarDialogo = true;
    avisoTexto.setPosition(npc.x, npc.y - 50);
    avisoTexto.setVisible(true);
}

function iniciarDialogo() {
    dialogoIniciado = true; // Impede que o diálogo seja iniciado novamente

    // Array com diálogos aleatórios
    const dialogos = [
        "Olá, forasteiro! Seja bem-vindo à nossa humilde vila.",
        "Bom dia! Precisa de ajuda com algo?",
        "Ei, você! Já ouviu falar sobre a lenda do tesouro escondido?",
        "Saudações! Cuidado com os monstros na floresta ao sul.",
        "Olá! Se precisar de mantimentos, temos ótimos preços.",
        "Boa tarde! Deseja saber sobre a história da nossa cidade?",
        "Ei, você! Parece que temos um aventureiro por aqui.",
        "Saudações! Cuidado com o dragão que habita as montanhas.",
        "Olá! Se precisar de armas, temos um ferreiro habilidoso.",
        "Boa noite! Descanse bem, viajante."
    ];

    // Escolhe um diálogo aleatório

    // Exibe o diálogo (você pode usar um elemento de texto na tela)
    const dialogoEscolhido = dialogos[Math.floor(Math.random() * dialogos.length)];

    // Exibe o diálogo no elemento de texto
    textoDialogo.setText(dialogoEscolhido);

    // Quando o diálogo terminar (você precisa adicionar essa parte):
    const distancia = distanciaEntre(player, npc1);
    if (distancia < 50) { // Ajuste o raio de proximidade (150) se necessário
        avisoTexto.setPosition(npc1.x, npc1.y - 50);
        avisoTexto.setVisible(true);
        podeIniciarDialogo = true; // Habilita a interação APENAS quando estiver perto
    } else {
        avisoTexto.setVisible(false);
        podeIniciarDialogo = false; // Desabilita a interação quando se afastar
    }
}

