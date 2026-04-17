export class Util {
  
  static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * 0xFFFFFF);
      if (color.startsWith('#')) return parseInt(color.slice(1), 16);
      return parseInt(color, 16);
    }
    if (Array.isArray(color)) return (color[0] << 16) + (color[1] << 8) + color[2];
    if (typeof color === 'number') return color;
    return 0;
  }

  static resolveImage(image) {
    if (!image) return null;
    if (typeof image === 'string') return { url: image };
    return image;
  }

  static snowflakeToTimestamp(id) {
    return Number((BigInt(id) >> 22n) + 1420070400000n);
  }

  static timestampToSnowflake(timestamp) {
    return ((BigInt(timestamp) - 1420070400000n) << 22n).toString();
  }
}