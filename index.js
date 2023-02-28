// Enable tool tips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// set up
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
// Avatar 
const avatarsAmount = 28 // to display
const imagePath = "images/avatar/starter/"

// mode
let cheatMode = false

// basic elements
const cardContainer = document.querySelector("#cards-container")

// share coin
const shareCoinText = document.querySelector("#share-coin")

// cheat mode
const cheatModeButton = document.querySelector("#cheat-mode-btn")
const cheatModeIcon = document.querySelector("#cheat-mode-icon")
const cheatModeText = document.querySelector("#cheat-mode-text")

// difficulty
const difficultyDropDown = document.querySelector(".difficulty-dropdown")
const cardAmountText = document.querySelector("#cards-amount")

// player elements
const currentPlayerText = document.querySelector("#current-player")

const playerOneBox = document.querySelector("#player-1-box")
const playerTwoBox = document.querySelector("#player-2-box")
const playerOneScoreText = document.querySelector("#player-1-score")
const playerTwoScoreText = document.querySelector("#player-2-score")
const playerOneScoreBox = document.querySelector("#player-1-score-box")
const playerTwoScoreBox = document.querySelector("#player-2-score-box")
const playerOneAvatar = document.querySelector("#player-1-avatar")
const playerTwoAvatar = document.querySelector("#player-2-avatar")
const playerOneName = document.querySelector("#player-name-1")
const playerTwoName = document.querySelector("#player-name-2")
const playerOneInput = document.querySelector("#name-input-1")
const playerTwoInput = document.querySelector("#name-input-2")
const playerOneInputParent = playerOneInput.parentElement
const playerTwoInputParent = playerTwoInput.parentElement

// avatar page
const playerOneAvatarPage = document.querySelector("#avatar-page-one")
const playerTwoAvatarPage = document.querySelector("#avatar-page-two")

// end game elements
const endGameScreen = document.querySelector("#end-game-screen")
const endGamePlayerAvatar = document.querySelector("#winner-avatar")
const endGamePlayerName = document.querySelector("#winner-name")
const endGameScore = document.querySelector("#end-score")
const playAgainBtn = document.querySelector("#play-again-btn")


// MODEL
const model = {
  reveledCards: [], // 翻出的牌
  totalCards: 52,
  cardsPerSet: 13,
  matchCards: 0, // Don't change
  defaultCoinsPerMatch: 10,
  shareCoin: 0,
  players: [
    // id = DO NOT CHANGE!!!
    // name = allow player to change
    // score = allow model to change
    // avatar = avatar file path
    playerOne = {
      id: "1",
      name: "player One",
      scores: 0,
      avatar: "/images/avatar/starter/27.png",
    },
    playerTwo = {
      id: "2",
      name: "player Two",
      scores: 0,
      avatar: "/images/avatar/starter/7.png",
    },
  ],

  currentPlayer: "1",

  avatars: [],

  createAvatarFilePath() {
    // avatars 有資料就 return
    if (this.avatars.length === avatarsAmount) return
    // create filePath
    for (i = 1; i <= avatarsAmount; i++) {
      const path = `${imagePath}${i}.png`
      this.avatars.push(path)
    }
  },

  changeCardsAmount(totalCards, cardsPerSet) {
    this.totalCards = totalCards,
      this.cardsPerSet = cardsPerSet
  },

  isReveledCardsMatched() {
    const cardOneNumber = Number(this.reveledCards[0].dataset.number) % this.cardsPerSet
    const cardTwoNumber = Number(this.reveledCards[1].dataset.number) % this.cardsPerSet
    return cardOneNumber === cardTwoNumber
  },

  isGameOverByCardsLeft() {
    return this.matchCards === this.totalCards
  },

  addMatchedCardsToModel() {
    this.matchCards += 2
  },

  switchPlayer() {
    if (this.currentPlayer === this.players[0].id) {
      this.currentPlayer = this.players[1].id
    } else {
      this.currentPlayer = this.players[0].id
    }
  },

  getCurrentPlayer() {
    return this.players.find(player => player.id === model.currentPlayer)
  },

  addScoreToCurrentPlayer(score) {
    const currentPlayer = this.getCurrentPlayer()
    currentPlayer.scores += Number(score)
  },
  changePlayerAvatarPath(id, path) {
    this.players[Number(id) - 1].avatar = path
  },

  changePlayerName(id, name) {
    if (name.length === 0) return
    this.players[Number(id) - 1].name = name
  },
  addCoinsToShareCoin(amount) {
    this.shareCoin += amount
  },

  loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("gameData"))

    if (data === null) {
      console.log("Can't find data to load")
      return
    }
    this.totalCards = data.totalCards
    this.cardsPerSet = data.cardsPerSet
    this.shareCoin = data.shareCoin
    this.players[0].name = data.playerOneName
    this.players[0].avatar = data.playerOneAvatar
    this.players[1].name = data.playerTwoName
    this.players[1].avatar = data.playerTwoAvatar
    console.log("Data loaded")
  },

  saveToLocalStorage() {
    const data = {
      totalCards: this.totalCards,
      cardsPerSet: this.cardsPerSet,
      shareCoin: this.shareCoin,
      playerOneName: this.players[0].name,
      playerOneAvatar: this.players[0].avatar,
      playerTwoName: this.players[1].name,
      playerTwoAvatar: this.players[1].avatar
    }
    localStorage.setItem("gameData", JSON.stringify(data))
    console.log("Game Saved")
  },


}


