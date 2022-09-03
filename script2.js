// Variaveis de escopo global
let quizReceived;
let responseQuiz;
let numeroDePerguntas;
let numeroDeNiveis;

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


// --------------------------------------Início funções auxiliares pro nosso código------------------
function comparador() {
    return Math.random() - 0.5;
}

// Retorna true se o id do quiz está no localStorage; false caso contrário
function isUserQuiz(id) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) == id)
            return true;
    }
    return false;
}


// função para validar a url
function checkUrl(string) {
    try {
        let url = new URL(string)
        return true;
    } catch (err) {
        return false;
    }
}

/*  changeLayout(toHideClass, toShowClass) -> recebe duas strings como parâmetros: um referente a 
    classe do layout a ser escondido; e o outro a do layout a ser mostrado */

function changeLayout(toHideClass, toShowClass) {
    const toHideElement = document.querySelector('.' + toHideClass);
    const toShowElement = document.querySelector('.' + toShowClass);
    toHideElement.classList.add('escondido');
    toShowElement.classList.remove('escondido');
}

// Retira todos os elementos inseridos no array deixando somente o primeiro
function resetaArray(arrayRecebido) {
    while (arrayRecebido.length > 0) {
        arrayRecebido.pop();
    }
}

//  --------------------------Fim funções auxiliares pro nosso código--------------------------------


//  --------------------------Começo funções essenciais do código------------------------------------

/* requestError(response) -> envia um alert de qual erro ocorreu durante a requisição ou post*/
function requestError(response) {
    alert(response.status);
}

/*  initQuizzes(response) -> carrega o layout 1 do desktop com a lista de quizes do usuário e a lista de todos
 quizes disponíveis extraído do servidor */
function initQuizzes(response) {
    //  preenche a seção meus quizzes caso haja algum quiz criado pelo usuário   
    const allQuizzes = document.querySelector('.container-quizzes');
    let myQuizzes = document.querySelector('.desktop-2');
    allQuizzes.innerHTML = '';
    myQuizzes.innerHTML = `
        <div class="seus-quizzes">
            <h1>Seus Quizzes</h1>
            <ion-icon name="add-circle" onclick="changeLayout('lista-quizzes','criar-quizz')"></ion-icon>
        </div>
        <div class="container-seus-quizzes">   
        </div>
        `;
    myQuizzes = document.querySelector('.container-seus-quizzes');

    //  preenche os quizzes do servidor
    response.data.forEach(element => {
        if (isUserQuiz(element.id)) {
            myQuizzes.innerHTML += `
            <div class="box-quizz ${element.id}" onclick="clickedQuiz(${element.id})">
                <img src= ${element.image} />
                <div class="titulo-box-quizz">${element.title}</div>
            </div>`;
        }
        allQuizzes.innerHTML += `
        <div class="box-quizz ${element.id}" onclick="clickedQuiz(${element.id})">
            <img src= ${element.image} />
            <div class="titulo-box-quizz">${element.title}</div>
        </div>`
    });
    if (myQuizzes.innerHTML !== '') {
        changeLayout('desktop-1', 'desktop-2');
    }
}

/*  requestQuizzes() -> faz a requisição dos quizes disponíveis no servidor e chama a função initQuizzes
 se for bem sucedida; caso contrário, chama a função requestError */

function requestQuizzes() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(initQuizzes);
    promise.catch(requestError);
}

/*  displayQuiz(response) -> mostra o quiz no layout de exibição do quiz para ser respondido    */

function displayQuiz(response) {
    responseQuiz = response;
    let layoutAnswers;
    const layoutShowQuiz = document.querySelector('.desktop-4');
    quizReceived = response.data;

    changeLayout('lista-quizzes', 'pagina-quizz');
    layoutShowQuiz.innerHTML = `
    <div class="titulo-quizz">
          <p>${quizReceived.title}</p>
          <img src=${quizReceived.image} alt="" />
    </div>
    `;
    quizReceived.questions.forEach(element => {
        layoutAnswers = '';
        element.answers.sort(comparador);
        element.answers.forEach(answer => {
            layoutAnswers += `
            <li class="alternativa ${answer.isCorrectAnswer}" onclick="selectOptionQuiz(this)">
                <img src=${answer.image} />
                <p>${answer.text}</p>
            </li>    
            `;
        });
        layoutShowQuiz.innerHTML += `
        <div class="box-pergunta">
            <div style="background-color:${element.color};" class="titulo-pergunta">
                ${element.title}
            </div>
            <ul class="alternativas-pergunta">
                ${layoutAnswers}
            </ul>
        </div>
        `;
    });
    layoutShowQuiz.firstElementChild.nextElementSibling.scrollIntoView({ behavior: "smooth" });
}

