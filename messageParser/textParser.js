
class TextParser {

  // Add the list u want to parse
  watch(coinList) {
    if (!Object.isArray(coinList)) {
      return false
    }

    this.coinList = coinList.reduce((p, n) => {
      p.push(n.toLocaleLowerCase().trim())
      return p
    })
  }

  // Just parse string message
  // Result is tuple like
  // [cancelOrNot, ['btc', 'ltc']] or undefined
  messageParse(textMessage) {
    if (typeof textMessage !== 'string') {
      return
    }

    if (!this.coinList || this.coinList.length === 0) {
      return
    }

    const arr = textMessage
      .replace(/\，/g, ' ')
      .replace(/[^[\d0-9a-zA-Z\-\,]+/g, ' ')
      .trim()
      .toLocaleLowerCase()
      .split(' ')
      .reduce((p, n) => {
        if (this.coinList.includes(n) || n === '-s') {
          p.push(n)
        }

        return p
      }, [])

    if (!arr || arr.length === 0) {
      return
    }

    if (arr.length === 1 && arr[0] === '-s') {
      return
    }

    return [arr.includes('-s'), arr.reduce((p, n) => {
      if (n !== '-s') {
        p.push(n)
      }

      return p
    }, [])]
  }
}

exports.TextParser = TextParser
