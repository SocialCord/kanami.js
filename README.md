<div align="center">
  <h1>🎯 Kanami.js</h1>
  <p><strong>Современный SDK / API Wrapper для платформы Social</strong></p>
  
  [![npm version](https://img.shields.io/npm/v/kanami.js.svg)](https://www.npmjs.com/package/kanami.js)
  [![npm downloads](https://img.shields.io/npm/dm/kanami.js.svg)](https://www.npmjs.com/package/kanami.js)
  [![License](https://img.shields.io/npm/l/kanami.js.svg)](https://github.com/socialcord/kanami.js/blob/main/LICENSE)
  [![Node Version](https://img.shields.io/node/v/kanami.js.svg)](https://nodejs.org)
  
  <p>
    <a href="#установка">Установка</a> •
    <a href="#быстрый-старт">Быстрый старт</a> •
    <a href="#примеры-кода">Примеры кода</a> •
    <a href="#api-справочник">API справочник</a> •
    <a href="#лицензия">Лицензия</a>
  </p>
</div>

---



Kanami.JS - Является библиотекой для простой реализации ботов под проект [SocialCord](https://social.shizue.top)
Данная библиотека имеет множество сходств с [Discord.JS](https://www.npmjs.com/package/discord.js), благодаря чему вы явно не запутаетесь и не потеряетесь при написании кода вашего бота :З


---


## ✨ Реализовано

- [x] Базовая работа с сообщениями (отправка/редактирование/удаление)
- [x] Интеракции (кнопки, селект-меню)
- [x] Эмбеды, удобные билдеры
- [x] Встроенное кэширование (Memory, TTL из коробки)
- [x] Создание/Редактирование/Удаление/Выдача ролей
- [x] Получение информации о пользователе, сервере, канале, сообщении
- [x] Поддержка ивент системы
- [x] Встроенный коллектор интеракций/сообщений
- [x] Логгер с уровнями логирования
- [x] Система прав (Permissions)
- [x] Автоматическое переподключение WebSocket
- [x] Система приглашений (инвайты)
- [x] Управление эмодзи сервера
- [x] Баны, кики, таймауты участников
- [x] Аудит логи
- [x] Встроенный из коробки коллектор интеракций/сообщений


## 📋 В разработке
- [ ] Выделенная система Redis кеширования
- [ ] Поддержка и воспроизведение аудио в голосовых каналах
- [ ] Поддержка редактирования/создания/удаления каналов
- [ ] Шардинг и кластеризация через redis 
- [ ] Встроенный менеджер рейт-лимитов
- [ ] Поддержка вебхуков
- [ ] Поддержка файловых вложений
- [ ] DM сообщения
- [ ] Поддержка стикеров


---

## Как получить токен?
- 1. Регистрируемся и заходим в аккаунт на https://social.shizue.top
- 2. Переходим на https://social.shizue.top/developers
- 3. Создаем бота и получаем токен
- 4. Вставляем токен в client.login('ТУТ ТОКЕН')

К сожалению, портал разработчика только в разработке. Релиз ожидается уже 21.04 числа, вместе с обновлённой библиотекой :З
Если вы нашли ошибку в библиотеке, создайте реквест на [GitHub](https://github.com/SocialCord/kanami.js)  ❤️


---

## 📦 Установка

```bash
npm install kanami.js
```

---

## 🚀 Быстрый старт

Создайте файл `bot.js`:

```javascript
import { Client, EmbedBuilder } from 'kanami.js';

const client = new Client();

client.on('ready', () => {
  console.log(`✅ Бот запущен как ${client.user.username}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!ping') {
    await message.reply('Pong! 🏓');
  }
  
  if (message.content === '!embed') {
    const embed = new EmbedBuilder()
      .setTitle('Привет!')
      .setDescription('Это эмбед')
      .setColor('#5865F2')
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
});

await client.login('ваш-токен-бота');
```

Запустите: `node bot.js`

---

## 💻 Примеры кода

### Отправка сообщения

```javascript
// В канал
const channel = await client.channels.fetch('channel-id');
await channel.send('Привет!');

// Ответ на сообщение
await message.reply('Ответ!');

// С упоминанием
await message.reply({ content: 'Привет <@73664522963034112>!', mentions: ['user-id'] });
```

### Кнопки (интеракции)

```javascript
import { ActionRowBuilder, ButtonBuilder } from 'kanami.js';

const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Подтвердить')
      .setStyle(3), 
    new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Отмена')
      .setStyle(4)
  );

await message.reply({
  content: 'Выберите действие:',
  components: [row]
});

// Обработка нажатия
client.onInteraction('confirm', async (interaction) => {
  await interaction.reply('✅ Подтверждено!');
});
```

### Выпадающее меню

```javascript
import { ActionRowBuilder, StringSelectMenuBuilder } from 'kanami.js';

const select = new StringSelectMenuBuilder()
  .setCustomId('role_select')
  .setPlaceholder('Выберите роль')
  .addOptions(
    { label: 'Админ', value: 'admin', description: 'Полный доступ' },
    { label: 'Модератор', value: 'mod', description: 'Модерация' },
    { label: 'Пользователь', value: 'user', description: 'Обычный доступ' }
  );

const row = new ActionRowBuilder().addComponents(select);
await message.reply({ content: 'Выберите роль:', components: [row] });
```

### Коллектор сообщений

```javascript
const collector = message.channel.createMessageCollector(
  (m) => m.author.id === message.author.id,
  { time: 30000, max: 5 }
);

collector.on('collect', (msg) => {
  console.log(`Получено: ${msg.content}`);
});

collector.on('end', (collected) => {
  console.log(`Собрано ${collected.length} сообщений`);
});
```

### Коллектор интеракций

```javascript
const collector = client.createInteractionCollector(
  message,
  (i) => i.customId === 'my_button',
  { time: 30000 }
);

collector.on('collect', async (interaction) => {
  await interaction.reply('Кнопка нажата в коллекторе!');
});
```

### Работа с гильдией (сервером)

```javascript
const guild = client.guilds.cache.get('guild-id');

// Получить всех участников
const members = await guild.fetchMembers();
console.log(`Участников: ${members.size}`);

// Создать канал
const channel = await guild.createChannel('новый-канал', 0, { topic: 'Описание' });

// Создать роль
const role = await guild.createRole({
  name: 'Модератор',
  color: '#FF0000',
  permissions: permissions.MANAGE_MESSAGES 
});

// Выдать роль участнику
const member = await guild.fetchMember('user-id');
await member.addRole(role.id);

// Кикнуть
await member.kick('Нарушение правил');

// Забанить
await guild.ban('user-id', 'Спам', Date.now() + 86400000);
```

### Права

```javascript
import { Permissions, permissions } from 'kanami.js';

// Проверка прав участника
if (member.has(oermissions.ADMINISTRATOR)) {
  console.log('Администратор!');
}

if (member.has(permissions.KICK_MEMBERS)) {
  console.log('Может кикать');
}

// Права в канале
const perms = member.permissionsIn(channel);
if (perms.has('SEND_MESSAGES')) {
  await channel.send('Привет!');
}

// Класс Permissions
const userPerms = new Permissions(member.permissions);
userPerms.add('KICK_MEMBERS', 'BAN_MEMBERS');
console.log(userPerms.toArray()); // ['KICK_MEMBERS', 'BAN_MEMBERS']
userPerms.remove('KICK_MEMBERS');
```

### Кэширование

```javascript
import { TTLCacheProvider, MemoryCacheProvider } from 'kanami.js';

// Кэш в памяти (по умолчанию)
const client = new Client({
  cacheProvider: new MemoryCacheProvider()
});

// Кэш с автоматическим удалением через 60 секунд
const client = new Client({
  cacheProvider: new TTLCacheProvider(60000)
});

// Ручная работа с кэшем
await client.cacheProvider.set('key', { data: 'value' });
const data = await client.cacheProvider.get('key');
await client.cacheProvider.delete('key');
```

### Collection (расширенный Map)

```javascript
const collection = client.guilds.cache;

// Поиск
const guild = collection.find(g => g.name === 'Мой сервер');

// Фильтрация
const largeGuilds = collection.filter(g => g.members.size > 100);

// Преобразование
const names = collection.map(g => g.name);

// Первый/последний/случайный
const first = collection.first();
const last = collection.last();
const random = collection.random();

// Разделение
const [active, inactive] = collection.partition(g => g.members.size > 0);

// Сортировка
collection.sort((a, b) => a.name.localeCompare(b.name));
```

### Утилиты

```javascript
import { Util } from 'kanami.js';

// Конвертация цвета
const color = Util.resolveColor('#5865F2');
const randomColor = Util.resolveColor('RANDOM');

// Конвертация snowflake во время
const timestamp = Util.snowflakeToTimestamp('123456789012345678');
const date = new Date(timestamp);

// Конвертация времени в snowflake
const snowflake = Util.timestampToSnowflake(Date.now());
```

### Логирование

```javascript
const client = new Client();

client.logger.info('Бот запущен');
client.logger.warn('Предупреждение');
client.logger.error('Ошибка', error);
client.logger.debug('Отладочная информация');

// Событие ошибки
client.on('error', (error) => {
  console.error('Ошибка клиента:', error);
});

// Отключение
client.on('disconnect', (reason) => {
  console.log('Отключено:', reason);
});

// Raw события
client.on('raw', (data) => {
  console.log('Сырое событие:', data.event);
});
```

---

## 📚 API справочник

### Client

| Метод | Описание |
|-------|----------|
| `login(token)` | Подключение к платформе |
| `destroy()` | Отключение и очистка |
| `getGuilds()` | Получить все гильдии |
| `onInteraction(id, handler, timeout?)` | Обработчик интеракций |
| `createInteractionCollector(msg, filter, options)` | Коллектор интеракций |

### Message

| Метод | Описание |
|-------|----------|
| `reply(content, options?)` | Ответить |
| `edit(content, options?)` | Редактировать |
| `delete()` | Удалить |
| `pin()` / `unpin()` | Закрепить/открепить |
| `addReaction(emojiId)` | Добавить реакцию |
| `removeReaction(emojiId)` | Удалить реакцию |
| `awaitMessageComponent(filter, options)` | Ожидание компонента |
| `awaitReactions(filter, options)` | Ожидание реакций |

### Channel

| Метод | Описание |
|-------|----------|
| `send(content, options?)` | Отправить сообщение |
| `fetchMessages(limit, before?)` | История сообщений |
| `bulkDelete(messages)` | Массовое удаление |
| `createMessageCollector(filter, options)` | Коллектор сообщений |
| `sendTyping()` | Индикатор набора текста |
| `permissionsFor(member)` | Права участника в канале |
| `createInvite(options)` | Создать приглашение |
| `fetchInvites()` | Список приглашений |

### Guild

| Метод | Описание |
|-------|----------|
| `fetch()` | Получить данные гильдии |
| `fetchMembers()` | Получить всех участников |
| `fetchMember(userId)` | Получить участника |
| `fetchChannels()` | Получить каналы |
| `createChannel(name, type, options)` | Создать канал |
| `createRole(options)` | Создать роль |
| `createEmoji(name, image, options)` | Создать эмодзи |
| `fetchEmojis()` | Получить эмодзи |
| `deleteEmoji(emojiId)` | Удалить эмодзи |
| `ban(userId, reason, expires)` | Забанить |
| `unban(userId)` | Разбанить |
| `kick(userId, reason)` | Кикнуть |
| `leave()` | Покинуть гильдию |
| `fetchBans()` | Список банов |
| `fetchAuditLogs(query)` | Логи аудита |
| `fetchInvites()` | Список приглашений |
| `createInvite(channelId, options)` | Создать приглашение |

### GuildMember

| Метод | Описание |
|-------|----------|
| `has(permission)` | Проверить право |
| `permissions` | Битфилд прав |
| `permissionsObject` | Объект Permissions |
| `permissionsIn(channel)` | Права в канале |
| `addRole(roleId)` | Выдать роль |
| `removeRole(roleId)` | Снять роль |
| `setNickname(nick)` | Сменить никнейм |
| `timeout(seconds, reason)` | Выдать таймаут |
| `kick(reason)` | Кикнуть |
| `ban(reason, expires)` | Забанить |
| `fetch()` | Обновить данные |

### Role

| Метод | Описание |
|-------|----------|
| `edit(data)` | Редактировать роль |
| `setName(name)` | Сменить название |
| `setColor(color)` | Сменить цвет |
| `setPermissions(permissions)` | Сменить права |
| `setHoist(hoist)` | Отображать отдельно |
| `setMentionable(mentionable)` | Упоминаемая |
| `delete()` | Удалить роль |

### Builders (методы)

**EmbedBuilder**: `setTitle()`, `setDescription()`, `setColor()`, `addField()`, `setImage()`, `setThumbnail()`, `setFooter()`, `setTimestamp()`, `setAuthor()`, `setURL()`

**ButtonBuilder**: `setLabel()`, `setStyle()`, `setCustomId()`, `setURL()`, `setEmoji()`, `setDisabled()`

**StringSelectMenuBuilder**: `setCustomId()`, `setPlaceholder()`, `addOptions()`, `setMinValues()`, `setMaxValues()`, `setDisabled()`

**ActionRowBuilder**: `addComponents()`

---

## 🔧 Типы ивентов

```typescript
interface ClientEvents {
  ready: [];
  messageCreate: [message: Message];
  messageUpdate: [oldMessage: Message, newMessage: Message];
  messageDelete: [message: Message];
  channelCreate: [channel: Channel];
  channelUpdate: [oldChannel: Channel, newChannel: Channel];
  channelDelete: [channel: Channel];
  guildCreate: [guild: Guild];
  guildUpdate: [oldGuild: Guild, newGuild: Guild];
  guildDelete: [guild: Guild];
  guildMemberAdd: [member: GuildMember];
  guildMemberRemove: [member: GuildMember];
  guildMemberUpdate: [oldMember: GuildMember, newMember: GuildMember];
  roleCreate: [role: Role];
  roleUpdate: [oldRole: Role, newRole: Role];
  roleDelete: [role: Role];
  userUpdate: [oldUser: User, newUser: User];
  voiceStateUpdate: [oldState: any, newState: any];
  typingStart: [channel: Channel, user: User];
  typingStop: [channel: Channel, user: User];
  messageReactionAdd: [reaction: any, user: User];
  messageReactionRemove: [reaction: any, user: User];
  interactionCreate: [interaction: Interaction];
  disconnect: [reason: string];
  error: [error: Error];
  raw: [data: { event: string; args: any[] }];
}
```

---

## 📝 Лицензия

MIT © [Masero01](https://github.com/masero01)

---

<div align="center">
  Made with ❤️ для платформы SocialCord
</div>