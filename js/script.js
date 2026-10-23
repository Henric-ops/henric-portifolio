const alterarTema = document.getElementById("alterarTema");
const corpo = document.body;
const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");
const linksMenu = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");
const destino = document.getElementById("typing");
const form = document.getElementById("form-contato");
const successMsg = document.getElementById("mensagem-sucesso");

if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

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
        const sectionId = link.getAttribute("href")?.slice(1);
        if (sectionId) {
            mostrarSecao(sectionId, true);
        }
    });
});

function mostrarSecao(sectionId, atualizarHistorico = false) {
    const secaoAtiva = Array.from(sections).find(section => section.id === sectionId) || sections[0];
    if (!secaoAtiva) return;

    sections.forEach(section => {
        section.classList.toggle("is-active", section === secaoAtiva);
    });
    linksMenu.forEach(link => {
        const ativa = link.getAttribute("href") === `#${secaoAtiva.id}`;
        link.classList.toggle("active", ativa);
        if (ativa) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    menuNav.classList.remove("show");
    if (menuToggle) {
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    }
    window.scrollTo(0, 0);

    const hash = `#${secaoAtiva.id}`;
    if (atualizarHistorico && window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
    }
}

const secaoInicial = Array.from(sections).find(section => section.id === window.location.hash.slice(1));
if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}
mostrarSecao(secaoInicial?.id || sections[0]?.id);
if (secaoInicial) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${secaoInicial.id}`);
}
window.addEventListener("popstate", () => {
    mostrarSecao(window.location.hash.slice(1) || sections[0]?.id);
});

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
