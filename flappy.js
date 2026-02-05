// Cria elementos HTML com classe
function novoElemento(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

// Barreira (superior ou inferior)
function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// Par de barreiras (superior + inferior)
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
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
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
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
function Personagem (alturaJogo){ // mudar
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
}//

// ----------------------
// Parte comentada original
/* const barreiras = new Barreiras(700, 1200, 200, 400, () => console.log('ponto!'))
const passaro = new Passaro(700) // mudar
const areaJogo = document.querySelector('[wm-flappy]')
areaJogo.appendChild(passaro.elemento) //mudar
areaJogo.appendChild(new Progresso().elemento)
barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))


setInterval(()=>{
    barreiras.animar()
    passaro.animar() //mudar
},20)
*/

// Instanciando jogo
/*const altura = areaJogo.clientHeight
const largura = areaJogo.clientWidth
*/
// ----------------------

// Progresso
function Progresso(){
    this.elemento = novoElemento ('span','progresso')
    this.atualizar = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizar(0)
}

// Funções de colisão
function sobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical   = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colisao(personagem, barreiras){
    let colisao = false
    barreiras.pares.forEach(par => {
        if(!colisao){
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento
            colisao = sobrepostos(personagem.elemento, superior) ||
                      sobrepostos(personagem.elemento, inferior)
        }
    })
    return colisao
}

// Função principal do jogo
function Flappy(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    // Instanciando jogo
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        ()=>progresso.atualizar(++pontos))

    const personagem = new Personagem(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(personagem.elemento)
    barreiras.pares.forEach(par=>areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        // loop do jogo 
        const temporizador = setInterval(()=>{
            barreiras.animar()
        personagem.animar()

            if(colisao(personagem, barreiras)){
                console.log("COLISÃO!")
                clearInterval(temporizador)
            }
        },20)
    }
}

new Flappy().start()

