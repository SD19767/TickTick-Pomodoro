document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("click-me");
    button?.addEventListener("click", () => {
      alert("Hello from your extension!");
    });
  });