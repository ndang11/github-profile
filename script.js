const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const results = document.getElementById('results')

searchBtn.addEventListener('click', searchUser)

async function searchUser () {
  const query = searchInput.value.trim()

  if (!query) return

  results.innerHTML = 'Loading...'

  try {
    const res = await fetch(`https://api.github.com/search/users?q=${query}`)
    const data = await res.json()

    results.innerHTML = ''

    if (data.items.length === 0) {
      results.innerHTML = 'No users found'
      return
    }

    for (const user of data.items) {
      const profileRes = await fetch(
        `https://api.github.com/users/${user.login}`
      )
      const profile = await profileRes.json()

      const div = document.createElement('div')
      div.classList.add('user')

      div.innerHTML = `
        <img src="${profile.avatar_url}" class="avatar" />

        <h3>${profile.name || profile.login}</h3>

        <p>${profile.bio || 'No bio available'}</p>

        <p>
          Followers: ${profile.followers} |
          Following: ${profile.following}
        </p>

        <small>Repos: ${profile.public_repos}</small>
      `
      div.addEventListener('click', () => {
        window.open(profile.html_url, '_blank')
      })

      results.appendChild(div)
    }
  } catch (error) {
    results.innerHTML = 'Error fetching users'
    console.error(error)
  }
}
