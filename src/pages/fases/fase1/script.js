let player;
let map;
let tileset;
let chaoLayer;
let colisaoLayer;
let cursors;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('background', 'assets/background.png');
    this.load.tilemapTiledJSON('map', 'tileset.json');
    this.load.image('tileset', 'assets/tileset.png');
}

function create() {
    // Carregar o mapa *primeiro*
    map = this.make.tilemap({ key: 'map' });

    // Adicionar o tileset *uma vez* e *depois* de criar o mapa
    tileset = map.addTilesetImage('Tileset', 'tileset');

    // Criar camada de chão
    chaoLayer = map.createLayer('chao', tileset, 0, 0);

    

    // Criar camada de colisão e ativar colisões
    colisaoLayer = map.createLayer('colisao', tileset, 0, 0);
    // Verifique se a propriedade utilizada no Tiled é 'collides' ou 'collider'
    colisaoLayer.setCollisionByProperty({ collider: true }); 

    chaoLayer.setScale(2);
    colisaoLayer.setScale(2);

    // Ativar debug da colisão para verificar se está funcionando
    this.physics.world.createDebugGraphic();

    // Criar o jogador
    player = this.physics.add.sprite(100, 100, 'player', 0);
    player.setCollideWorldBounds(true);
    player.setScale(0.8);
    player.setOrigin(0.5, 1); // Centro horizontal, parte inferior vertical

    // Ajuste *cuidadosamente* o tamanho do corpo físico. Use o debug para visualizar!
    player.body.setSize(30, 70); // Exemplo: Largura 40, Altura 90. Ajuste esses valores!
    player.body.setOffset(40, 60); 

    // Adicionar colisão entre o jogador e a camada de colisão
    this.physics.add.collider(player, colisaoLayer);

    // Criar animações do jogador
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Criar teclas de movimentação
    cursors = this.input.keyboard.createCursorKeys();

    // Configurar a câmera para seguir o jogador
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.setFlipX(true);
        player.play('walk', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.setFlipX(false);
        player.play('walk', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.play('walk', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.play('walk', true);
    } else {
        player.anims.stop();
    }
}