const permissions = {
  CREATE_INSTANT_INVITE: 1n << 0n,    // 1n
  KICK_MEMBERS: 1n << 1n,            // 2n
  BAN_MEMBERS: 1n << 2n,             // 4n
  ADMINISTRATOR: 1n << 3n,           // 8n
  MANAGE_CHANNELS: 1n << 4n,         // 16n
  MANAGE_GUILD: 1n << 5n,            // 32n
  ADD_REACTIONS: 1n << 6n,           // 64n
  VIEW_AUDIT_LOG: 1n << 7n,          // 128n
  PRIORITY_SPEAKER: 1n << 8n,        // 256n
  STREAM: 1n << 9n,                  // 512n
  VIEW_CHANNEL: 1n << 10n,           // 1024n
  SEND_MESSAGES: 1n << 11n,          // 2048n
  MANAGE_MESSAGES: 1n << 13n,        // 8192n
  EMBED_LINKS: 1n << 14n,            // 16384n
  ATTACH_FILES: 1n << 15n,           // 32768n
  READ_MESSAGE_HISTORY: 1n << 16n,   // 65536n
  MENTION_EVERYONE: 1n << 17n,       // 131072n
  USE_EXTERNAL_EMOJIS: 1n << 18n,    // 262144n
  VIEW_GUILD_INSIGHTS: 1n << 19n,    // 524288n
  CONNECT: 1n << 20n,                // 1048576n
  SPEAK: 1n << 21n,                  // 2097152n
  MUTE_MEMBERS: 1n << 22n,           // 4194304n
  DEAFEN_MEMBERS: 1n << 23n,         // 8388608n
  MOVE_MEMBERS: 1n << 24n,           // 16777216n
  USE_VAD: 1n << 25n,                // 33554432n
  CHANGE_NICKNAME: 1n << 26n,        // 67108864n
  MANAGE_NICKNAMES: 1n << 27n,       // 134217728n
  MANAGE_ROLES: 1n << 28n,           // 268435456n
  MANAGE_WEBHOOKS: 1n << 29n,        // 536870912n
  MANAGE_EMOJIS_AND_STICKERS: 1n << 30n, // 1073741824n
  REQUEST_TO_SPEAK: 1n << 31n,       // 2147483648n 
  PIN_MESSAGES: 1n << 32n,           // 2199023255552n
}

