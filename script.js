let selectedDisc = null;
let selectedTower = null;
let moveCount = 0;
let maxMoves = 0;
let gameOver = false; // Variável para evitar que o jogo continue após o fim

// Elementos da interface
const towers = document.querySelectorAll(".tower");
const movesCounter = document.getElementById("moves-counter");
const victoryMessage = document.getElementById("victory-message");
const failureMessage = document.getElementById("failure-message");
const totalMoves = document.getElementById("total-moves");
const usedMoves = document.getElementById("used-moves");
const maxMovesDisplay = document.getElementById("max-moves");
const restartBtn = document.getElementById("restart");
const restartFailureBtn = document.getElementById("restart-failure");
const difficultySelect = document.getElementById("difficulty");
const restartControlBtn = document.getElementById("restart-control"); // Novo botão de reiniciar ao lado da dificuldade

// Modal de Como Jogar
const modal = document.getElementById("modal");
const howToPlayBtn = document.getElementById("how-to-play");
const closeModal = document.querySelector(".close");

// Abre o modal
howToPlayBtn.addEventListener("click", function () {
  modal.style.display = "block";
});

// Fecha o modal
closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Função para gerar os discos com base na dificuldade selecionada
function generateDiscs(difficulty) {
  gameOver = false; // Reinicia a variável de controle de fim de jogo
  towers.forEach((tower) => {
    tower.innerHTML = ""; // Limpa todas as torres
  });

  const towerA = document.getElementById("towerA");
  for (let i = difficulty; i > 0; i--) {
    const disc = document.createElement("div");
    disc.classList.add("disc");
    disc.dataset.size = i;
    towerA.appendChild(disc);
  }

  // Ajustar a largura das torres para dificuldade difícil
  if (difficulty == 5) {
    towers.forEach((tower) => tower.classList.add("dificil"));
  } else {
    towers.forEach((tower) => tower.classList.remove("dificil"));
  }

  // Definir os movimentos máximos permitidos com base na dificuldade
  if (difficulty == 3) {
    maxMoves = 7; // Por exemplo, para 3 discos
  } else if (difficulty == 4) {
    maxMoves = 15; // Para 4 discos
  } else if (difficulty == 5) {
    maxMoves = 31; // Para 5 discos
  }

  moveCount = 0;
  updateMoveCount();
  maxMovesDisplay.textContent = maxMoves; // Atualiza o número máximo de movimentos permitidos
}

// Atualiza o contador de movimentos
function updateMoveCount() {
  movesCounter.textContent = `Movimentos: ${moveCount} / ${maxMoves}`;

  // Alterar a lógica para que o jogador possa completar o jogo com exatos "maxMoves"
  if (moveCount > maxMoves && !gameOver) {
    triggerFailure(); // Exibe a mensagem de falha se o número de movimentos for excedido
  }
}

// Função para verificar se o jogador venceu
function checkVictory() {
  const towerC = document.getElementById("towerC");
  const discs = towerC.querySelectorAll(".disc");
  const difficulty = document.getElementById("difficulty").value;

  // Verifica se todos os discos estão na Torre C
  if (discs.length == difficulty && !gameOver) {
    setTimeout(() => {
      // Garante que a verificação ocorra após o movimento
      victoryMessage.classList.add("visible");
      totalMoves.textContent = moveCount;
      gameOver = true; // Define como fim de jogo para impedir mais movimentos
    }, 500); // Pequeno atraso para aguardar a conclusão do movimento
  }
}

// Função para mover o disco
function moveDisc(fromTower, toTower) {
  if (gameOver) return; // Impede qualquer movimento após o fim do jogo

  const fromDiscs = fromTower.querySelectorAll(".disc");
  const toDiscs = toTower.querySelectorAll(".disc");

  // Verifica se a torre de origem tem discos
  if (fromDiscs.length === 0) return;

  const fromTopDisc = fromDiscs[fromDiscs.length - 1];
  const toTopDisc = toDiscs[toDiscs.length - 1];

  // Evita mover para a mesma torre de onde o disco foi retirado
  if (fromTower === toTower) return;

  // Regras: só mover se o destino está vazio ou o disco do destino for maior
  if (
    !toTopDisc ||
    (toTopDisc && fromTopDisc.dataset.size < toTopDisc.dataset.size)
  ) {
    fromTopDisc.classList.add("move"); // Adiciona animação de movimento
    setTimeout(() => {
      toTower.appendChild(fromTopDisc);
      fromTopDisc.classList.remove("move");
      moveCount++; // Incrementa o contador de movimentos
      updateMoveCount(); // Atualiza o contador na interface
      checkVictory(); // Verifica se o jogador venceu
    }, 400); // Tempo da animação antes de verificar o movimento
  }
}

// Função para tratar falha por exceder movimentos
function triggerFailure() {
  failureMessage.classList.add("visible");
  usedMoves.textContent = moveCount;
  gameOver = true; // Define como fim de jogo
}

// Adiciona eventos de clique nas torres para selecionar e mover discos
towers.forEach((tower) => {
  tower.addEventListener("click", function () {
    if (gameOver) return; // Impede mais cliques após o fim do jogo

    const discs = this.querySelectorAll(".disc");

    // Se nenhum disco está selecionado, selecionar o topo da torre atual
    if (!selectedDisc && discs.length > 0) {
      selectedDisc = discs[discs.length - 1];
      selectedTower = this;
      selectedDisc.classList.add("selected"); // Adiciona uma classe para mostrar que o disco está selecionado
    } else if (selectedDisc) {
      // Se já há um disco selecionado, tentar movê-lo para a torre atual
      moveDisc(selectedTower, this);
      selectedDisc.classList.remove("selected");
      selectedDisc = null;
      selectedTower = null;
    }
  });
});

// Função para reiniciar o jogo
function restartGame() {
  victoryMessage.classList.remove("visible");
  failureMessage.classList.remove("visible");
  generateDiscs(difficultySelect.value); // Gera os discos com base na dificuldade selecionada
}

// Adiciona o evento de reiniciar para os botões
restartBtn.addEventListener("click", restartGame);
restartFailureBtn.addEventListener("click", restartGame);
restartControlBtn.addEventListener("click", restartGame); // Botão de reiniciar ao lado da dificuldade

// Inicializa o jogo com a dificuldade selecionada
difficultySelect.addEventListener("change", function () {
  generateDiscs(this.value);
});

// Gera os discos iniciais com a dificuldade padrão de 4 discos (Médio)
generateDiscs(4);
