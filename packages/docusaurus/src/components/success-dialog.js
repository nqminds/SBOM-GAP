import React from "react";

import Dialog from "./dialog";

export default function SuccessDialog({open, setOpen}) {
  return (
    <Dialog
      isOpen={open}
      onRequestClose={()=> setOpen(false)}
      contentLabel="Success"
      width={600}
    >
      <h1>Success!</h1>
      <p>Your changes have been made, please wait a few minutes for the server and website to update.</p>
      <p><b>You can still make edits to the site!</b></p>
    </Dialog>
  )
}