const permissionsList = [ //та я знаю шо я гений так делать, че вы мне сделаете
  { name: 'CREATE_INSTANT_INVITE', label: 'Создание приглашений', desc: 'Создание мгновенных приглашений', dangerous: false },
  { name: 'KICK_MEMBERS', label: 'Исключать участников', desc: 'Удаление участников с сервера', dangerous: false },
  { name: 'BAN_MEMBERS', label: 'Банить участников', desc: 'Блокировка участников на сервере', dangerous: false },
  { name: 'MANAGE_CHANNELS', label: 'Управление каналами', desc: 'Создание, редактирование и удаление каналов', dangerous: false },
  { name: 'MANAGE_GUILD', label: 'Управление сервером', desc: 'Изменение названия, региона и других настроек сервера', dangerous: false },
  { name: 'ADD_REACTIONS', label: 'Добавлять реакции', desc: 'Добавление новых реакций к сообщениям', dangerous: false },
  { name: 'VIEW_AUDIT_LOG', label: 'Просмотр журнала аудита', desc: 'Просмотр журнала действий на сервере', dangerous: false },
  { name: 'PRIORITY_SPEAKER', label: 'Приоритетный режим', desc: 'Использование приоритетного режима в голосовых каналах', dangerous: false },
  { name: 'STREAM', label: 'Видеотрансляции', desc: 'Включение видеотрансляции в голосовых каналах', dangerous: false },
  { name: 'VIEW_CHANNEL', label: 'Просмотр каналов', desc: 'Просмотр текстовых и голосовых каналов', dangerous: false },
  { name: 'SEND_MESSAGES', label: 'Отправлять сообщения', desc: 'Отправка сообщений в текстовых каналах', dangerous: false },
  { name: 'MANAGE_MESSAGES', label: 'Управление сообщениями', desc: 'Удаление и закрепление сообщений других пользователей', dangerous: false },
  { name: 'EMBED_LINKS', label: 'Встраивать ссылки', desc: 'Встраивание контента из ссылок в сообщения', dangerous: false },
  { name: 'ATTACH_FILES', label: 'Прикреплять файлы', desc: 'Прикрепление файлов к сообщениям', dangerous: false },
  { name: 'READ_MESSAGE_HISTORY', label: 'Читать историю сообщений', desc: 'Чтение старых сообщений в каналах', dangerous: false },
  { name: 'MENTION_EVERYONE', label: 'Упоминать everyone', desc: 'Упоминание @everyone и @here', dangerous: false },
  { name: 'USE_EXTERNAL_EMOJIS', label: 'Использовать внешние эмодзи', desc: 'Использование эмодзи с других серверов', dangerous: false },
  { name: 'VIEW_GUILD_INSIGHTS', label: 'Просмотр аналитики', desc: 'Просмотр статистики сервера', dangerous: false },
  { name: 'CONNECT', label: 'Подключаться', desc: 'Подключение к голосовым каналам', dangerous: false },
  { name: 'SPEAK', label: 'Говорить', desc: 'Разговаривать в голосовых каналах', dangerous: false },
  { name: 'MUTE_MEMBERS', label: 'Отключать микрофон', desc: 'Отключение микрофона у других участников', dangerous: false },
  { name: 'DEAFEN_MEMBERS', label: 'Отключать звук', desc: 'Отключение звука у других участников', dangerous: false },
  { name: 'MOVE_MEMBERS', label: 'Перемещать участников', desc: 'Перемещение участников между голосовыми каналами', dangerous: false },
  { name: 'USE_VAD', label: 'Голосовая активация', desc: 'Использование голосовой активации', dangerous: false },
  { name: 'CHANGE_NICKNAME', label: 'Изменять никнейм', desc: 'Изменение собственного никнейма', dangerous: false },
  { name: 'MANAGE_NICKNAMES', label: 'Управление никнеймами', desc: 'Изменение никнеймов у участников', dangerous: false },
  { name: 'MANAGE_ROLES', label: 'Управление ролями', desc: 'Создание, редактирование и удаление ролей', dangerous: false },
  { name: 'MANAGE_WEBHOOKS', label: 'Управление вебхуками', desc: 'Создание, редактирование и удаление вебхуков', dangerous: false },
  { name: 'MANAGE_EMOJIS_AND_STICKERS', label: 'Управление эмодзи и стикерами', desc: 'Управление эмодзи и стикерами сервера', dangerous: false },
  { name: 'REQUEST_TO_SPEAK', label: 'Запрос на выступление', desc: 'Запрос на выступление на сцене', dangerous: false },
  { name: 'PIN_MESSAGES', label: 'Закреплять сообщения', desc: 'Закрепление сообщений в каналах', dangerous: false },
  { name: 'ADMINISTRATOR', label: 'Администратор', desc: 'Полные права на сервере', dangerous: true },
]



const formatPermissions = (permissionValue, start, end) => {
  const permsValue = BigInt(permissionValue || 0)


  if ((permsValue & permissions.ADMINISTRATOR) === permissions.ADMINISTRATOR) {
    return "Администратор"
  }


  const activePermissions = permissionsList.filter(perm => {
    if (perm.name === 'ADMINISTRATOR') return false

    const permFlag = permissions[perm.name]
    if (!permFlag) {
      console.warn(`Нет флага для пермишена: ${perm.name}`)
      return false
    }

    return (permsValue & permFlag) === permFlag
  })

  if (activePermissions.length === 0) {
    return "Нет прав"
  }
  const labels = activePermissions.map(perm => perm.label)

  if (start !== undefined) {
    return labels.slice(start, end).join(', ')
  }

  return labels.join(', ')
}



const getPermissionCount = (permissionValue) => {
  const permsValue = BigInt(permissionValue || 0)

  if ((permsValue & permissions.ADMINISTRATOR) === permissions.ADMINISTRATOR) {
    return 1
  }


  return permissionsList.filter(perm => {
    if (perm.name === 'ADMINISTRATOR') return false
    const permFlag = permissions[perm.name]
    return permFlag && (permsValue & permFlag) === permFlag
  }).length
}


const hasPermissions = (rolePermissions, permissionName) => {
  if (!rolePermissions) return false
  const rolePerms = BigInt(rolePermissions || 0)
  const permFlag = permissions[permissionName]

  if (!permFlag) {
    console.warn(`Неизвестное право: ${permissionName}`)
    return false
  }
  return (rolePerms & permFlag) === permFlag
}



