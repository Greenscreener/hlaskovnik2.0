// Custom Bulma modals, copy-pasted from my code from gbl.cz
function modal(header, text, color, ...buttons) {
    return new Promise((resolve, reject) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <article class="message is-${color}">
                        <div class="message-header">
                            <p>${header}</p>
                        </div>
                        <div class="message-body">
                            ${text}
                            <div class="buttons"></div>
                        </div>
                    </article>
                </div>
            </div>
        `;
        const closeButton = document.createElement("button");
        closeButton.className = "delete";
        closeButton.addEventListener("click", () => {div.parentElement.removeChild(div); reject();});
        div.querySelectorAll(".message-header")[0].appendChild(closeButton);
        for (let i = 0; i < buttons.length; i++) {
            const button = document.createElement("button");
            button.className = "button is-" + color;
            button.addEventListener("click", () => {div.parentElement.removeChild(div); resolve(buttons[i]);});
            button.innerText = buttons[i];
            div.querySelectorAll(".buttons")[0].appendChild(button);
        }
        document.body.appendChild(div);
    });
}