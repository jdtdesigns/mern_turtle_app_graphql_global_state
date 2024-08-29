import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { ADD_TURTLE, EDIT_TURTLE, DELETE_TURTLE } from '../graphql/mutations'
import { GET_USER_TURTLES, GET_ALL_TURTLES } from '../graphql/queries'

const initialFormData = {
  name: '',
  weapon: '',
  headbandColor: ''
}

function Dashboard() {
  const [formData, setFormData] = useState(initialFormData)
  const [turtles, setTurtles] = useState([])
  const [editData, setEditData] = useState({
    _id: '',
    name: '',
    weapon: '',
    headbandColor: ''
  })
  const [addTurtle] = useMutation(ADD_TURTLE, {
    variables: formData,
    refetchQueries: [GET_USER_TURTLES, GET_ALL_TURTLES]
  })

  const [editTurtle] = useMutation(EDIT_TURTLE, {
    refetchQueries: [GET_USER_TURTLES, GET_ALL_TURTLES]
  })

  const [deleteTurtle] = useMutation(DELETE_TURTLE, {
    refetchQueries: [GET_USER_TURTLES, GET_ALL_TURTLES]
  })

  useQuery(GET_USER_TURTLES, {
    onCompleted(data) {
      setTurtles(data.getUserTurtles.map(tObj => ({
        ...tObj,
        edit: false
      })))
    },

  })

  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!formData.name || !formData.weapon || !formData.headbandColor) {
      return
    }

    try {
      await addTurtle()

      setFormData({
        ...initialFormData
      })
    } catch (error) {
      console.log('add turtle error', error)
    }
  }

  const handleDeleteTurtle = async (id) => {
    try {
      await deleteTurtle({
        variables: {
          turtle_id: id
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditInputChange = event => {
    // Handles the current turtle article inputs that are being updated
    setEditData({
      ...editData,
      [event.target.name]: event.target.value
    })
  }

  const toggleEditMode = turtleObj => {
    // When the edit button on an article is clicked, we pass the turtle object and use that to update the edit form data in state
    // That sets the edit form inputs to the turtle's values
    setEditData({
      ...editData,
      _id: turtleObj._id,
      name: turtleObj.name,
      weapon: turtleObj.weapon,
      headbandColor: turtleObj.headbandColor
    })

    // We also need to show the edit form, so we map over the array of turtles and change the turtle object that we are updating to have a edit property of true
    // That will trigger that singular article to show the form
    setTurtles(turtles.map(tObj => tObj._id === turtleObj._id ? ({ ...tObj, edit: true }) : ({ ...tObj, edit: false })))
  }

  const cancelEditMode = event => {
    event.preventDefault()

    // To close the edit form, we just map over the turtle objects and set the edit properties all back to false
    setTurtles(turtles.map(tObj => ({ ...tObj, edit: false })))
  }

  const handleEditTurtle = async event => {
    event.preventDefault()

    try {
      // We send the new turtle data to the backend resolver
      await editTurtle({
        variables: editData
      })

      // We map over the turtle objects and set all the edit properties to false and update the turtle object we were editing to have the new properties
      // Basically, this triggers the DOM to show our change to the turtle information once we hit 'save' on the edit form
      setTurtles(turtles.map(tObj => tObj._id === editData._id ? ({ ...editData, edit: false }) : ({ ...tObj, edit: false })))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="column">
        <h2 className="text-center">Add a Ninja Turtle</h2>

        <input
          type="text"
          onChange={handleInputChange}
          value={formData.name}
          name="name"
          placeholder="Enter the Turtle's name (Must be a renaissance artist)"
          required />
        <input
          type="text"
          onChange={handleInputChange}
          value={formData.weapon}
          name="weapon"
          placeholder="Enter the Turtle's weapon"
          required />
        <input
          type="text"
          onChange={handleInputChange}
          value={formData.headbandColor}
          name="headbandColor"
          placeholder="Enter the Turtle's headband color"
          required />

        <button>Add</button>
      </form>

      <section className="turtle-container">
        <h1>Your Turtles:</h1>

        {!turtles.length && <h2>No turtles have beed added.</h2>}

        <div className="turtle-output">
          {turtles.map(turtleObj => (
            <article key={turtleObj._id}>
              {turtleObj.edit ? (
                <form className="column">
                  <h4 className="text-center">Edit Turtle</h4>
                  <input type="text" onChange={handleEditInputChange} name="name" value={editData.name} />
                  <input type="text" onChange={handleEditInputChange} name="weapon" value={editData.weapon} />
                  <input type="text" onChange={handleEditInputChange} name="headbandColor" value={editData.headbandColor} />
                  <button onClick={handleEditTurtle}>Save</button>
                  {/* This button closes the edit form */}
                  <button className="cancel-btn" onClick={cancelEditMode}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="content">
                    <h3>{turtleObj.name}</h3>
                    <p>Weapon: {turtleObj.weapon}</p>
                    <p>Headband: {turtleObj.headbandColor}</p>
                  </div>
                </>
              )}
              <div className="row">
                {/* This button triggers the edit form to show up */}
                <button className="edit-btn" onClick={() => toggleEditMode(turtleObj)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteTurtle(turtleObj._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Dashboard