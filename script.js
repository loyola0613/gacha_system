const app = document.getElementById("app");

showMenu();

async function showMenu() {

    const response = await fetch("data/index.json");
    const gachas = await response.json();

    app.innerHTML = "<h1>ガチャ一覧</h1>";

    gachas.forEach(gacha => {

        const button = document.createElement("button");

        button.textContent = gacha.name;

        button.onclick = () => {
            showGacha(gacha);
        };

        app.appendChild(button);

    });

}

async function showGacha(gacha) {

    const response = await fetch(`data/${gacha.id}.json`);
    const characters = await response.json();

    app.innerHTML = `
        <button id="back">← ガチャ一覧</button>

        <h1>${gacha.name}</h1>

        <button id="roll">
            🎲 回す
        </button>

        <div class="result" id="result">
            ？？？
        </div>
    `;

    document.getElementById("back").onclick = showMenu;

    document.getElementById("roll").onclick = () => {

        const random =
            Math.floor(Math.random() * characters.length);

        document.getElementById("result").textContent =
            characters[random];

    };

}