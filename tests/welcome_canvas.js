const jsonData = {
    pfp_url: 'https://cdn.discordapp.com/avatars/774409449476980746/d28a9003bda6248930aea349ad8cc2ba.webp?size=256',
    username: 'mariiidk'
};

fetch('http://localhost:4444/welcome_canv', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(jsonData)
})
.then(res => {
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.text();
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
})