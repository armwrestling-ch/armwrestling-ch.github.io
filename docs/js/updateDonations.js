(() => {
  const valueElement = document.querySelector(".donation-value");
  const percentageElement = document.querySelector(".donation-percentage");
  if (!valueElement) {
    return;
  }

  const update = () => {
    const url = "./api/donations.cvs";
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const lines = data
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        console.log(lines);
      })
      .catch((error) => console.error(error));
  };
})();
