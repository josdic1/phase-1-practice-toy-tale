let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector('.add-toy-form')
  const toyCollection = document.querySelector("#toy-collection");
 const nameField = form.getElementsByClassName('input-text')[0]
 const imageField = form.getElementsByClassName('input-text')[1]
let selectedToy = {}

let formData = { 
  name: '', 
  image: '',
  likes: 0
}
let toyList = []


  async function getToys() {
    try {
      const r = await fetch(`http://localhost:3000/toys`) 
      if(!r.ok) {
        throw new Error ('Error')
      }
      const data = await r.json()
      renderList(data)
      toyList = data
    }catch(error) {
      error
    }
  }
  getToys()

  function renderList(data) {
    const datalist = data.map(item => (
      `<div id="${item.id} name="${item.name}" class="card">
      <h2>${item.name}</h2>
      <img src="${item.image}" class="toy-avatar"/>
      <p id='like-total'>Likes: ${item.likes}</p>
      <button type='button' id='${item.id}' class="like-btn" >Like ❤️</button>
      </div>`
    )).join('')
    toyCollection.innerHTML = datalist
  }



toyCollection.addEventListener('click', function(e) {
  if(e.target.classList.contains('like-btn')) {
    const { id } = e.target
    const toyObj = toyList.find(toy => toy.id === id)
    const updatedToy = {
      ...toyObj,
      likes: toyObj.likes +=1
    }
    addLike(updatedToy)
  } else {
    console.error('no like-btn found')
  }
  })


  async function addLike(toy) {
    try {
      const r = await fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toy)
      })
      if(!r.ok) {
        throw new Error ('Unable to fetch toys')
      }
      const data = await r.json()
      const updatedToy = {
        ...data,
        likes: toy.likes
      }
      const updatedList = toyList.map(toy => 
        toy.id === updatedToy.id ? updatedToy : toy
      )
      renderList(updatedList)
    }catch(error) {
      console.error(error)
    }
  }

  nameField.addEventListener('input', function (e) {
   const nameVal = e.target.value
  nameVal.type= 'text'
  return nameVal
  })

  imageField.addEventListener('input', function (e) {
    const imageVal = e.target.value
    imageVal.type = 'url'
    return imageVal
   })

   form.addEventListener('submit', function (e) {
    e.preventDefault()
    formData = {
      name: nameField.value || '',
      image: imageField.value || '',
      likes: 0
    }
    toyFormContainer.style.display = "none";
    postToy(formData)
    nameField.value = ''
    imageField.value = ''
   })

 

async function postToy(newToy) {
  try {
    const r = await fetch(`http://localhost:3000/toys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    if(!r.ok) {
      throw new Error ('Unable to fetch toys')
    }
    const data = await r.json()
    const updatedList = [...toyList, data]
    renderList(updatedList)
    toyList = updatedList
  }catch(error) {
    console.error(error)
  }
}




  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


});
