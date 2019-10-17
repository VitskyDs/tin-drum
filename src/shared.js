let emojis = ['👋', '💎', '🛠', '🎉']

const randomEmoji = () => {
  return emojis[Math.floor(Math.random() * emojis.length)]
}

module.exports = {
  randomEmoji,
}
