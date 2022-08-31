// Variaveis globais


/*  requestQuizzes -> faz a requisição dos quizes disponíveis no servidor e chama a função initQuizzes
 se for bem sucedida; caso contrário, chama a função requestError */

/*  initQuizzes(response) -> carrega o layout 1 do desktop com a lista de quizes do usuário e a lista de todos
 quizes disponíveis extraído do servidor */

 /* requestError(response) -> envia um alert de qual erro ocorreu durante a requisição ou post*/

/*  changeLayout(toHideElement, toShowElement) -> recebe dois elementos como parâmetros: o do layout a
ser escondido; e o do layout a ser mostrado */

/*  clickedQuiz(this) -> recebe o elemento do quiz clicado no layout inicial como parâmetro, faz uma
requisição de acesso ao servidor e chama a função displayQuiz se for bem sucedida; caso contrário,
chama a função requestError  */

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