class Hlaska {
    like() {
        if (this.liked === false) {
            this.liked = true;
            this.likeButton.classList.toggle("liked");
            this.likeButton.querySelector(".n-likes").innerHTML = this.data.likes + 1;
        } else {
            this.liked = false;
            this.likeButton.classList.toggle("liked");
            this.likeButton.querySelector(".n-likes").innerHTML = this.data.likes;
        }
    }
    constructor(data) {
        this.data = data;
        this.element = document.createElement("div");
        this.liked = false;
        this.element.innerHTML = `
        <div class="box quote">
            <div class="hlaska-content">
                <p><strong>${escapeHTML(this.data.teacher.name)}</strong> &nbsp; <small>${escapeHTML(new Date(this.data.date).toLocaleDateString())}</small></p>
                <p>${escapeHTML(this.data.content)}</p>
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
                                    ${escapeHTML(this.data.likes)}
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
                        <span class="edited ${this.data.edited ? "active " : ""}has-text-grey-light">
                            <i class="fas fa-pen"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>     
        `;
        this.likeButton = this.element.querySelector(".likes");
        this.likeButton.addEventListener("click", () => this.like());
    }
}