// VIEW
const view = {
  getCardContent(num, cardsSetAmount) {
    const cardNumber = this.getCardNumber(num, cardsSetAmount)
    const cardIcon = this.getCardIconShape(num, cardsSetAmount)
    const raw = `
    <p>${cardNumber}</p>
    <div class="card-img ${cardIcon}"></div>
    <p class="bottom-number">${cardNumber}</p>
    `
    return raw
  },
  getCardBack(num, cardsSetAmount) {
    let raw = ""
    // top
    raw += `<div class="card back" data-number=${num}>`
    // mid : cheat mode only
    if (cheatMode) {
      raw += this.getCardContent(num, cardsSetAmount)
    }
    // bottom
    raw += `</div>`
    return raw
  },
  getCardNumber(num, cardsSetAmount) {
    const number = (Number(num) % cardsSetAmount) + 1
    switch (number) {
      case 1:
        return "A"
      case 13:
        return "K"
      case 12:
        return "Q"
      case 11:
        return "J"
      default:
        return number
    }
  },
  getCardIconShape(num, cardsSetAmount) {
    const index = Math.ceil((Number(num) + 1) / cardsSetAmount);
    switch (index) {
      case 1:
        return "heart"
      case 2:
        return "diamond"
      case 3:
        return "club"
      case 4:
        return "spades"
    }
  },
  flipCard(card) {
    // 背面 -> 正面
    if (card.classList.contains("back")) {
      card.innerHTML = this.getCardContent(card.dataset.number, model.cardsPerSet)
      card.classList.remove("back")
      card.classList.add("flip") // 用來偵測翻開
      return
    }
    // 正面 -> 背面
    if (cheatMode) {
      card.innerHTML = this.getCardContent(card.dataset.number, model.cardsPerSet)
    } else {
      card.innerHTML = ""
    }
    card.classList.add("back")
    card.classList.remove("flip") // 用來偵測翻開
  },

  clearAllCards() {
    cardContainer.innerHTML = ""
  },

  renderAllCards(cardAmount, cardsPerSet) {
    this.clearAllCards()
    this.cheatModeButtonUpdate()
    utility.getShuffledArray(cardAmount).forEach(number => {
      cardContainer.innerHTML += this.getCardBack(number, cardsPerSet)
    })
  },
  highLightPairedCard(card) {
    card.classList.add("paired")
  },
  cheatModeButtonUpdate() {
    if (cheatMode) {
      cheatModeText.textContent = "ON"
      cheatModeButton.classList.add("btn-danger")
      cheatModeButton.classList.remove("btn-success")
      cheatModeIcon.classList.add("fa-eye")
      cheatModeIcon.classList.remove("fa-eye-slash")
    } else {
      cheatModeText.textContent = "OFF"
      cheatModeButton.classList.remove("btn-danger")
      cheatModeButton.classList.add("btn-success")
      cheatModeIcon.classList.remove("fa-eye")
      cheatModeIcon.classList.add("fa-eye-slash")
    }
  },
  wrongAnimationAppend(...cards) {
    cards.forEach(card => {
      // 加入 wrong class, css 內有@keyframe動畫
      card.classList.add("wrong")
      // 加入一次性event listener 監聽 animation end 
      card.addEventListener("animationend", event => {
        card.classList.remove("wrong")
      }, { once: true })
    })
  },
  showEndGameScreen(playerObject) {
    endGamePlayerAvatar.src = playerObject.avatar
    endGamePlayerName.textContent = playerObject.name
    endGameScore.textContent = playerObject.scores
    endGameScreen.classList.remove("hide")
  },
  updateCurrentPlayerText(playerName) {
    currentPlayerText.textContent = playerName
  },
  activeCurrentPlayerAnimation(playerObject) {
    playerOneBox.classList.remove("player-active")
    playerTwoBox.classList.remove("player-active")

    if (playerObject.id === "1") {
      playerOneBox.classList.add("player-active")
    } else {
      playerTwoBox.classList.add("player-active")
    }
  },
  updatePlayerScores(playerOneScore, playerTwoScore) {
    playerOneScoreText.textContent = playerOneScore
    playerTwoScoreText.textContent = playerTwoScore
  },
  activeCurrentPlayerGetCoinAnimation(playerObject) {
    const className = "get-coin"
    let playerBox = null

    playerOneScoreBox.classList.remove(className)
    playerTwoScoreBox.classList.remove(className)

    if (playerObject.id === "1") {
      playerBox = playerOneScoreBox
    } else {
      playerBox = playerTwoScoreBox
    }
    playerBox.classList.add(className)
    // remove class when done
    playerBox.addEventListener("animationend", event => {
      playerBox.classList.remove(className)
    })
  },

  changePlayerAvatar(playerNumber, avatarPath) {
    if (String(playerNumber) === "1") {
      playerOneAvatar.src = avatarPath
    } else {
      playerTwoAvatar.src = avatarPath
    }
  },

  renderPlayerAvatarPage(playerId, avatarPathArray) {
    let page = null
    if (String(playerId) === "1") {
      page = playerOneAvatarPage
    } else {
      page = playerTwoAvatarPage
    }
    // clear old render
    page.innerHTML = ""
    // render
    avatarPathArray.forEach(path => {
      const raw = `
      <img class="avatar-small-icon" data-id="${playerId}" src="${path}">
      `
      page.innerHTML += raw
    })
  },

  togglePlayerAvatarPage(playerId) {
    let page = null
    // get avatar page
    if (String(playerId) === "1") {
      page = playerOneAvatarPage
    } else {
      page = playerTwoAvatarPage
    }
    // toggle
    if (page.classList.contains("hide")) {
      page.classList.remove("hide")
    } else {
      page.classList.add("hide")
    }
  },

  hidePlayerAvatarPage() {
    const pages = [playerOneAvatarPage, playerTwoAvatarPage]
    pages.forEach(page => {
      if (page.classList.contains("hide")) return
      page.classList.add("hide")
    })
  },

  updateShareCoin(amount) {
    shareCoinText.textContent = amount
  },

  showPlayerNameInput(id) {
    let input = null
    if (String(id) === "1") {
      input = playerOneInputParent
    } else {
      input = playerTwoInputParent
    }
    input.classList.remove("hide")
  },

  hidePlayerNameInput() {
    const inputs = [playerOneInputParent, playerTwoInputParent]
    inputs.forEach(input => {
      if (input.classList.contains("hide")) return
      input.classList.add("hide")
    })
  },

  displayPlayerName(id, name) {
    let playerName = null
    if (String(id) === "1") {
      playerName = playerOneName
    } else {
      playerName = playerTwoName
    }
    playerName.textContent = name
  },

  updateCardsAmountDisplay(cardsAmount) {
    cardAmountText.textContent = cardsAmount
  },

  playAddCoinAnimation(cardElement, amount) {
    const div = document.createElement("div")
    div.setAttribute("class", "flow-coin flow-up")
    div.innerHTML = `
    <span class="i-coin coin-bigger ms-1"></span>
    <span class="flow-coin-text">+ ${amount}</span>
    `
    div.addEventListener("animationend", event => {
      cardElement.classList.remove("flow-up")
      div.remove()
    }, {once: true} )
    cardElement.append(div)

  },


}

