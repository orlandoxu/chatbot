
class TextParser {

  // Add the list u want to parse
  watch(coinList) {
    if (!Array.isArray(coinList)) {
      return false
    }

    this._coinList = this._coinList || []

    this._coinList = [...this._coinList, ...(coinList.reduce((p, n) => {
      p.push(n.toLocaleLowerCase().trim())
      return p
    }, []))]
  }

  // Just parse string message
  // Result is tuple like
  // [recall, ['-s', '-u'], ['btc', 'ltc']] or undefined
  messageParse(textMessage) {
    if (typeof textMessage !== 'string') {
      return
    }

    if (!this._coinList || this._coinList.length === 0) {
      return
    }

    const options = []

    const arr = textMessage
      .replace(/\，/g, ' ')
      .replace(/[^[\d0-9a-zA-Z\-\,]+/g, ' ')
      .trim()
      .toLocaleLowerCase()
      .split(' ')
      .reduce((p, n) => {
        if (n === 's') {
          options.push('-s')
          return p
        }

        if (/^--/.test(n)) {
          options.push(n)
          return p
        }

        if (/^-/.test(n)) {
          n.split('').forEach((op, idx) => {
            if (idx > 0) {
              options.push(`-${op}`)
            }
          })
          return p
        }

        if (this._coinList.includes(n)) {
          p.push(n)
        }

        return p
      }, [])

    if (arr.length === 0 && (!options.includes('--mine') || !options.includes('-m'))) {
      return
    }

    if (arr.length === 1 && arr[0] === '-s') {
      return
    }

    return [arr.includes('-s'), options, arr.reduce((p, n) => {
      if (n !== '-s') {
        p.push(n)
      }

      return p
    }, [])]
  }
}

exports.TextParser = TextParser
