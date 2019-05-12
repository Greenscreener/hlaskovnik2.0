function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}
function toggleAddModal() {
    document.getElementById('addModal').classList.toggle('is-active');
}
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.hostname !== "hlaskovnik.tk") {
        for (let i = 0; i < 10; i++) {
            const hlaska = new Hlaska({
                id: i,
                teacher: {id: i + 12, name: "Učitel č. " + (i + 12)},
                date: "2019-05-11",
                content: "Eheu, uria! Neuter nixus cito pugnas amor est. Dexter fluctus vix convertams glos est.",
                likes: Math.floor(Math.random() * 101)
            });
            document.querySelector("#quotes > .container").appendChild(hlaska.element);
        }
        Array.from(document.getElementsByClassName("teacherSelect")).forEach(e => {
            Array.from(document.getElementById("teacherSelect").options).forEach(e1 => {
                let option = document.createElement("option");
                option.innerText = e1.innerText;
                e.options.add(option);
            });
            e.options[0].selected = true;
        });
    } else {
        const hlaska = new Hlaska({
            id: 0,
            teacher: {id: 0, name: "Greenscreener"},
            date: new Date().toDateString(),
            content: "Zdravím tě, uživateli! Tato stránka je ve výstavbě a již brzy bude funkční. Těším se na všechny nové hlášky!",
            likes: Math.floor(Math.random() * 101)
        });
        document.querySelector("#quotes > .container").appendChild(hlaska.element);
        document.querySelectorAll("#teacherSelect, .teacherSelect").forEach(e => {
            {
                let option = document.createElement("option");
                option.innerText = "- Vyberte jméno profesora -";
                e.options.add(option);
            }
            {
                let option = document.createElement("option");
                option.innerText = "Zatím nic";
                e.options.add(option);
            }

        });
    }



    // Placeholder content generation ^^^
    // Actual code vvv

    document.getElementById("dateInput").disabled = document.querySelector("#unknownDateBox > input").checked;
    document.getElementById("unknownDateBox").addEventListener("click", () => {
        document.querySelector("#unknownDateBox > input").click();
    });
    document.querySelector("#unknownDateBox > input").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("dateInput").disabled = !document.getElementById("dateInput").disabled;
    });
});
