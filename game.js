function ScoreBoardGameControl (){
	var score = 0;
	var POINT_GAME = 10;
	var TEXT_SCORE = "Sua pontuação: "
	var TENTATIVAS=0;
	var TOTAL_CORRECT = 80;
	var corrects = 0;

	this.updateScore =  function (){
		var scoreDiv = document.getElementById("score");
		//scoreDiv.innerHTML =  TEXT_SCORE + score;
		var tentativaDiv = document.getElementById("tentativa")
		tentativaDiv.innerHTML= "Tentativas:"+TENTATIVAS;
		var acertoDiv = document.getElementById("acerto")
		acertoDiv.innerHTML= "Acertos:"+corrects;
	}

	this.incrementScore =  function (){
		corrects++;
		TENTATIVAS++;
		score+= POINT_GAME;
		if (corrects ==  8){
			//alert("Fim de jogo! Parabéns!");
			setTimeout(abreModal, 1000);
		}
	}

	this.decrementScore =  function (){
		TENTATIVAS++;
		score-= POINT_GAME;
	}
}


function Card(picture){
	var FOLDER_IMAGES = 'resources/'
	var IMAGE_QUESTION  = "question.jpg"
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals =  function (cardGame){
		if (this.picture.valueOf() == cardGame.picture.valueOf()){
			//var textWrapper = document.querySelector('.ml6 .letter');
			var textWrapper = document.getElementById("nomePassaro");
			textWrapper.style='visibility: visible';
			if(this.picture.valueOf()=='1.jpg'){
				textWrapper.innerHTML ="Você encontrou o Papagaio-verdadeiro (Amazona aestiva)! &#x1F3C6; ";
			}if(this.picture.valueOf()=='2.jpg'){
				textWrapper.innerHTML ="Você encontrou o Araçari-castanho (Pteroglossus castanotis)! &#x1F3C6; ";
			}if(this.picture.valueOf()=='3.jpg'){
				textWrapper.innerHTML ="Você encontrou a Arara-azul (Anodorhynchus hyacinthinus)! &#x1F3C6;";
			}if(this.picture.valueOf()=='4.jpg'){
				textWrapper.innerHTML ="Você encontrou a Arara-vermelha (Ara chloropterus)! &#x1F3C6; ";
			}if(this.picture.valueOf()=='5.jpg'){
				textWrapper.innerHTML ="Você encontrou o Gavião-real (Harpia harpyia)!  &#x1F3C6;";
			}if(this.picture.valueOf()=='6.jpg'){
				textWrapper.innerHTML ="Você encontrou o Gavião-carijó (Rupornis magnirostris)! &#x1F3C6;";
			}if(this.picture.valueOf()=='7.jpg'){
				textWrapper.innerHTML ="Você encontrou o Gavião-real (Harpia harpyia)! &#x1F3C6;";
			}if(this.picture.valueOf()=='8.jpg'){
				textWrapper.innerHTML ="Você encontrou o Udu-de-coroa-azul (Momotus momota)! &#x1F3C6; ";
			}
			return true;
		}
		return false;
	}
	
	//this.adicionaToltip = function(){
		//return
	//}
	this.getPathCardImage =  function(){
		return FOLDER_IMAGES+picture;
	}
	this.getQuestionImage =  function(){
		return FOLDER_IMAGES+IMAGE_QUESTION;
	}
}

function ControllerLogicGame(){
	var firstSelected;
	var secondSelected;
	var block = false;
	var TIME_SLEEP_BETWEEN_INTERVAL = 1000;
	var eventController = this;

	this.addEventListener =  function (eventName, callback){
		eventController[eventName] = callback;
	};
	
	this.doLogicGame =  function (card,callback){
		if (!card.block && !block) {
			if (firstSelected == null){
				firstSelected = card;
				card.visible = true;
			}else if (secondSelected == null && firstSelected != card){
				secondSelected = card;
				card.visible = true;
			}

			if (firstSelected != null && secondSelected != null){
				block = true;
				var timer = setInterval(function(){
					if (secondSelected.equals(firstSelected)){
						firstSelected.block = true;
						secondSelected.block = true;
						eventController["correct"](); 
					}else{
						firstSelected.visible  = false;
						secondSelected.visible  = false;
						eventController["wrong"]();
					}        				  		
					firstSelected = null;
					secondSelected = null;
					clearInterval(timer);
					block = false;
					eventController["show"]();
				},TIME_SLEEP_BETWEEN_INTERVAL);
			} 
			eventController["show"]();
		};
	};

}
function CardGame (cards , controllerLogicGame,scoreBoard){
	var LINES = 4;
	var COLS  = 4;
	this.cards = cards;
	var logicGame = controllerLogicGame;
	var scoreBoardGameControl = scoreBoard;
	this.clear = function (){
		var game = document.getElementById("game");
		game.innerHTML = '';
	}
	this.show =  function (){
		this.clear();
		scoreBoardGameControl.updateScore();
		var cardCount = 0;
		var game = document.getElementById("game");
		for(var i = 0 ; i < LINES; i++){
			for(var j = 0 ; j < COLS; j++){
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				cardImage.className="responsive rounded mr-1 mt-1";
				if (card.visible){
					cardImage.src=card.getPathCardImage();
				}else{
					cardImage.src=card.getQuestionImage();
				}
				cardImage.onclick =  (function(position,cardGame) {
					return function() {
						card = cards[position];
						var callback =  function (){
							cardGame.show();
						};
						logicGame.addEventListener("correct",function (){
							scoreBoardGameControl.incrementScore();
							scoreBoardGameControl.updateScore();
						});
						logicGame.addEventListener("wrong",function (){
							scoreBoardGameControl.decrementScore();
							scoreBoardGameControl.updateScore();
						});

						logicGame.addEventListener("show",function (){
							cardGame.show();
						});

						logicGame.doLogicGame(card);
						
					};
				})(cardCount-1,this);

			game.appendChild(cardImage);
			}
			
		}
	}
}
function BuilderCardGame(){
	var pictures = new Array ('1.jpg','1.jpg',
		'2.jpg','2.jpg',
		'3.jpg','3.jpg',
		'4.jpg','4.jpg',
		'5.jpg','5.jpg',
		'6.jpg','6.jpg',
		'7.jpg','7.jpg',
		'8.jpg','8.jpg');
	this.doCardGame =  function (){
		shufflePictures();
		cards  = buildCardGame();
		cardGame =  new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl())
		cardGame.clear();
		return cardGame;
	}
	var shufflePictures = function(){
		var i = pictures.length, j, tempi, tempj;
		if ( i == 0 ) return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = pictures[i];
			tempj = pictures[j];
			pictures[i] = tempj;
			pictures[j] = tempi;
		}
	}
	var buildCardGame =  function (){
		var countCards = 0;
		cards =  new Array();
		for (var i = pictures.length - 1; i >= 0; i--) {
			card =  new Card(pictures[i]);
			cards[countCards++] = card;
		};
		return cards;
	}
}

function GameControl (){

}

GameControl.createGame = function(){
	var builderCardGame =  new BuilderCardGame();
	cardGame = builderCardGame.doCardGame();
	cardGame.show();

	var textWrapper = document.getElementById("nomePassaro");
	textWrapper.style='visibility: hidden';

}

function abreModal() {
	$("#myModal").modal({
	  show: true
	});
  }