import React, { useState } from "react"
import { Box } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import EdiText from "react-editext"

const AddOrRemove = () => {
  const [whitelist, setWhiteList] = useState([])
  const addItem = () => {
    let newValue = document.getElementById("whiteList").value
    setWhiteList([...whitelist, newValue])
  }

  const deleteItem = (index) => {
    whitelist.splice(index, 1)
    setWhiteList([...whitelist])
  }
  const editItem = (item, index) => {
    let copiedlist = [...whitelist]
    copiedlist[index] = item
    setWhiteList(copiedlist)
  }

  let onSave = (val) => {}

  return (
    <>
      <Box p="50px">
        <EdiText
          type="text"
          value="What is real? How do you define real?"
          onSave={onSave}
        />
      </Box>

      <h1>Add Or Remove</h1>
      {/* <Icon color="primary">add_circle</Icon> */}
      <Box px="100px" py="30px">
        {/* <input id="whiteList" type="text" /> */}
        <div id="whiteList">
          <input
            className="rd"
            type="radio"
            name="radio-set"
            id="radio-1"
            value="Normal Radio"
          />
          <TextField
            id="outlined-read-only-input"
            label="Outlined"
            variant="outlined"
            defaultValue="Near Ramada Hotel Near Ramada Hotel Near Ramada Hotel Near Ramada Hotel"
            InputProps={{
              readOnly: true
            }}
          />
          {/* <Box>
            <EditIcon onClick={()=>}/>
          </Box> */}
        </div>
        <Box>
          <IconButton color="primary" aria-label="add to shopping cart">
            <AddShoppingCartIcon onClick={addItem} />
          </IconButton>
        </Box>

        {whitelist.map((item, index) => {
          return (
            <>
              <Box key={index}>
                {/* <input
                  type="text"
                  value={item}
                  onChange={(e) => editItem(e.target.value, index)}
                /> */}
                <div id="whiteList">
                  <input
                    className="rd"
                    type="radio"
                    name="radio-set"
                    id="radio-1"
                  />
                  <TextField
                    id="outlined-read-only-input"
                    aria-readonly
                    label="Outlined"
                    variant="outlined"
                    onChange={(e) => editItem(e.target.value, index)}
                    value={item}
                  />
                </div>

                <IconButton aria-label="delete">
                  <DeleteIcon onClick={() => deleteItem(index)} />
                </IconButton>
              </Box>
            </>
          )
        })}
      </Box>
    </>
  )
}

export default AddOrRemove