// CONTROL
const control = {

  currentGameState: GAME_STATE.FirstCardAwaits,

  startup() {
    model.loadFromLocalStorage()
    model.createAvatarFilePath()
    view.updateCardsAmountDisplay(model.totalCards)
    view.changePlayerAvatar(1, model.players[0].avatar)
    view.changePlayerAvatar(2, model.players[1].avatar)
    view.displayPlayerName(1, model.players[0].name)
    view.displayPlayerName(2, model.players[1].name)
    view.renderAllCards(model.totalCards, model.cardsPerSet)
    view.updateShareCoin(model.shareCoin)
    view.updateShareCoin(model.shareCoin)
    this.addCardClickEventToAllCards()
  },
  cheatModeButtonClick() {
    // 選出還沒配對的卡 (用Array.from讓nodeList變成array)
    const unpairedCards =
      Array.from(document.querySelectorAll(".card"))
        .filter(card => !card.classList.contains("paired") && !card.classList.contains("flip"))

    if (cheatMode) {
      cheatMode = false
      unpairedCards.forEach(card => {
        // 其他卡片隱藏內容
        card.innerHTML = ""
      })
    } else {
      cheatMode = true
      unpairedCards.forEach(card => {
        card.innerHTML += view.getCardContent(card.dataset.number, model.cardsPerSet)
      })
    }
    view.cheatModeButtonUpdate()
  },
  addCardClickEventToAllCards() {
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", event => {
        control.onCardClick(card)
      })
    })
  },

  onCardClick(card) {
    if (!card.classList.contains("back") || card.classList.contains("paired")) {
      return
    }
    switch (this.currentGameState) {
      // STATE: 翻第一張
      case GAME_STATE.FirstCardAwaits:
        view.flipCard(card)
        model.reveledCards.push(card)
        this.currentGameState = GAME_STATE.SecondCardAwaits
        break

      // STATE: 翻第二張
      case GAME_STATE.SecondCardAwaits:
        view.flipCard(card)
        model.reveledCards.push(card)
        // 比對卡片
        if (model.isReveledCardsMatched()) {
          // 卡片一樣
          this.currentGameState = GAME_STATE.CardsMatched
          // remove flip class
          model.reveledCards.forEach(card => card.classList.remove("flip"))
          // highlight cards
          model.reveledCards.forEach(card => view.highLightPairedCard(card))
          // 拿到錢動畫
          view.activeCurrentPlayerGetCoinAnimation(model.getCurrentPlayer())
          this.playAddCoinAnimationOnMatch()
          // 清空卡牌
          model.reveledCards = []
          // 加分數給當前玩家
          model.addScoreToCurrentPlayer(model.defaultCoinsPerMatch)
          view.updatePlayerScores(model.players[0].scores, model.players[1].scores)
          // 加入配對成功牌數
          model.addMatchedCardsToModel()
          // 偵測是否勝利
          // 勝利
          if (model.isGameOverByCardsLeft()) {
            // 顯示當前玩家分數
            view.showEndGameScreen(model.getCurrentPlayer())
            this.currentGameState = GAME_STATE.GameFinished
            // 加入share coin
            model.addCoinsToShareCoin(model.getCurrentPlayer().scores)
            view.updateShareCoin(model.shareCoin)
            // save
            model.saveToLocalStorage()
            // reset match cards
            model.matchCards = 0
            return
          }
          // 還沒勝利就繼續
          this.currentGameState = GAME_STATE.FirstCardAwaits
        } else {
          // 卡片不一樣
          this.currentGameState = GAME_STATE.CardsMatchFailed
          // 卡片閃爍
          view.wrongAnimationAppend(...model.reveledCards)
          // 1 秒後翻回去
          setTimeout(() => {
            view.flipCard(model.reveledCards[0])
            view.flipCard(model.reveledCards[1])
            model.reveledCards = []
            this.currentGameState = GAME_STATE.FirstCardAwaits
            // switch player
            model.switchPlayer()
            view.updateCurrentPlayerText(model.getCurrentPlayer().name)
            view.activeCurrentPlayerAnimation(model.getCurrentPlayer())

          }, 1000);
        }
        break
    }
  },
  playAgainBtnClick() {
    window.location.reload()
  },

  showPlayerAvatarPage(event) {
    const id = event.target.dataset.id
    model.createAvatarFilePath()
    view.renderPlayerAvatarPage(id, model.avatars)
    view.togglePlayerAvatarPage(id)
  },

  changePlayerAvatar(event) {
    const target = event.target
    if (!target.classList.contains("avatar-small-icon")) return
    const id = target.dataset.id
    const path = target.src

    model.changePlayerAvatarPath(id, path)
    view.changePlayerAvatar(id, path)
    model.saveToLocalStorage()
  },
  clickToClosePlayerAvatarPage(event) {
    const target = event.target

    if (target.classList.contains("player-img") ||
      target.classList.contains("avatar-page") ||
      target.classList.contains("avatar-small-icon") ||
      target.classList.contains("player-name") ||
      target.classList.contains("name-input")
    ) {
      return
    }
    // close avatar page
    view.hidePlayerAvatarPage()
    // close name input
    view.hidePlayerNameInput()
  },

  onPlayerNameClick(event) {
    const target = event.target
    if (!target.classList.contains("player-name")) return
    const id = target.dataset.id

    view.showPlayerNameInput(id)
  },

  onPlayerNameEnterKeyPress(event) {
    if (event.key !== "Enter") return
    const id = event.target.dataset.id
    const name = event.target.value.trim()

    if (name.length === 0) return
    model.changePlayerName(id, name)
    model.saveToLocalStorage()
    view.displayPlayerName(id, model.players[Number(id) - 1].name)
    view.hidePlayerNameInput()

  },
  ChangeDifficulty(event) {
    const target = event.target
    // check for is a selector 
    if (!target.classList.contains("difficulty-selector")) return
    const totalCards = Number(target.dataset.cards)
    let cardPerSet = 0
    // 卡牌數量 - 13張一組
    switch (true) {
      case (totalCards % 13 === 0):
        cardPerSet = 13
        break;

      default:
        cardPerSet = totalCards / 2
        break;
    }
    // change cards amount
    model.changeCardsAmount(totalCards, cardPerSet)
    // save
    model.saveToLocalStorage()
    // reload page
    window.location.reload()
  },
  playAddCoinAnimationOnMatch(){
    if (model.reveledCards.length !== 2) return
    view.playAddCoinAnimation(model.reveledCards[1], model.defaultCoinsPerMatch)
  },




}


