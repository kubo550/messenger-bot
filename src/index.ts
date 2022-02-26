import axios from "axios";

const getInfo = async () => {
    const { data } = await axios.get('https://api.github.com/users/octocat')
    console.log(data)
}

getInfo().then(() => {
    console.log('done')
})