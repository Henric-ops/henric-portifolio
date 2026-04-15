const alterarTema = document.getElementById("alterarTema");
const corpo = document.body;
const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");
const linksMenu = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");
const destino = document.getElementById("typing");
const form = document.getElementById("form-contato");
const successMsg = document.getElementById("mensagem-sucesso");

const savedTheme = localStorage.getItem("tema");
if (savedTheme === "light") {
    corpo.classList.remove("dark");
    document.documentElement.classList.remove("dark");
    alterarTema.textContent = "☀️";
} else {
    corpo.classList.add("dark");
    document.documentElement.classList.add("dark");
    alterarTema.textContent = "🌙";
}

alterarTema?.addEventListener("click", () => {
    corpo.classList.toggle("dark");
    document.documentElement.classList.toggle("dark");
    const darkMode = corpo.classList.contains("dark");
    alterarTema.textContent = darkMode ? "🌙" : "☀️";
    localStorage.setItem("tema", darkMode ? "dark" : "light");
});

menuToggle?.addEventListener("click", () => {
    menuNav.classList.toggle("show");
    menuToggle.textContent = menuNav.classList.contains("show") ? "✖" : "☰";
    menuToggle.setAttribute("aria-expanded", menuNav.classList.contains("show"));
});

linksMenu.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        linksMenu.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        menuNav.classList.remove("show");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            linksMenu.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.45 });

sections.forEach(section => observer.observe(section));

if (destino) {
    let index = 0;
    const texto = "Henric Baccin Sander";
    (function escrever() {
        destino.textContent = texto.slice(0, index);
        if (index < texto.length) {
            index++;
            setTimeout(escrever, 100);
        }
    })();
}

if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { "Accept": "application/json" }
        })
            .then(async response => {
                if (response.ok) {
                    successMsg.style.display = "block";
                    form.reset();
                    setTimeout(() => successMsg.style.display = "none", 5000);
                } else {
                    const data = await response.json();
                    alert(data.error || "Erro ao enviar a mensagem!");
                }
            })
            .catch(() => alert("Erro ao enviar a mensagem!"))
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensagem';
            });
    });
}
