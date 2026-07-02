const app = document.getElementById("app");

showMenu();

//ガチャ一覧画面
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

//ガチャ画面
async function showGacha(gacha) {

    const key = `enabled_${gacha.id}`;
    const response = await fetch(`data/${gacha.id}.json`);
    const characters = await response.json();

    //保存済みデータ取得
    const saved =
    JSON.parse(localStorage.getItem(key) || "{}");

    //排出OFFのみ除外
    const enabledCharacters =
    characters.filter(character => {

        if (saved[character.name] === false) {
            return false;
        }

        return true;

    });

    app.innerHTML = `
        <button id="back">← ガチャ一覧</button>

        <div class="title-row">

        <h1>${gacha.name}</h1>

        <button id="setting" class="icon-button" title="排出キャラ設定">
            ⚙
        </button>

        </div>

        <p class="count">
            <br>
            登録：<span id="totalCount"></span>人　　
            排出：<span id="enabledCount"></span>人
        </p>

        <button id="roll">
            🎲 回す
        </button>

        <div class="result" id="result">
            ？？？
        </div>
    `;

    updateCount(characters, saved);

    document.getElementById("back").onclick = showMenu;

    document.getElementById("roll").onclick = () => {

        //ダイスロール時に排出数0の場合
        if(enabledCharacters.length===0){
            result.textContent="排出キャラがいません";
            return;
        }

        const random =
            Math.floor(Math.random() * enabledCharacters.length);

        document.getElementById("result").textContent =
            characters[random].name;

    };

    document.getElementById("setting").onclick=()=>{

        showSettings(
            gacha,
            characters
        );

    };

}

//排出セッティングページ
function showSettings(
    gacha,
    characters
){
    const key = `enabled_${gacha.id}`;

    const saved =
        JSON.parse(
            localStorage.getItem(key) || "{}"
        );

    app.innerHTML = `
        <button id="back">
            ←戻る
        </button>

        <h1>${gacha.name}</h1>

        <p class="count">
            登録：<span id="totalCount"></span>人　　
            排出：<span id="enabledCount"></span>人
        </p>

        <div id="list"></div>

        <button id="back">
            ←戻る
        </button>
    `;

    updateCount(characters, saved);

    const list =
        document.getElementById("list");

    //ループ
    characters.forEach(character=>{
        const label =
            document.createElement("label");

        const checkbox =
            document.createElement("input");

            checkbox.type="checkbox";

        //保存がなければON
        checkbox.checked =
            saved[character.name] !== false;

        //切り替え
        checkbox.onchange=()=>{

            saved[character.name] = checkbox.checked;

            localStorage.setItem(
                key,
                JSON.stringify(saved)
            );

            updateCount(characters, saved);
        };

        //表示
        label.appendChild(checkbox);
        label.append(
            " " + character.name
        );
        list.appendChild(label);
        list.appendChild(
            document.createElement("br")
        );

        document
        .getElementById("back")
        .onclick=()=>{

        showGacha(gacha);
        };
    });
}

//人数を表示する関数
function updateCount(characters, saved){

    const total = characters.length;

    const enabled =
        characters.filter(character =>
            saved[character.name] !== false
        ).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("enabledCount").textContent = enabled;

}