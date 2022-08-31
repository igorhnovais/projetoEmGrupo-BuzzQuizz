// Variaveis globais
let myStorage = localStorage;

function isUserQuiz (id){
    for (let i = 0; i < localStorage.length; i++){
        if(localStorage.getItem(localStorage.key(i)) === id)
            return true;
    }
    return false;
}

/*  requestQuizzes() -> faz a requisição dos quizes disponíveis no servidor e chama a função initQuizzes
 se for bem sucedida; caso contrário, chama a função requestError */

 function requestQuizzes(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(initQuizzes);
    promise.catch(requestError);
 }

/*  initQuizzes(response) -> carrega o layout 1 do desktop com a lista de quizes do usuário e a lista de todos
 quizes disponíveis extraído do servidor */

 function initQuizzes(response){
    // preenche a seção meus quizzes caso haja algum quiz criado pelo usuário
    const allQuizzes = document.querySelector('.container-quizzes');
    allQuizzes.innerHTML = '';
    if (myStorage.length != 0){
        const myQuizzes = document.querySelector('.container-seus-quizzes');
        changeLayout('desktop-1', 'desktop-2');
        myQuizzes.innerHTML = '';
    }
    // preenche os quizzes do servidor
    response.data.forEach(element => {
        if (isUserQuiz(element.id)){
            myQuizzes.innerHTML += `
            <div class="box-quizz ${element.id}">
                <img src= ${element.image} />
                <div class="titulo-box-quizz">${element.title}</div>
            </div>`;
        }
        allQuizzes.innerHTML += `
        <div class="box-quizz ${element.id}">
            <img src= ${element.image} />
            <div class="titulo-box-quizz">${element.title}</div>
        </div>`
    });
    console.log(response.data);
 }

 /* requestError(response) -> envia um alert de qual erro ocorreu durante a requisição ou post*/

 function requestError(response){
    alert(response.status);
 }

/*  changeLayout(toHideClass, toShowClass) -> recebe duas strings como parâmetros: um referente a 
    classe do layout a ser escondido; e o outro a do layout a ser mostrado */

function changeLayout(toHideClass, toShowClass){
    const toHideElement = document.querySelector('.' + toHideClass);
    const toShowElement = document.querySelector('.' + toShowClass);
    toHideElement.classList.add('escondido');
    toShowElement.classList.remove('escondido');
}

/*  clickedQuiz(idQuizSelected) -> recebe o elemento do quiz clicado no layout inicial como parâmetro, faz uma
requisição de acesso ao servidor e chama a função displayQuiz se for bem sucedida; caso contrário,
chama a função requestError  */

function clickedQuiz(idQuizSelected){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizSelected}`);
    promise.then(displayQuiz);
    promise.catch(requestError);
}
/*  displayQuiz(response) -> mostra o quiz no layout de exibição do quiz para ser respondido    */

/*  restartQuiz(this) -> recebe o quiz a ser reiniciado, e limpa tudo o que o usuário preencheu,
retornando ao estado inicial de exibição do quiz  */

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


 requestQuizzes();