//мб кому надо будет, простенький логгер 

export class Logger {
  constructor(name = 'Client') {
    this.name = name
  }

  _log(level, ...args) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${this.name}] [${level.toUpperCase()}]`, ...args)
  }

  info(...args) { 
    this._log('info', ...args)
   }
  warn(...args) { 
    this._log('warn', ...args)
   }
  error(...args) {
     this._log('error', ...args)
     }
  debug(...args) { 
    this._log('debug', ...args)
   }
}