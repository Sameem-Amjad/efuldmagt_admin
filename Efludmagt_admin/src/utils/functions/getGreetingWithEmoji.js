export function getGreetingWithEmoji() {
  const hours = new Date().getHours();

  if (hours < 12) {
    return "Good Morning ☀️";
  } else if (hours < 18) {
    return "Good Afternoon 🌤️";
  } else if (hours < 21) {
    return "Good Evening 🌇";
  } else {
    return "Good Night 🌙";
  }
}