/*  clickedQuiz(idQuizSelected) -> recebe o elemento do quiz clicado no layout inicial como parâmetro, faz uma
requisição de acesso ao servidor e chama a função displayQuiz se for bem sucedida; caso contrário,
chama a função requestError  */

function clickedQuiz(idQuizSelected) {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizSelected}`);
    promise.then(displayQuiz);
    promise.catch(requestError);
}

//  Função que seleciona a resposta clicada pelo usuário na tela de resolução do quiz

function selectOptionQuiz(ElementClicked) {
    let jaSelecionou = false;
    const listOptions = ElementClicked.parentElement.querySelectorAll('.alternativa');
    listOptions.forEach(element => {
        if (element.classList.contains('selecionado'))
            jaSelecionou = true;
    });

    if (!jaSelecionou) {
        ElementClicked.classList.add('selecionado');
        if (ElementClicked.classList.contains('true'))
            ElementClicked.classList.add('verde');
        else
            ElementClicked.classList.add('vermelho');
        listOptions.forEach(element => {
            if (!element.classList.contains('selecionado')) {
                element.classList.add('esfumacado');
            }
        });
    }


    setTimeout(function () {

        if (ElementClicked.parentElement.parentElement.nextElementSibling == null) {
            resultQuiz();

        } else {
            ElementClicked.parentElement.parentElement.nextElementSibling.scrollIntoView({ behavior: "smooth" });
        }

    }, 500);
}

//  Calcula o resultado do quiz criado
function resultQuiz() {
    let hitPercentage;
    let hits = 0;
    let levelAchieved = quizReceived.levels[0];
    const boxResultado = document.querySelector('.box-resultado');
    const numberOfQuestions = document.querySelectorAll('.box-pergunta').length;
    const answers = document.querySelectorAll('.desktop-4 .true');
    answers.forEach(element => {
        if (element.classList.contains('selecionado'))
            hits++;
    });

    hitPercentage = Math.round(100 * hits / numberOfQuestions);
    quizReceived.levels.forEach(element => { levelAchieved = hitPercentage > element.minValue ? element : levelAchieved });
    boxResultado.innerHTML = `
    <div class="titulo-resultado">${hitPercentage}% de acerto: ${levelAchieved.title}</div>
    <div class="resultado">
        <img src=${levelAchieved.image} />
        <p>${levelAchieved.text}</p>
    </div>
    <div class="finalizar-quizz">
        <button class="botao-reiniciar" onclick='restartQuiz()'>Reiniciar Quizz</button>
        <button class="botao-home" onclick="changeLayout('pagina-quizz','lista-quizzes')">Voltar pra Home</button>
    </div>`
        ;
    boxResultado.parentElement.classList.remove('escondido');
    boxResultado.scrollIntoView({ behavior: "smooth" });
}

/*  restartQuiz(this) -> recebe o quiz a ser reiniciado, e limpa tudo o que o usuário preencheu,
retornando ao estado inicial de exibição do quiz  */

function restartQuiz() {
    const boxResultado = document.querySelector('.box-resultado');
    boxResultado.parentElement.classList.add('escondido');
    displayQuiz(responseQuiz);
}


function criarQuizzNovo() {
    const inputList = document.querySelectorAll('.perguntas input');

    if (inputList[0].value.length >= 20 && inputList[0].value.length <= 65) {
        quizCriado.title = inputList[0].value;
        if (checkUrl(inputList[1].value)) {
            quizCriado.image = inputList[1].value;
            if (Number(inputList[2].value) >= 3) {
                numeroDePerguntas = inputList[2].value;
                if (Number(inputList[3].value) >= 2) {
                    numeroDeNiveis = inputList[3].value;
                    sucesso = true;
                } else {
                    alert('Verifique o numero de Níveis (2 ou mais)');
                    return;
                }
            } else {
                alert('Verifique o número de perguntas (3 ou mais)');
                return;
            }
        } else {
            alert('Por favor, digite uma URL válida.');
            return;
        }

    } else {
        alert('Verifique o título (entre 20 e 65 caracteres)');
        return;
    }

    inputList.forEach(element => element.value = '');
    changeLayout('desktop-8', 'desktop-9');
    displayCriarPerguntas();
}

//  Exibe/esconde os menus de preenchimento de perguntas e níveis
function exibeMenus(classeRecebida) {
    const perguntaExibida = document.querySelectorAll(classeRecebida);
    perguntaExibida[0].classList.toggle("escondido");
    perguntaExibida[1].classList.toggle("escondido");
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


function verificaPerguntas() {
    let listaInputs;
    let questaoPush;
    let respostaPush;
    resetaArray(questoesQuiz);
    for (let i = 0; i < numeroDePerguntas; i++) {
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
        listaInputs = document.querySelectorAll(`.pergunta${i + 1} input`);
        questoesQuiz.push(questaoPush);
        if (listaInputs[0].value.length >= 20) {
            questoesQuiz[i].title = listaInputs[0].value;
            if (listaInputs[1].value.match('#[0-9A-Fa-f]+') && listaInputs[1].value.length == 7) {
                questoesQuiz[i].color = listaInputs[1].value;
                if (listaInputs[2].value.length != 0) {
                    questoesQuiz[i].answers[0].text = listaInputs[2].value;
                    if (checkUrl(listaInputs[3].value)) {
                        questoesQuiz[i].answers[0].image = listaInputs[3].value;
                        questoesQuiz[i].answers[0].isCorrectAnswer = true;
                        if (listaInputs[4].value.length != 0) {
                            questoesQuiz[i].answers.push(respostaPush);
                            questoesQuiz[i].answers[1].text = listaInputs[4].value;
                            if (checkUrl(listaInputs[5].value)) {
                                questoesQuiz[i].answers[1].image = listaInputs[5].value;
                                questoesQuiz[i].answers[1].isCorrectAnswer = false;
                                if (listaInputs[6].value.length != 0) {
                                    if (checkUrl(listaInputs[7].value)) {
                                        questoesQuiz[i].answers.push(respostaPush);
                                        questoesQuiz[i].answers[2].text = listaInputs[6].value;
                                        questoesQuiz[i].answers[2].image = listaInputs[7].value;
                                        questoesQuiz[i].answers[2].isCorrectAnswer = false;
                                        if (listaInputs[8].value.length != 0) {
                                            if (checkUrl(listaInputs[9].value)) {
                                                questoesQuiz[i].answers.push(respostaPush);
                                                questoesQuiz[i].answers[3].text = listaInputs[8].value;
                                                questoesQuiz[i].answers[3].image = listaInputs[9].value;
                                                questoesQuiz[i].answers[3].isCorrectAnswer = false;
                                            }
                                        }
                                    }
                                }
                            } else {
                                alert('URL inválida');
                                resetaArray(questoesQuiz);
                                return;
                            }
                        } else {
                            alert('O campo resposta não pode ficar vazio');
                            resetaArray(questoesQuiz);
                            return;
                        }
                    } else {
                        alert('URL inválida');
                        resetaArray(questoesQuiz);
                        return;
                    }
                } else {
                    alert('O campo resposta não pode ficar vazio');
                    resetaArray(questoesQuiz);
                    return;
                }

            } else {
                alert('Formato de cor inválido');
                resetaArray(questoesQuiz);
                return;
            }

        } else {
            alert('Verifique o título (entre 20 e 65 caracteres)');
            resetaArray(questoesQuiz);
            return;
        }
    }
    listaInputs.forEach(element => element.value = '');
    changeLayout('desktop-9', 'desktop10');
    displayCriaNiveis();

}


// pulou de tela =>
function displayCriaNiveis() {

    const criarNiveis = document.querySelector('.terceira-aba');
    criarNiveis.innerHTML = `
        <div class="titulo">
            <h1>Agora, decida os níveis</h1>
        </div>
        `;

    for (let i = 0; i < numeroDeNiveis; i++) {
        criarNiveis.innerHTML += `
            <div class="pergunta-nova nivel${i + 1}">
                    <h2> Nível ${i + 1} </h2>
                    <img src="./imagens/Vector.svg" onclick="exibeMenus('.nivel${i + 1}')"/>
            </div>
            <div class="caixa-perguntas-nivel escondido nivel${i + 1}">
                <div class="perguntas">
                    <h2 onclick="exibeMenus('.nivel${i + 1}')">Nível ${i + 1}</h2>
                    <input placeholder="Titulo do nível" />
                    <input placeholder="% de acerto mínima" />
                    <input placeholder="Url da imagem do nível" />
                    <input placeholder="Descrição do nível" />
                </div>
            </div>
            `;
    }

    criarNiveis.innerHTML += `
            <div class="prosseguir" onclick="verificaNiveis()">
                <h1>Finalizar quizz</h1>
            </div>
         `;

    exibeMenus('.nivel1');


}

function verificaNiveis() {
    let listaInputs;
    let nivelPush;
    let teveZero = false;
    resetaArray(nivelPerguntas);

    for (let i = 0; i < numeroDeNiveis; i++) {
        nivelPush = {
            title: "",
            image: "",
            text: "",
            minValue: 0
        };
        nivelPerguntas.push(nivelPush);
        listaInputs = document.querySelectorAll(`.nivel${i + 1} input`);
        if (listaInputs[0].value.length >= 10) {
            nivelPerguntas[i].title = listaInputs[0].value;
            if (listaInputs[1].value >= 0 && listaInputs[1].value <= 100 && listaInputs[1].value !== '') {
                if (listaInputs[1].value == 0) {
                    teveZero = true;
                }
                nivelPerguntas[i].minValue = listaInputs[1].value;
                if (checkUrl(listaInputs[2].value)) {
                    nivelPerguntas[i].image = listaInputs[2].value;
                    if (listaInputs[3].value.length >= 30) {
                        nivelPerguntas[i].text = listaInputs[3].value;
                        sucesso = true;
                    } else {
                        alert('Sua mensagem deve conter 30 caracteres ou mais');
                        resetaArray(nivelPerguntas);
                        return;
                    }
                } else {
                    alert('URL inválida');
                    resetaArray(nivelPerguntas);
                    return;
                }
            } else {
                alert('Valor de porcentagem (%) inválido');
                resetaArray(nivelPerguntas);
                return;
            }
        } else {
            alert('O Título do seu Nível deve conter 10 caracteres ou mais');
            resetaArray(nivelPerguntas);
            return;
        }
    }

    if (teveZero) {
        console.log(questoesQuiz);
        let objetoQuestao = { questions: questoesQuiz };
        let objetoNiveis = { levels: nivelPerguntas };
        let quizzPronto = Object.assign({}, quizCriado, objetoQuestao, objetoNiveis);
        const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizzPronto);
        promessa.then(resultadoCriarQuiz);
        promessa.catch(requestError);
        console.log(quizzPronto);
    } else {
        alert('Obrigatório pelo menos um nivel com acerto minimo de 0%');
        resetaArray(nivelPerguntas);
    }

}

// o usuario ve a tela final e pode acessar o quiz ou ir para home
function resultadoCriarQuiz(response) {
    const menuSucesso = document.querySelector('.quarta-aba');
    const meuQuiz = response.data;
    console.log(response);
    localStorage.setItem(`Quiz id ${meuQuiz.id}`, meuQuiz.id);
    changeLayout('desktop10', 'desktop11');
    menuSucesso.innerHTML = `
    <div class="titulo">
        <h1>Seu quizz está pronto!</h1>
    </div>
    <div class="box-quizz" onclick='clickedQuiz(${meuQuiz.id})'>
        <img src="${meuQuiz.image}"/>
        <div class="titulo-box-quizz">
            ${meuQuiz.title}
        </div>
    </div>

    <div class="prosseguir" onclick="changeLayout('criar-quizz','lista-quizzes'); clickedQuiz(${meuQuiz.id})">
        <h1>Acessar quizz</h1>
    </div>

    <div class="voltar-home" onclick="changeLayout('criar-quizz','lista-quizzes'); requestQuizzes();">
        <h1>Voltar pra home</h1>
    </div>
    `;
}

// Não esquecer os atributos p/ correção automática
requestQuizzes();

//  --------------------------Fim funções essenciais do código---------------------------------------