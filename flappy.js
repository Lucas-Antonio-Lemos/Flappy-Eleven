// Cria elementos HTML com classe
function novoElemento(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

// Barreira (superior ou inferior)
function barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// Par de barreiras (superior + inferior)
function parDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-barreiras')
    this.superior = new barreira(true)
    this.inferior = new barreira(false)
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.replace('px','')) || 0
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

// Conjunto de barreiras animadas
function Barreiras(altura, largura, abertura, espaco, ponto){
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOmeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzouOmeio) ponto()
        })
    }
}

// Pássaro
function Passaro (alturaJogo){
    let voando = false

    this.elemento = novoElemento('img','eleven')
    this.elemento.src = 'imgs/11.png'

    this.getY = () => parseInt(this.elemento.style.bottom.replace('px','')) || 0
    this.setY = y => this.elemento.style.bottom = `${y}px`
    
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMax = alturaJogo - this.elemento.clientHeight

        if(novoY <= 0){
            this.setY(0)
        } else if (novoY >= alturaMax){
            this.setY(alturaMax)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

// Instanciando jogo
const areaJogo = document.querySelector('[wm-flappy]')
const altura = areaJogo.clientHeight
const largura = areaJogo.clientWidth

const barreiras = new Barreiras(altura, largura, 200, 400, () => console.log('ponto!'))
const passaro = new Passaro(altura)

areaJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))

setInterval(()=>{
    barreiras.animar()
    passaro.animar()
},20)
