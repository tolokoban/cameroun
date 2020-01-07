export default {
    /**
     * Wait for the splash hidding animation to finish.
     */
    async hide() {
        return new Promise(resolve => {
            const body = document.body;
            body.classList.add("start");

            window.setTimeout(() => {
                const splash1 = document.getElementById("splash1");
                if (splash1) body.removeChild(splash1);
                const splash2 = document.getElementById("splash2");
                if (splash2) body.removeChild(splash2);
                resolve()
            }, 1000)
        })
    }
}
