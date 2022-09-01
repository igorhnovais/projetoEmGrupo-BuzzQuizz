// ao clicar no criar quizz ou no +, deve sumir a tela 1 e aparecer a tela 3.
function criarQuizzNovo(){

    const tela1 = document.querySelector('.lista-quizzes');
    tela1.classList.add('escondido');

    const tela3 = document.querySelector('.criar-quizz');
    tela3.classList.remove('escondido');

    // apareceu a tela, titulo 20-65 caracteres
    if(titulo > 20  && titulo < 65){
        return true;
    };

    // url no formato url
    if(url === url){
        return true;
    }

    // quantidade de no minimo 3 perguntas
    if(perguntas >= 3){
        return true;
    }

    // quanridade de niveis no minimo 2 no niveis
    if (niveis >= 2){
        return true;
    }

    alert('bota direito filho da puta');
    
     crieSuasPerguntas();
    
}

// pulou de tela =>
function crieSuasPerguntas(){
    const desktop8 = document.querySelector('.desktop-8');
    desktop8.classList.add('selecionado');

    const desktop9 = document.querySelector('.desktop-9');
    desktop9.classList.remove('selecionado');

    // texto da pergunta no minimo 20 caracteres
    if(texto >= 20){
        return true;
    }

    //cor de fundo hexadecimal, começar com # seguida de 6 caracteres, numeros ou letras de A a F
    if(cor === "hexadecimal"){
        return true;
    }

    // texto das respostas não pode ser vazio
    if(texto === defined){
        return true;
    }

    //url deve ser formato url
    if(url === url){
        return true;
    }

    // pelo menos uma resposta falsa e uma verdadeira
    if(resposta === true && resposta === false){
        return true;
    }
 
    alert('bota direito filho da puta');

    criarNivel();
}

// pulou de tela =>
function criarNivel(){
    const desktop9 = document.querySelector('.desktop-8');
    desktop9.classList.add('selecionado');

    const desktop10 = document.querySelector('.desktop-9');
    desktop10.classList.remove('selecionado');

    // titulo do nivel minimo 10 caracteres
    if(nivel >= 10){
        return true;
    }

    // % de acerto minima, entre 0 e 100
    if(minima){
        return true;
    }

    // url sempre em url
    if(url === url){
        return true;
    }

    //descrição do nivel minimo 30 caracteres
    if(descrição >= 30){
        return true;
    }

    // obrigatorio existir pelo menos um nivel com acerto minimo de 0%
    if(1){
        return true;
    }

    alert('bota direito filho da puta');

    criacaoFinalizada();
}

// pulou de tela =>
// o usuario ve a tela final e pode acessar o quiz ou ir para home
function criacaoFinalizada(){
    const desktop10 = document.querySelector('.desktop-8');
    desktop10.classList.add('selecionado');

    const desktop11 = document.querySelector('.desktop-9');
    desktop11.classList.remove('selecionado');  
}

criacaoFinalizada();

 // acessar o quiz
 function acessarOQuizz(){
    // ai vai pro quizz mas nem sei.
}

// se for pra home, la tem q estar o quizz criado
function voltarParaHome(){
    window.location.reload();
}


