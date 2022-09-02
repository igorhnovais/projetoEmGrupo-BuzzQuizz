// Variaveis globais
let myStorage = localStorage;
let quizReceived;
let responseQuiz;




// Esta função pode ficar separada do código acima, onde você preferir
function comparador() { 
    return Math.random() - 0.5; 
}


function isUserQuiz(id) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) === id)
            return true;
    }
    return false;
}

function selectOptionQuiz(ElementClicked) {
    let jaSelecionou = false;
    const listOptions = ElementClicked.parentElement.querySelectorAll('.alternativa');
    listOptions.forEach(element => {
        if (element.classList.contains('selecionado'))
            jaSelecionou = true;
    });

    if (!jaSelecionou) {
        ElementClicked.classList.add('selecionado');
        listOptions.forEach(element => {
            if (!element.classList.contains('selecionado'))
                element.classList.add('esfumacado');
        });
    }


    setTimeout(function (){

        if (ElementClicked.parentElement.parentElement.nextElementSibling == null){
            resultQuiz();

        } else {
            ElementClicked.parentElement.parentElement.nextElementSibling.scrollIntoView();
        }

    }, 2000);
}

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
    quizReceived.levels.forEach(element => {levelAchieved = hitPercentage > element.minValue ? element : levelAchieved });
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
    boxResultado.scrollIntoView();
}

/*  requestQuizzes() -> faz a requisição dos quizes disponíveis no servidor e chama a função initQuizzes
 se for bem sucedida; caso contrário, chama a função requestError */

function requestQuizzes() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(initQuizzes);
    promise.catch(requestError);
}

/*  initQuizzes(response) -> carrega o layout 1 do desktop com a lista de quizes do usuário e a lista de todos
 quizes disponíveis extraído do servidor */

function initQuizzes(response) {
    // preenche a seção meus quizzes caso haja algum quiz criado pelo usuário
    const allQuizzes = document.querySelector('.container-quizzes');
    allQuizzes.innerHTML = '';
    if (myStorage.length != 0) {
        const myQuizzes = document.querySelector('.container-seus-quizzes');
        changeLayout('desktop-1', 'desktop-2');
        myQuizzes.innerHTML = '';
    }
    // preenche os quizzes do servidor
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

}

/* requestError(response) -> envia um alert de qual erro ocorreu durante a requisição ou post*/

function requestError(response) {
    alert(response.status);
}

/*  changeLayout(toHideClass, toShowClass) -> recebe duas strings como parâmetros: um referente a 
    classe do layout a ser escondido; e o outro a do layout a ser mostrado */

function changeLayout(toHideClass, toShowClass) {
    const toHideElement = document.querySelector('.' + toHideClass);
    const toShowElement = document.querySelector('.' + toShowClass);
    toHideElement.classList.add('escondido');
    toShowElement.classList.remove('escondido');
}

/*  clickedQuiz(idQuizSelected) -> recebe o elemento do quiz clicado no layout inicial como parâmetro, faz uma
requisição de acesso ao servidor e chama a função displayQuiz se for bem sucedida; caso contrário,
chama a função requestError  */

function clickedQuiz(idQuizSelected) {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizSelected}`);
    promise.then(displayQuiz);
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
    layoutShowQuiz.firstElementChild.scrollIntoView();
}

/*  restartQuiz(this) -> recebe o quiz a ser reiniciado, e limpa tudo o que o usuário preencheu,
retornando ao estado inicial de exibição do quiz  */

function restartQuiz(){
    const boxResultado = document.querySelector('.box-resultado');
    boxResultado.parentElement.classList.add('escondido');
    displayQuiz(responseQuiz);
}

/*  createQuiz() -> busca os dados preenchidos nos layouts de inscrição para a requisição de um novo quiz,
 esvaziando todos os inputs em seguida, e enviando uma requisição de inscrição para o servidor: se for 
 bem sucedido, chama a função subscribedQuiz; caso contrário, chama a função requestError*/

/* subscribedQuiz(response) -> muda para o layout avisando que o quiz está pronto (Desktop - 11) */




//Alguns Detalhes de implementação

// Usar Local Storage pra armazenar os ids dos quizzes do usuário

// Na parte de reiniciar o quiz, scrollIntoView() pode ser útil pra voltar para a pergunta incial

// Caso alguma informação dada foi inválida no cadastro, exibir um alert para o usuário preencher os dados corretamente

// Quando voltar para Home, a lista de quizzes criados deve ser atualizada. Usar a solicitação de um quiz

// Não esquecer os atributos p/ correção automática

//Seção bônus (a ver)




// ---- script 2

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
    
    if(sucesso)
    {
        document.querySelector('.desktop-9').classList.add('escondido');  
        document.querySelector('.desktop10').classList.remove('escondido');
    }

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

        for (let i = 0; i < numeroDeNiveis; i++){
            criarNiveis.innerHTML += `
            <div class="pergunta-nova nivel${i+1}">
                    <h2> Nível ${i+1} </h2>
                    <img src="./imagens/Vector.svg" onclick="exibeMenus('.nivel${i+1}')"/>
            </div>
            <div class="caixa-perguntas-nivel escondido nivel${i+1}">
                <div class="perguntas">
                    <h2 onclick="exibeMenus('.nivel${i+1}')">Nível ${i+1}</h2>
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