function hasPermission(userPermissions, permission) {

  // строка 'ADMINISTRATOR' или бигинтд значение
  if (!userPermissions || !permission) return false
  let userPerms = BigInt(Number(userPermissions))

  if ((userPerms & permissions.ADMINISTRATOR) !== 0n) {
    return true
  }
  const permValue = typeof permission === 'string'
    ? permissions[permission]
    : BigInt(permission)

  return (BigInt(userPermissions) & permValue) !== 0n
}





// адм тест или конкретного права
function hasPermissionAction(userPermissions, permission) {
  if (!userPermissions) return false
  const userPerms = BigInt(Number(userPermissions))

  if ((userPerms & permissions.ADMINISTRATOR) !== 0n) {
    return true
  }

  const permValue = typeof permission === 'string'
    ? permissions[permission]
    : BigInt(permission)

  return (userPerms & permValue) !== 0n
}


//аля синк тест прав всего и вся сразу
function hasAllPermissions(userPermissions, ...requiredPermissions) {
  if (!userPermissions) return false
  const userPerms = BigInt(Number(userPermissions))


  if ((userPerms & permissions.ADMINISTRATOR) !== 0n) {
    return true
  }


  for (const perm of requiredPermissions) {
    const permValue = typeof perm === 'string' ? permissions[perm] : BigInt(perm)
    if ((userPerms & permValue) === 0n) {
      return false
    }
  }

  return true
}


// userPermissions другой юзер, targetPermissions наш юзер
function hasPermissionUsers(userPermissions, targetPermissions, permission) {
  if (!targetPermissions) return false
  if(!userPermissions) return false

  if ((BigInt(userPermissions) & permissions.ADMINISTRATOR) !== 0n) {
    return true
  }

  if (!userPermissions) {
    if (!targetPermissions || targetPermissions === undefined) return false
    const targetPerms = BigInt(targetPermissions)
    if ((targetPerms & permissions.ADMINISTRATOR) !== 0n) {
      return true
    }

    const permValue = typeof permission === 'string'
      ? permissions[permission]
      : BigInt(permission)
  }
  const ourPerms = BigInt(userPermissions)
  if ((ourPerms & permissions.ADMINISTRATOR) !== 0n) {
    return false
  }

  const targetPerms = BigInt(targetPermissions)
  if ((targetPerms & permissions.ADMINISTRATOR) !== 0n) {
    return true
  }

  const permValue = typeof permission === 'string'
    ? permissions[permission]
    : BigInt(permission)

  return (targetPerms & permValue) !== 0n
}







export function hasChannelPermissionForUser(userId, userRoleIds, channelOverrides, permission, serverRoles, ownerId) {
  if (ownerId === userId) return true
  const permBit = permission ? BigInt(permission) : null
  const rolesToCheck = userRoleIds ? [...userRoleIds] : []
  if (!rolesToCheck.includes("0")) rolesToCheck.push("0")

  let userGlobalPermissions = 0n
  if (serverRoles) {
    for (const roleId of rolesToCheck) {
      const role = serverRoles.find(r => r.id === roleId)
      if (role && role.permissions) userGlobalPermissions |= BigInt(role.permissions)
    }
  }
  const ADMIN_BIT = 8n
  if ((userGlobalPermissions & ADMIN_BIT) !== 0n) return true

  if (channelOverrides?.users && userId) {
    const userOverride = channelOverrides.users.find(u => u.id === userId)
    if (userOverride) {
      const result = checkSingleOverride(userOverride, permBit)
      if (result !== null) return result
    }
  }

  let roleDeny = false, roleAllow = false
  if (channelOverrides?.roles && rolesToCheck.length) {
    const roleOverrides = channelOverrides.roles.filter(role => rolesToCheck.includes(role.id))
    for (const roleOverride of roleOverrides) {
      const result = checkSingleOverride(roleOverride, permBit)
      if (result === false) roleDeny = true
      else if (result === true && !roleDeny) roleAllow = true
    }
    if (roleDeny) return false
    if (roleAllow) return true
  }

  if (permBit === null) return userGlobalPermissions // возвращаем полный битфилд ВСЕХ прав если ничего не передали
  return (userGlobalPermissions & permBit) !== 0n
}

function checkSingleOverride(override, permBit) {
  const allowed = BigInt(override.allowed || 0)
  const denied = BigInt(override.denied || 0)
  if ((denied & permBit) === permBit) return false
  if ((allowed & permBit) === permBit) return true
  return null
}











export { permissions, permissionsList, formatPermissions, getPermissionCount, hasPermission, hasPermissionAction, hasAllPermissions, hasPermissionUsers, hasPermissions, checkSingleOverride }