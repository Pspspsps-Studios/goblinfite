module.exports = {
  preset: "ts-jest",
};

async function asyncLoop() {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log(i);
        resolve();
      }, 1000);
    });
  }
}