function verificaNiveis(){
    let listaInputs;
    let nivelPush;
    let sucesso = false;
    let teveZero = false;

    for(let i = 0; i < numeroDeNiveis; i++){
        nivelPush = {
            title: "",
            image: "",
            text: "",
            minValue: 0
        };
        
        listaInputs = document.querySelectorAll(`.nivel${i+1} input`);
        if (listaInputs[0].value.length >= 10){
            nivelPerguntas[i].title = listaInputs[0].value;
            if(listaInputs[1].value >= 0 && listaInputs[1].value <= 100){
                if(listaInputs[1].value == 0){
                    teveZero = true;
                }
                nivelPerguntas[i].minValue = listaInputs[1].value;
                if(checkUrl(listaInputs[2].value)){
                    nivelPerguntas[i].image = listaInputs[2].value;
                    if(listaInputs[3].value.length >= 30){
                        nivelPerguntas[i].text = listaInputs[3].value;
                        sucesso = true;
                    } else {
                        alert('quantidade de caracteres tem que ser maior que 30')
                    }
                } else {
                    alert('url inserido invalido');
                }
            } else {
                alert('porcentagem invalida');
            }
        } else {
            alert('digitar a quantidade de caracteres correta');
        }

        nivelPerguntas.push(nivelPush);
    }
    
    if(!teveZero){
        for(let i = 0; i < numeroDeNiveis; i++){
            nivelPerguntas.pop();
        }
        alert('obrigatorio existir pelo menos um nivel com acerto minimo de 0%')
        sucesso = false;
    }

    nivelPerguntas.pop();

    if(sucesso)
    {
        let objetoQuestao = {questions:questoesQuiz};
        let objetoNiveis = {levels:nivelPerguntas};
        let quizzPronto = Object.assign({}, quizCriado, objetoQuestao,objetoNiveis);

       
        console.log(quizzPronto);

        const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizzPronto);
        promessa.then(resultadoQuizz);
        promessa.catch(erroRequisicao);
    }

    
}
/* let objetoQuestao = {questions:questoesQuiz};
let objetoNiveis = {levels:nivelPerguntas};
let quizzPronto = { 
    title:  "huahau hauhauh uah auah auhauah aa a ", 
    image: "https://trello.com/b/uHmRqbTf/projet%C3%A3o-buzzquizz", 
    questions: [{
        title: "uahuahuahuahuahuahauhauhauhauahuahuahuha", 
        color: "#000000", 
        answers: [{
            text: "hauhauhauhauhauhauhauahuahuahuahuahuahuahauh", 
            image: "https://trello.com/b/uHmRqbTf/projet%C3%A3o-buzzquizz", 
            isCorrectAnswer: false}]}],
    levels: [{
        title: "ahuahuha uahuhauha uahuah auha uha uah", 
        image: "https://trello.com/b/uHmRqbTf/projet%C3%A3o-buzzquizz", 
        text: "auhuahuahauhauh uah auha uhauahuahuahauha uhauahuah",
        minValue: 0}]

    };

let objetoQuestao = {questions:questoesQuiz};
let objetoNiveis = {levels:nivelPerguntas};

console.log( Object.assign({}, quizCriado, objetoQuestao,objetoNiveis)); */
// pulou de tela =>
// o usuario ve a tela final e pode acessar o quiz ou ir para home
function resultadoQuizz(response){
    console.log(response);
}

function erroRequisicao() {
   console.log('error ao mandar requisição');
}





// const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizCriado);
// promessa.then(deuCertoTitulo);
// promessa.catch(deuErradoTitulo);


requestQuizzes();