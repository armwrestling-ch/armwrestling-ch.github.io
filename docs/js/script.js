(() => {
  const formatPrice = (price) =>
    price.toFixed(2).replace(/.00$/g, ".\u2014").replace(".", "\uFEFF.\uFEFF");

  // Fetch the data from the server
  const handleElement = document.querySelector(".gauge-pointer");
  const donationCurrent = document.querySelector(".donation-current");
  const donorList = document.querySelector(".donor-list.dynamic-donor-list");
  const getDonorEntry = (donor, amount) => {
    const li = document.createElement("li");
    li.classList.add("donor");
    li.innerHTML = `
      <span class="donor-name">${donor}</span>
      <span class="donor-amount">${formatPrice(amount)}</span>
    `;
    return li;
  };
  if (handleElement && donationCurrent && donorList) {
    const updateDonations = () => {
      const url = "./api/donations.csv";
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const lines = data
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          const donations = lines
            .map((line) => {
              const [amount, donor] = line.split(",");
              return { donor, amount: Number(amount) };
            })
            .sort((a, b) => b.amount - a.amount);
          const total = donations.reduce((acc, { amount }) => acc + amount, 0);
          const donors = donations.map(({ donor, amount }) =>
            getDonorEntry(donor, amount)
          );
          donorList.innerHTML = "";
          donors.forEach((donor) => donorList.appendChild(donor));
          donationCurrent.innerText = formatPrice(total);

          // rotate the gauge pointer
          const goalTotal = 500;
          const zeroAngle = 180;
          const angle = (total / goalTotal) * 180;
          handleElement.style.transform = `rotate(${zeroAngle + angle}deg)`;
        })
        .catch((error) => console.error(error));
    };

    updateDonations();
  }

  // add clickhandler for video expander
  const videoExpander = document.querySelector(".expand-video");
  const expandableContent = document.querySelector(".video.collapsed");
  if (videoExpander && expandableContent) {
    videoExpander.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const iframe = expandableContent.querySelector("iframe");
      if (iframe) {
        iframe.src = iframe.dataset.src;
      }
      expandableContent.classList.toggle("collapsed");
    });
  }
})();
