// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

// The "parent" that handles the data and tells the child state what to display
function MyApp() {
  const [characters, setCharacters] = useState([]);
  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  } 

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function removeOneCharacter(id) {
  fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        const updated = characters.filter((character) => character.id !== id);
        setCharacters(updated);
      } else if (res.status === 404) {
        console.log("Resource not found");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

  function updateList(person) { 
    postUser(person)
      .then((res) => res.status == 201 ?
      res.json() : undefined
      ).then((json) => setCharacters([...characters, json]))
      .catch((error) => {
        console.log(error);
      })
  } 
  
  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);
}


export default MyApp;