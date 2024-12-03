class Tabuleiro {
    constructor() {
        this.tabuleiro = [];
        for (let linha = 0; linha < 8; linha++) {
            this.tabuleiro[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                this.tabuleiro[linha][coluna] = new Casa(linha, coluna);
            }
        }
        this.selecionada = null;
        this.jogadorAtual = 'branca'; // Alterna entre "branca" e "preta"
    }

    colocarPeca(peca, linha, coluna) {
        const casa = this.tabuleiro[linha][coluna];
        casa.setPeca(peca);
    }

    clicarCasa(casa) {
        if (this.selecionada) {
            const peca = this.selecionada.peca;

            // Verifica se o movimento é válido
            if (peca && peca.cor === this.jogadorAtual) {
                const movimentos = peca.movimentosPossiveis(this.tabuleiro);
                const movimentoValido = movimentos.some(
                    (m) => m[0] === casa.linha && m[1] === casa.coluna
                );

                if (movimentoValido) {
                    casa.setPeca(peca);
                    this.selecionada.setPeca(null);
                    peca.moverPara(casa.linha, casa.coluna);
                    this.selecionada = null;
                    this.removerDestaques();

                    // Alterna turno
                    this.jogadorAtual = this.jogadorAtual === 'branca' ? 'preta' : 'branca';
                } else {
                    alert("Movimento inválido!");
                }
            }
        } else if (casa.peca && casa.peca.cor === this.jogadorAtual) {
            this.selecionada = casa;
            this.removerDestaques();
            casa.elementoHtml.classList.add('selecionada');
            this.destacarMovimentos(casa);
        }
    }

    destacarMovimentos(casa) {
        const movimentos = casa.peca.movimentosPossiveis(this.tabuleiro);
        movimentos.forEach(([linha, coluna]) => {
            this.tabuleiro[linha][coluna].elementoHtml.classList.add('destacado');
        });
    }

    removerDestaques() {
        this.tabuleiro.flat().forEach((casa) =>
            casa.elementoHtml.classList.remove('destacado', 'selecionada')
        );
    }
}

class Casa {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
        this.peca = null;

        this.elementoHtml = document.createElement('div');
        this.elementoHtml.classList.add('casa');

        if ((linha + coluna) % 2 === 0) {
            this.elementoHtml.classList.add('clara');
        } else {
            this.elementoHtml.classList.add('escura');
        }

        document.getElementById('tabuleiro').appendChild(this.elementoHtml);

        this.elementoHtml.addEventListener('click', () => {
            tabuleiro.clicarCasa(this);
        });
    }

    setPeca(peca) {
        this.peca = peca;
        this.elementoHtml.innerHTML = peca ? peca.simbolo : '';
    }
}

class Peca {
    constructor(cor, linha, coluna) {
        this.cor = cor;
        this.linha = linha;
        this.coluna = coluna;
        this.simbolo = "";
    }

    movimentosPossiveis() {
        return [];
    }

    moverPara(novaLinha, novaColuna) {
        this.linha = novaLinha;
        this.coluna = novaColuna;
    }
}

class Peao extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9817;' : '&#9823;';
    }

    movimentosPossiveis(tabuleiro) {
        const movimentos = [];
        const direcao = this.cor === 'branca' ? -1 : 1;
        const novaLinha = this.linha + direcao;

        // Movimento simples
        if (!tabuleiro[novaLinha][this.coluna].peca) {
            movimentos.push([novaLinha, this.coluna]);

            // Movimento inicial de duas casas
            if (
                (this.cor === 'branca' && this.linha === 6) ||
                (this.cor === 'preta' && this.linha === 1)
            ) {
                const salto = this.linha + direcao * 2;
                if (!tabuleiro[salto][this.coluna].peca) {
                    movimentos.push([salto, this.coluna]);
                }
            }
        }

        // Captura
        for (let desvio of [-1, 1]) {
            const novaColuna = this.coluna + desvio;
            if (
                novaColuna >= 0 &&
                novaColuna < 8 &&
                tabuleiro[novaLinha][novaColuna]?.peca?.cor !== this.cor
            ) {
                movimentos.push([novaLinha, novaColuna]);
            }
        }

        return movimentos;
    }
}

// Classes para outras peças (Torre, Cavalo, Bispo, Rainha, Rei) devem seguir o mesmo padrão.

const tabuleiro = new Tabuleiro();

// Peças Brancas
const pecasBrancas = [
    new Peao('branca', 6, 0), new Peao('branca', 6, 1), new Peao('branca', 6, 2), new Peao('branca', 6, 3),
    new Peao('branca', 6, 4), new Peao('branca', 6, 5), new Peao('branca', 6, 6), new Peao('branca', 6, 7)
    // Adicione as outras peças brancas
];

// Peças Pretas
const pecasPretas = [
    new Peao('preta', 1, 0), new Peao('preta', 1, 1), new Peao('preta', 1, 2), new Peao('preta', 1, 3),
    new Peao('preta', 1, 4), new Peao('preta', 1, 5), new Peao('preta', 1, 6), new Peao('preta', 1, 7)
    // Adicione as outras peças pretas
];

// Colocar as peças brancas e pretas no tabuleiro
pecasBrancas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));
pecasPretas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));
