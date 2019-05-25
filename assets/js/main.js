const hlaskaArray = [  ];
const api = new Api("/api/v2.0/");

function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}
function toggleAddModal() {
    document.getElementById('addModal').classList.toggle('is-active');
}
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
function removeAllOptions(select) {
    for(let i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
}
function reload(api,hlaskaArray) {
    api.fetchTeachers().then(json => {
        Array.from(document.getElementsByClassName("teacherSelect")).forEach(e => {
            removeAllOptions(e);
            let option = document.createElement("option");
            option.innerText = "- Vyberte jméno profesora -";
            e.options.add(option);
            json.forEach(e1 => {
                let option = document.createElement("option");
                option.innerText = e1.firstName + " " + e1.lastName;
                option.value = e1.id;
                e.options.add(option);
            });
            e.options[0].selected = true;
        });
    });
    api.fetchHlasky().then((json) => {
        hlaskaArray[0] = HlaskaArray.generateFromJson(json, api);
        if (typeof Cookies.get('userId') !== "undefined") {
            api.fetchUserLikes(Cookies.get('userId')).then((json) => {
                hlaskaArray[0].some(e => {
                    const idIndex = json.indexOf(e.data.id);
                    if (idIndex !== -1) {
                        e.liked = true;
                        json.splice(idIndex,1);
                    }
                    return json.length === 0;
                });
            });
        }
        hlaskaArray[0].display();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.hostname !== "hlaskovnik.tk") {
        reload(api,hlaskaArray);
    } else {
        const hlaska = new Hlaska({
            id: 0,
            teacher: {id: 0, firstName: "Greenscreener", lastName: ""},
            date: new Date().toDateString(),
            content: "Zdravím tě, uživateli! Tato stránka je ve výstavbě a již brzy bude funkční. Těším se na všechny nové hlášky!",
            likes: Math.floor(Math.random() * 101)
        }, {url: "http://example.com/api"});
        hlaskaArray[0] = new HlaskaArray();
        hlaskaArray[0].push(hlaska);
        hlaskaArray[0].display();

        document.getElementById("teacherSelect").options =
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
