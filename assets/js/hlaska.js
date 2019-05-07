class Hlaska {
    constructor(data) {
        this.data = data;
        this.element = document.createElement("div");
        this.element.innerHTML = `
        <div class="box">
            <div class="hlaska-content">
                <p><strong>${escapeHTML(data.teacher.name)}</strong> &nbsp; <small>${escapeHTML(data.date)}</small></p>
                <p>${escapeHTML(data.content)}</p>
                <div class="level is-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <a class="likes">
                                <span class="like-icon liked">
                                    <i class="fas fa-heart"></i>
                                </span>
                                <span class="like-icon not-liked">
                                    <i class="far fa-heart"></i>
                                </span>
                                <span class="n-likes">
                                    ${escapeHTML(data.likes)}
                                </span>
                            </a>
                        </div>
                        <div class="level-item">
                            <a class="share">
                                <i class="fas fa-share"></i>
                            </a>
                        </div>
                    </div>
                    <div class="level-right">
                        <span class="edited ${data.edited ? "active " : ""}has-text-grey-light">
                            <i class="fas fa-pen"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>     
        `;
    }
}