import React from "react";

import Dialog from "./dialog";

export default function FailDialog({open, setOpen}) {
  return (
    <Dialog
      isOpen={open}
      onRequestClose={()=> setOpen(false)}
      contentLabel="Failure"
      width={600}
    >
      <h1>Oh no!</h1>
      <p>Something went wrong with your changes.</p>
      <p><b>If this issue continues, get in touch with anthony@nquiringminds.com</b></p>
    </Dialog>
  )
}