// Utility
const utility = {
  // Fisher-Yates Shuffle
  // 由 Ronald Fisher 跟 Frank Yates 在1938發表的演算法
  // 可是我們目前使用的是 Donal Knuth 微改後的版本，所以也叫做 Knuth Shuffle
  // 兩個版本主要的差異：
  // Fisher-Yates 從後往前，每個東西都會隨機跟任何一個東西交換，可能會跟自己換
  // Knuth 從前往後，每個東西都會跟後面還沒有交換過的東西交換，不會跟自己換 
  // Knuth 能產生更均勻的隨機排列
  getShuffledArray(num) {
    const array = Array.from(Array(num).keys())
    const length = array.length

    for (let index = 0; index < length; index++) {
      const randomIndex = Math.floor(Math.random() * (length - index)) + index;
      [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    }
    return array
  }
}

// Start
control.startup()

// difficulty
difficultyDropDown.addEventListener("click", control.ChangeDifficulty)

// cheat mode button
cheatModeButton.addEventListener("click", control.cheatModeButtonClick)

// play again button
playAgainBtn.addEventListener("click", control.playAgainBtnClick)

// player avatar
playerOneAvatar.addEventListener("click", control.showPlayerAvatarPage)
playerTwoAvatar.addEventListener("click", control.showPlayerAvatarPage)

// player avatar Page
playerOneAvatarPage.addEventListener("click", control.changePlayerAvatar)
playerTwoAvatarPage.addEventListener("click", control.changePlayerAvatar)

// hide player avatar page on outside click
window.addEventListener("click", control.clickToClosePlayerAvatarPage)

// player Name click
playerOneName.addEventListener("click", control.onPlayerNameClick)
playerTwoName.addEventListener("click", control.onPlayerNameClick)
// player Name input : Enter
playerOneInput.addEventListener("keypress", control.onPlayerNameEnterKeyPress)
playerTwoInput.addEventListener("keypress", control.onPlayerNameEnterKeyPress)