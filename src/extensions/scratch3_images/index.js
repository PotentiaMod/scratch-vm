const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * Reaproveite/troque por um ícone seu se quiser.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48dGl0bGU+aW1hZ2VtLWljb248L3RpdGxlPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTEiIGZpbGw9IiNGRjhDMUEiIHN0cm9rZT0iI0RCNkUwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTcgMTUuNWwzLTMuMmMuNC0uNCAxLS40IDEuNCAwbDEuMyAxLjMgMi42LTIuOWMuNC0uNCAxLS40IDEuNC0uMUwxOSAxMy4yVjE3YTEgMSAwIDAgMS0xIDFIN2ExIDEgMCAwIDEtMS0xdi0xLjV6IiBmaWxsPSIjRkZGIi8+PGNpcmNsZSBjeD0iOS4zIiBjeT0iOSIgcj0iMS40IiBmaWxsPSIjRkZGIi8+PC9nPjwvc3ZnPg==';

/**
 * Host for the "Imagem" blocks in Scratch 3.0 / TurboWarp (native extension).
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3ImagemBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._cache = new Map();
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'imagem',
            name: formatMessage({
                id: 'imagem.categoryName',
                default: 'Imagem',
                description: 'Label for the imagem extension category'
            }),
            color1: '#FF8C1A',
            color2: '#DB6E00',
            color3: '#DB6E00',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'redimensionarPorcentagem',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.redimensionarPorcentagem',
                        default: 'redimensionar imagem [SRC] em [PORCENTAGEM] %',
                        description: 'resize an image by a percentage'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        PORCENTAGEM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'redimensionarLarguraAltura',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.redimensionarLarguraAltura',
                        default: 'redimensionar imagem [SRC] para largura [LARGURA] altura [ALTURA]',
                        description: 'resize an image to a specific width and height'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        LARGURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        ALTURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'redimensionarMantendoProporcaoLargura',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.redimensionarMantendoProporcaoLargura',
                        default: 'redimensionar imagem [SRC] para largura [LARGURA] (mantendo proporção)',
                        description: 'resize an image to a width, keeping aspect ratio'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        LARGURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'redimensionarMantendoProporcaoAltura',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.redimensionarMantendoProporcaoAltura',
                        default: 'redimensionar imagem [SRC] para altura [ALTURA] (mantendo proporção)',
                        description: 'resize an image to a height, keeping aspect ratio'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        ALTURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                '---',
                {
                    opcode: 'obterLargura',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.obterLargura',
                        default: 'largura da imagem [SRC]',
                        description: 'get the width of an image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                {
                    opcode: 'obterAltura',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.obterAltura',
                        default: 'altura da imagem [SRC]',
                        description: 'get the height of an image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                '---',
                {
                    opcode: 'adicionarBorda',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.adicionarBorda',
                        default: 'adicionar borda de [ESPESSURA] px cor [COR] na imagem [SRC]',
                        description: 'add a border around the image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        ESPESSURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        COR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'adicionarBordaArredondada',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.adicionarBordaArredondada',
                        default: 'arredondar cantos da imagem [SRC] com raio [RAIO] px',
                        description: 'round the corners of the image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        RAIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                '---',
                {
                    opcode: 'girarImagem',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.girarImagem',
                        default: 'girar imagem [SRC] em [GRAUS] graus',
                        description: 'rotate the image by degrees'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        GRAUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'espelharHorizontal',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.espelharHorizontal',
                        default: 'espelhar imagem [SRC] horizontalmente',
                        description: 'flip the image horizontally'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                {
                    opcode: 'espelharVertical',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.espelharVertical',
                        default: 'espelhar imagem [SRC] verticalmente',
                        description: 'flip the image vertically'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                '---',
                {
                    opcode: 'escalaDeCinza',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.escalaDeCinza',
                        default: 'converter imagem [SRC] para escala de cinza',
                        description: 'convert the image to grayscale'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                {
                    opcode: 'inverterCores',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.inverterCores',
                        default: 'inverter cores da imagem [SRC]',
                        description: 'invert the colors of the image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                {
                    opcode: 'ajustarBrilho',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.ajustarBrilho',
                        default: 'ajustar brilho da imagem [SRC] em [VALOR] %',
                        description: 'adjust image brightness by percentage'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        VALOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 120
                        }
                    }
                },
                {
                    opcode: 'ajustarContraste',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.ajustarContraste',
                        default: 'ajustar contraste da imagem [SRC] em [VALOR] %',
                        description: 'adjust image contrast by percentage'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        VALOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 120
                        }
                    }
                },
                {
                    opcode: 'ajustarOpacidade',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.ajustarOpacidade',
                        default: 'ajustar opacidade da imagem [SRC] em [VALOR] %',
                        description: 'adjust image opacity by percentage'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        VALOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'aplicarDesfoque',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.aplicarDesfoque',
                        default: 'aplicar desfoque de [PIXELS] px na imagem [SRC]',
                        description: 'apply a blur effect to the image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        PIXELS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                '---',
                {
                    opcode: 'recortarImagem',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.recortarImagem',
                        default: 'recortar imagem [SRC] a partir de x [X] y [Y] largura [LARGURA] altura [ALTURA]',
                        description: 'crop a rectangular region from the image'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        LARGURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        ALTURA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'recortarCirculo',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.recortarCirculo',
                        default: 'recortar imagem [SRC] em formato circular',
                        description: 'crop the image into a circular shape'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                '---',
                {
                    opcode: 'combinarImagens',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.combinarImagens',
                        default: 'combinar imagem [SRC1] com [SRC2] na posição x [X] y [Y]',
                        description: 'overlay one image on top of another at a position'
                    }),
                    arguments: {
                        SRC1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/fundo.png'
                        },
                        SRC2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'obterCorDoPixel',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.obterCorDoPixel',
                        default: 'cor do pixel x [X] y [Y] da imagem [SRC]',
                        description: 'get the color of a pixel as a hex string'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'imagemParaBase64',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'imagem.imagemParaBase64',
                        default: 'converter imagem [SRC] para base64',
                        description: 'convert the image to a base64 data URI string'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/imagem.png'
                        }
                    }
                },
                '---',
                {
                    opcode: 'limparCache',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'imagem.limparCache',
                        default: 'limpar cache de imagens',
                        description: 'clear the internal image cache'
                    })
                }
            ]
        };
    }

    _carregarImagem (src) {
        if (this._cache.has(src)) {
            return Promise.resolve(this._cache.get(src));
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this._cache.set(src, img);
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error('Não foi possível carregar a imagem: ' + src));
            };
            img.src = src;
        });
    }

    _criarCanvas (largura, altura) {
        largura = Math.max(1, Math.round(largura));
        altura = Math.max(1, Math.round(altura));
        const canvas = document.createElement('canvas');
        canvas.width = largura;
        canvas.height = altura;
        return canvas;
    }

    _canvasParaDataURL (canvas) {
        try {
            return canvas.toDataURL('image/png');
        } catch (e) {
            throw new Error('Erro ao gerar imagem (CORS?): ' + e.message);
        }
    }

    _desenharRedimensionado (img, largura, altura) {
        const canvas = this._criarCanvas(largura, altura);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return this._canvasParaDataURL(canvas);
    }

    async redimensionarPorcentagem (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const fator = Number(args.PORCENTAGEM) / 100;
            const novaLargura = img.naturalWidth * fator;
            const novaAltura = img.naturalHeight * fator;
            return this._desenharRedimensionado(img, novaLargura, novaAltura);
        } catch (e) {
            return '';
        }
    }

    async redimensionarLarguraAltura (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            return this._desenharRedimensionado(img, Number(args.LARGURA), Number(args.ALTURA));
        } catch (e) {
            return '';
        }
    }

    async redimensionarMantendoProporcaoLargura (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const proporcao = img.naturalHeight / img.naturalWidth;
            const largura = Number(args.LARGURA);
            const altura = largura * proporcao;
            return this._desenharRedimensionado(img, largura, altura);
        } catch (e) {
            return '';
        }
    }

    async redimensionarMantendoProporcaoAltura (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const proporcao = img.naturalWidth / img.naturalHeight;
            const altura = Number(args.ALTURA);
            const largura = altura * proporcao;
            return this._desenharRedimensionado(img, largura, altura);
        } catch (e) {
            return '';
        }
    }

    async obterLargura (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            return img.naturalWidth;
        } catch (e) {
            return 0;
        }
    }

    async obterAltura (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            return img.naturalHeight;
        } catch (e) {
            return 0;
        }
    }

    async adicionarBorda (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const espessura = Math.max(0, Math.round(Number(args.ESPESSURA)));
            const cor = String(args.COR);
            const largura = img.naturalWidth + espessura * 2;
            const altura = img.naturalHeight + espessura * 2;
            const canvas = this._criarCanvas(largura, altura);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = cor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, espessura, espessura, img.naturalWidth, img.naturalHeight);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async adicionarBordaArredondada (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const raio = Math.max(0, Number(args.RAIO));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            const r = Math.min(raio, w / 2, h / 2);

            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(w - r, 0);
            ctx.arcTo(w, 0, w, r, r);
            ctx.lineTo(w, h - r);
            ctx.arcTo(w, h, w - r, h, r);
            ctx.lineTo(r, h);
            ctx.arcTo(0, h, 0, h - r, r);
            ctx.lineTo(0, r);
            ctx.arcTo(0, 0, r, 0, r);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(img, 0, 0, w, h);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async girarImagem (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const graus = Number(args.GRAUS);
            const rad = (graus * Math.PI) / 180;

            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const sin = Math.abs(Math.sin(rad));
            const cos = Math.abs(Math.cos(rad));
            const novaLargura = w * cos + h * sin;
            const novaAltura = w * sin + h * cos;

            const canvas = this._criarCanvas(novaLargura, novaAltura);
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rad);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async espelharHorizontal (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async espelharVertical (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async escalaDeCinza (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.filter = 'grayscale(100%)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async inverterCores (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.filter = 'invert(100%)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async ajustarBrilho (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const valor = Number(args.VALOR);
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.filter = `brightness(${valor}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async ajustarContraste (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const valor = Number(args.VALOR);
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.filter = `contrast(${valor}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async ajustarOpacidade (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const valor = Math.max(0, Math.min(100, Number(args.VALOR)));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = valor / 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async aplicarDesfoque (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const pixels = Math.max(0, Number(args.PIXELS));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.filter = `blur(${pixels}px)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async recortarImagem (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const x = Number(args.X);
            const y = Number(args.Y);
            const largura = Number(args.LARGURA);
            const altura = Number(args.ALTURA);
            const canvas = this._criarCanvas(largura, altura);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, x, y, largura, altura, 0, 0, canvas.width, canvas.height);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async recortarCirculo (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const tamanho = Math.min(img.naturalWidth, img.naturalHeight);
            const canvas = this._criarCanvas(tamanho, tamanho);
            const ctx = canvas.getContext('2d');
            const raio = tamanho / 2;

            ctx.beginPath();
            ctx.arc(raio, raio, raio, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            const offsetX = (img.naturalWidth - tamanho) / 2;
            const offsetY = (img.naturalHeight - tamanho) / 2;
            ctx.drawImage(img, offsetX, offsetY, tamanho, tamanho, 0, 0, tamanho, tamanho);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async combinarImagens (args) {
        try {
            const imgFundo = await this._carregarImagem(String(args.SRC1));
            const imgFrente = await this._carregarImagem(String(args.SRC2));
            const canvas = this._criarCanvas(imgFundo.naturalWidth, imgFundo.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgFrente, Number(args.X), Number(args.Y));
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    async obterCorDoPixel (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const x = Math.max(0, Math.min(canvas.width - 1, Math.round(Number(args.X))));
            const y = Math.max(0, Math.min(canvas.height - 1, Math.round(Number(args.Y))));
            const dados = ctx.getImageData(x, y, 1, 1).data;
            const hex = '#' + [dados[0], dados[1], dados[2]]
                .map(v => v.toString(16).padStart(2, '0'))
                .join('');
            return hex;
        } catch (e) {
            return '#000000';
        }
    }

    async imagemParaBase64 (args) {
        try {
            const img = await this._carregarImagem(String(args.SRC));
            const canvas = this._criarCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return this._canvasParaDataURL(canvas);
        } catch (e) {
            return '';
        }
    }

    limparCache () {
        this._cache.clear();
    }
}

module.exports = Scratch3ImagemBlocks;