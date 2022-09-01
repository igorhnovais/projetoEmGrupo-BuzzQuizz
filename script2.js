let quizCriado = { 
    title: "", 
    image: "", 
    questions: [{
        title: "", 
        color: "", 
        answers: [{
            text: "", 
            image: "", 
            isCorrectAnswer: false}]}],
    levels: [{
        title: "", 
        image: "", 
        text: "",
        minValue: 0}]
    
};

let numeroDePerguntas;
let numeroDeNiveis;

// função para validar a url
function checkUrl(string) {
    try {
     let url = new URL(string)
     return true;
   } catch(err) {
      return false;
   }
 } 

// ao clicar no criar quizz ou no +, deve sumir a tela 1 e aparecer a tela 3.
function criarQuizzNovo(){

    const caixaPerguntas = document.querySelector('.perguntas');

    let pergunta = caixaPerguntas.firstElementChild; 

        if(pergunta.value.length >= 20 && pergunta.value.length <= 65){
            quizCriado.title = pergunta.value;
            pergunta.value = '';
            // pegar o outro input filho
            pergunta = pergunta.nextElementSibling;
            if(checkUrl(pergunta.value)){
                quizCriado.image = pergunta.value;
                pergunta.value = '';

                pergunta = pergunta.nextElementSibling;
                if(Number(pergunta.value) >= 3){
                    numeroDePerguntas = pergunta.value;
                    pergunta.value = '';

                    pergunta = pergunta.nextElementSibling;

                    if(Number(pergunta.value) >=2){
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


}

// pulou de tela =>
function crieSuasPerguntas(){
    

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


const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizCriado);
promessa.then(deuCertoTitulo);
promessa.catch(deuErradoTitulo);

// se der certo de mandar o titulo aparece aqui
function deuCertoTitulo(){
    console.log('deu certo mandar o titulo');
}

function deuErradoTitulo(){
    console.log('error ao mandar o titulo');
}