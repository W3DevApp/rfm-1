import React, { useState, useEffect, useRef } from "react"
import { Button } from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'


const API = 'http://your_backend_host:your_backend_port'

export const Notes = () => {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editing, setEditing] = useState(false)
  const [id, setId] = useState("")
  const titleInput = useRef(null)

  let [notes, setNotes] = useState([])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editing) {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
      const data = await res.json()
      console.log(data)

    } else {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
      const data = await res.json()
      console.log(data)

      setEditing(false)
      setId("")
    }
    await getNotes()
    setTitle("")
    setContent("")

    titleInput.current.focus()
  }
  const getNotes = async () => {
    const res = await fetch(`${API}/notes`)
    const data = await res.json()

    setNotes(data)
  }

  const deleteNote = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?")
    if (userResponse) {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      console.log(data)
      await getNotes()
    }
  }
  const editNote = async (id) => {
    const res = await fetch(`${API}/notes/${id}`)
    const data = await res.json()
    setEditing(true)
    setId(id)

    setTitle(data.title)
    setContent(data.content)

    titleInput.current.focus()
  }

  useEffect(() => {
    getNotes()
  }, [])

  return (
    <div className="row">

      <div className="col-md-4">

        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <Input placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              ref={titleInput}
              autoFocus
            />
          </div>

          <div className="form-group">
            <Input placeholder="Content"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>

          <Button
            type="submit"
            size="small"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {editing ? "Update" : "Create"}
          </Button>
        </form>
      </div>

      <div className="col-md-6">
        <table className="table table-striped border">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id}>
                <td>{note.title}</td>

                <td>{note.content}</td>
                <td>
                  <IconButton aria-label="edit" onClick={(e) => editNote(note._id)}>
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={(e) => deleteNote(note._id)}>
                    <DeleteIcon fontSize="small" color="secondary" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
