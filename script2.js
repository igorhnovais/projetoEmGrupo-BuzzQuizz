let quizCriado = {
    title: "",
    image: "",
};

let questoesQuiz = [{
    title: "",
    color: "",
    answers: [{
        text: "",
        image: "",
        isCorrectAnswer: false
    }]
}];

let nivelPerguntas = [{
    title: "",
    image: "",
    text: "",
    minValue: 0
}];



let numeroDePerguntas;
let numeroDeNiveis;

// função para validar a url
function checkUrl(string) {
    try {
        let url = new URL(string)
        return true;
    } catch (err) {
        return false;
    }
}

// ao clicar no criar quizz ou no +, deve sumir a tela 1 e aparecer a tela 3.
function criarQuizzNovo() {

    const caixaPerguntas = document.querySelector('.perguntas');

    let pergunta = caixaPerguntas.firstElementChild;

    if (pergunta.value.length >= 20 && pergunta.value.length <= 65) {
        quizCriado.title = pergunta.value;
        pergunta.value = '';
        // pegar o outro input filho
        pergunta = pergunta.nextElementSibling;
        if (checkUrl(pergunta.value)) {
            quizCriado.image = pergunta.value;
            pergunta.value = '';

            pergunta = pergunta.nextElementSibling;
            if (Number(pergunta.value) >= 3) {
                numeroDePerguntas = pergunta.value;
                pergunta.value = '';

                pergunta = pergunta.nextElementSibling;

                if (Number(pergunta.value) >= 2) {
                    numeroDeNiveis = pergunta.value;
                    pergunta.value = '';
                } else {
                    pergunta.value = '';
                    alert('invalido, verifique o numero de niveis');
                    return;
                }
            } else {
                pergunta.value = '';
                alert('invalido, verifique o numero de perguntas');
                return;
            }
        } else {
            pergunta.value = '';
            alert('invalido, verifique a url');
            return;
        }
    } else {
        pergunta.value = '';
        alert('invalido, verifique o titulo (minimo 20 e maximo 65 caracteres)');
        return;
    }

    const desktop8 = document.querySelector('.desktop-8');
    desktop8.classList.add('escondido');

    const desktop9 = document.querySelector('.desktop-9');
    desktop9.classList.remove('escondido');

    displayCriarPerguntas();

}

// pulou de tela =>

function displayCriarPerguntas() {

    const segundaAba = document.querySelector(".segunda-aba");
    segundaAba.innerHTML = `<div class="titulo">
        <h1>Crie suas perguntas</h1>
        </div>`;


    for (let i = 1; i <= numeroDePerguntas; i++) {
        segundaAba.innerHTML += ` 
        <div class="pergunta-nova pergunta${i}">
            <h2>Pergunta ${i}</h2>
            <img src="./imagens/Vector.svg" onclick="exibeMenus('.pergunta${i}')"/>
        </div>
        <div class="caixa-crie-perguntas escondido pergunta${i}">
            <div class="crie-perguntas">
                <h2 onclick="exibeMenus('.pergunta${i}')">Pergunta ${i}</h2>
                <input placeholder="Texto da pergunta" />
                <input placeholder="Cor de fundo da pergunta" />

                <h2>Resposta correta</h2>
                <input placeholder="Resposta correta" />
                <input placeholder="Url da imagem" />

                <h2>Respostas incorretas</h2>
                <input placeholder="Resposta incorreta 1" />
                <input placeholder="Url da imagem 1" />

                <div class="espaço">
                    <input placeholder="Resposta incorreta 2" />
                    <input placeholder="Url da imagem 2" />
                </div>

                <div class="espaço">
                    <input placeholder="Resposta incorreta 3" />
                    <input placeholder="Url da imagem 3" />
                </div>
            </div>
         </div> 
    `
    }
    segundaAba.innerHTML += `
    <div class="prosseguir" onclick="verificaPerguntas()">
        <h1>Prosseguir pra criar níveis</h1>
    </div>`;
    exibeMenus('.pergunta1');
}


function exibeMenus(classeRecebida) {
    const perguntaExibida = document.querySelectorAll(classeRecebida);
    perguntaExibida[0].classList.toggle("escondido");
    perguntaExibida[1].classList.toggle("escondido");
}

