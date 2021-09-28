(function () {
    async function getData(){
        const endpoint = "https://api.github.com/users/uheplm";
        let data = await fetch(endpoint);
        return data.json()
    }
    window.addEventListener("load", async () => {
        let user = await getData();
        document.getElementById("repos").innerHTML = user.public_repos;
        document.getElementById("followers").innerHTML = user.followers;
        document.getElementById("following").innerHTML = user.following;
    })
})()