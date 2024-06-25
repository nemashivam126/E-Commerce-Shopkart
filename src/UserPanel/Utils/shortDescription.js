export const shortenDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 6) {
      return words.slice(0, 6).join(' ') + '...';
    }
    return description;
};