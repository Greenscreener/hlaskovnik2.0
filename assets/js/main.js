function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}
function toggleAddModal() {
    document.getElementById('addModal').classList.toggle('is-active');
}
document.addEventListener("DOMContentLoaded", () => {
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

    document.getElementById("dateInput").disabled = document.querySelector("#unknownDateBox > input").checked;
    document.getElementById("unknownDateBox").addEventListener("click", () => {
        document.querySelector("#unknownDateBox > input").click();
    });
    document.querySelector("#unknownDateBox > input").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("dateInput").disabled = !document.getElementById("dateInput").disabled;
    });
});