function verificaPerguntas(){
    let listaInputs;
    let questaoPush;
    let sucesso = false;
    let respostaPush;

    for(let i = 0; i < numeroDePerguntas; i++){
        questaoPush = {
            title: "",
            color: "",
            answers: [{
                text: "",
                image: "",
                isCorrectAnswer: false
            }]
        };
        respostaPush = {
            text: "",
            image: "",
            isCorrectAnswer: false
        };
        listaInputs = document.querySelectorAll(`.pergunta${i+1} input`);
        if(listaInputs[0].value.length >= 20){
            questoesQuiz[i].title = listaInputs[0].value;                  
            if(listaInputs[1].value.match('#[0-9A-Fa-f]+') && listaInputs[1].value.length == 7){
                questoesQuiz[i].color = listaInputs[1].value;                            
                if(listaInputs[2].value.length != 0){
                    questoesQuiz[i].answers[0].text = listaInputs[2].value;
                    if(checkUrl(listaInputs[3].value)){
                        questoesQuiz[i].answers[0].image = listaInputs[3].value;
                        questoesQuiz[i].answers[0].isCorrectAnswer = true;
                        questoesQuiz[i].answers.push(respostaPush);
                        if(listaInputs[4].value.length != 0){
                            questoesQuiz[i].answers[1].text = listaInputs[4].value;
                            if(checkUrl(listaInputs[5].value)){
                                questoesQuiz[i].answers[1].image = listaInputs[5].value;
                                questoesQuiz[i].answers[1].isCorrectAnswer = false;
                                sucesso = true;
                                if(listaInputs[6].value.length != 0){
                                    if(checkUrl(listaInputs[7].value)){
                                        questoesQuiz[i].answers.push(respostaPush);
                                        questoesQuiz[i].answers[2].text = listaInputs[6].value;
                                        questoesQuiz[i].answers[2].image = listaInputs[7].value;
                                        questoesQuiz[i].answers[2].isCorrectAnswer = false;
                                        if(listaInputs[8].value.length != 0){
                                            if(checkUrl(listaInputs[9].value)){
                                                questoesQuiz[i].answers.push(respostaPush);
                                                questoesQuiz[i].answers[3].text = listaInputs[8].value;
                                                questoesQuiz[i].answers[3].image = listaInputs[9].value;
                                                questoesQuiz[i].answers[3].isCorrectAnswer = false;                                         
                                            }
                                        }
                                    }
                                }
                            } else{
                                alert('O formato não é uma url');
                            }
                        } else{
                            alert('O campo resposta não pode ficar vazio');
                        }
                    } else{
                        alert('O formato não é uma url');                  
                    }
                } else{
                    alert('O campo resposta não pode ficar vazio');
                }
                
            } else{
                alert('Formato de cor inválido');
            }
                
        }else{
            alert('texto invalido. Mínimo de 20 caracteres');
        }
        questoesQuiz.push(questaoPush);
        listaInputs.forEach(element => element.value = '');

    }
    questoesQuiz.pop();
    console.log(questoesQuiz);
    if(sucesso)
    {
        document.querySelector('.desktop-9').classList.add('escondido');  
        document.querySelector('.desktop10').classList.remove('escondido');
    }
    
}

// pulou de tela =>
function criarNivel() {
    const desktop9 = document.querySelector('.desktop-8');
    desktop9.classList.add('selecionado');

    const desktop10 = document.querySelector('.desktop-9');
    desktop10.classList.remove('selecionado');

    // titulo do nivel minimo 10 caracteres
    if (nivel >= 10) {
        return true;
    }

    // % de acerto minima, entre 0 e 100
    if (minima) {
        return true;
    }

    // url sempre em url
    if (url === url) {
        return true;
    }

    //descrição do nivel minimo 30 caracteres
    if (descrição >= 30) {
        return true;
    }

    // obrigatorio existir pelo menos um nivel com acerto minimo de 0%
    if (1) {
        return true;
    }

    alert('bota direito filho da puta');

    criacaoFinalizada();
}

// pulou de tela =>
// o usuario ve a tela final e pode acessar o quiz ou ir para home
function criacaoFinalizada() {
    const desktop10 = document.querySelector('.desktop-8');
    desktop10.classList.add('selecionado');

    const desktop11 = document.querySelector('.desktop-9');
    desktop11.classList.remove('selecionado');
}

criacaoFinalizada();

// acessar o quiz
function acessarOQuizz() {
    // ai vai pro quizz mas nem sei.
}

// se for pra home, la tem q estar o quizz criado
function voltarParaHome() {
    window.location.reload();
}

console.log('oi');
// const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizCriado);
// promessa.then(deuCertoTitulo);
// promessa.catch(deuErradoTitulo);

// // se der certo de mandar o titulo aparece aqui
// function deuCertoTitulo() {
//     console.log('deu certo mandar o titulo');
// }

// function deuErradoTitulo() {
//     console.log('error ao mandar o titulo');
// }